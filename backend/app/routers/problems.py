from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import Optional, List
import os
import uuid
from ..database import get_db
from ..models import Problem, User, Confirmation, StakeholderMapping
from ..schemas import (
    ProblemCreate, ProblemUpdate, ProblemResponse, ProblemListResponse,
    StakeholderMappingResponse
)
from ..ai_module import analyze_problem
from ..priority import calculate_priority

router = APIRouter(prefix="/api/problems", tags=["Problems"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


def _generate_problem_id(db: Session) -> str:
    """Generate next problem ID like P001, P002, etc."""
    last = db.query(Problem).order_by(desc(Problem.id)).first()
    num = (last.id + 1) if last else 1
    return f"P{num:03d}"


def _to_response(problem: Problem, db: Session) -> ProblemResponse:
    """Convert Problem model to response with submitter name."""
    submitter = db.query(User).filter(User.id == problem.submitted_by).first()
    return ProblemResponse(
        id=problem.id,
        problem_id=problem.problem_id,
        title=problem.title,
        description=problem.description,
        category=problem.ai_category or problem.category,
        status=problem.status,
        location=problem.location,
        severity=problem.severity,
        evidence_urls=problem.evidence_urls or [],
        ai_summary=problem.ai_summary,
        ai_category=problem.ai_category,
        ai_tags=problem.ai_tags or [],
        ai_domains=problem.ai_domains or [],
        ai_duplicate_hint=problem.ai_duplicate_hint,
        priority_score=problem.priority_score or 0.0,
        priority_breakdown=problem.priority_breakdown or {},
        confirmation_count=problem.confirmation_count or 0,
        submitted_by=problem.submitted_by,
        submitter_name=submitter.name if submitter else "Unknown",
        created_at=problem.created_at,
        updated_at=problem.updated_at
    )


@router.post("", response_model=ProblemResponse)
def create_problem(
    problem_data: ProblemCreate,
    user_id: int = Query(..., description="Current user ID"),
    db: Session = Depends(get_db)
):
    """Submit a new problem."""
    # Verify user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create problem
    problem = Problem(
        problem_id=_generate_problem_id(db),
        title=problem_data.title,
        description=problem_data.description,
        location=problem_data.location,
        severity=problem_data.severity,
        category=problem_data.category,
        submitted_by=user_id,
        status="submitted"
    )
    
    # Run AI analysis
    ai_result = analyze_problem(problem_data.title, problem_data.description)
    problem.ai_summary = ai_result["summary"]
    problem.ai_category = ai_result["suggested_category"]
    problem.ai_tags = ai_result["tags"]
    problem.ai_domains = ai_result["possible_domains"]
    problem.ai_duplicate_hint = ai_result["possible_duplicate_query"]
    
    # Calculate initial priority
    priority = calculate_priority(
        confirmation_count=0,
        has_evidence=False,
        severity=problem_data.severity,
        description=problem_data.description
    )
    problem.priority_score = priority["total"]
    problem.priority_breakdown = priority
    
    # Set status to published (auto-publish for prototype)
    problem.status = "published"
    
    db.add(problem)
    db.commit()
    db.refresh(problem)
    
    return _to_response(problem, db)


@router.post("/{problem_id}/upload")
async def upload_evidence(
    problem_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload evidence file for a problem."""
    problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    # Save file
    ext = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    filename = f"{problem.problem_id}_{uuid.uuid4().hex[:8]}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    content = await file.read()
    with open(filepath, "wb") as f:
        f.write(content)
    
    # Update evidence URLs
    urls = problem.evidence_urls or []
    urls.append(f"/uploads/{filename}")
    problem.evidence_urls = urls
    
    # Recalculate priority with evidence
    priority = calculate_priority(
        confirmation_count=problem.confirmation_count or 0,
        has_evidence=True,
        evidence_count=len(urls),
        severity=problem.severity,
        description=problem.description
    )
    problem.priority_score = priority["total"]
    problem.priority_breakdown = priority
    
    db.commit()
    return {"filename": filename, "url": f"/uploads/{filename}"}


@router.get("", response_model=ProblemListResponse)
def list_problems(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    status: Optional[str] = None,
    location: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = Query("recent", description="recent, priority, confirmations"),
    db: Session = Depends(get_db)
):
    """List problems with filters."""
    query = db.query(Problem)
    
    if category:
        query = query.filter(Problem.ai_category == category)
    if status:
        query = query.filter(Problem.status == status)
    if location:
        query = query.filter(Problem.location.ilike(f"%{location}%"))
    if search:
        query = query.filter(
            (Problem.title.ilike(f"%{search}%")) |
            (Problem.description.ilike(f"%{search}%")) |
            (Problem.ai_category.ilike(f"%{search}%"))
        )
    
    total = query.count()
    
    # Sorting
    if sort_by == "priority":
        query = query.order_by(desc(Problem.priority_score))
    elif sort_by == "confirmations":
        query = query.order_by(desc(Problem.confirmation_count))
    else:  # recent
        query = query.order_by(desc(Problem.created_at))
    
    problems = query.offset((page - 1) * page_size).limit(page_size).all()
    
    return ProblemListResponse(
        problems=[_to_response(p, db) for p in problems],
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    """Get all available categories with counts."""
    categories = db.query(
        Problem.ai_category, func.count(Problem.id)
    ).group_by(Problem.ai_category).all()
    
    return [
        {"category": cat or "Uncategorized", "count": count}
        for cat, count in categories
    ]


@router.get("/stakeholder-mapping", response_model=List[StakeholderMappingResponse])
def get_stakeholder_mapping(db: Session = Depends(get_db)):
    """Get the stakeholder mapping table."""
    mappings = db.query(StakeholderMapping).all()
    return [StakeholderMappingResponse.model_validate(m) for m in mappings]


@router.get("/{problem_id}", response_model=ProblemResponse)
def get_problem(problem_id: int, db: Session = Depends(get_db)):
    """Get problem detail."""
    problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return _to_response(problem, db)


@router.patch("/{problem_id}", response_model=ProblemResponse)
def update_problem(
    problem_id: int,
    update_data: ProblemUpdate,
    db: Session = Depends(get_db)
):
    """Update problem status or category."""
    problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    if update_data.status:
        problem.status = update_data.status
    if update_data.category:
        problem.category = update_data.category
    
    db.commit()
    db.refresh(problem)
    return _to_response(problem, db)
