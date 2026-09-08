from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Problem, Confirmation, User
from ..schemas import ConfirmationCreate, ConfirmationResponse
from ..priority import calculate_priority
from typing import List

router = APIRouter(prefix="/api/problems", tags=["Validations"])


@router.post("/{problem_id}/confirm", response_model=ConfirmationResponse)
def confirm_problem(
    problem_id: int,
    data: ConfirmationCreate,
    user_id: int = Query(..., description="Current user ID"),
    db: Session = Depends(get_db)
):
    """Confirm a problem — 'I also face this issue'."""
    problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Dedup: check if user already confirmed
    existing = db.query(Confirmation).filter(
        Confirmation.problem_id == problem_id,
        Confirmation.user_id == user_id
    ).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="You have already confirmed this problem"
        )
    
    confirmation = Confirmation(
        problem_id=problem_id,
        user_id=user_id,
        note=data.note
    )
    db.add(confirmation)
    
    # Update confirmation count
    problem.confirmation_count = (problem.confirmation_count or 0) + 1
    
    # Recalculate priority
    priority = calculate_priority(
        confirmation_count=problem.confirmation_count,
        has_evidence=bool(problem.evidence_urls),
        evidence_count=len(problem.evidence_urls or []),
        severity=problem.severity,
        description=problem.description,
        is_validated=problem.status in ["community_validated", "under_review", "adopted"]
    )
    problem.priority_score = priority["total"]
    problem.priority_breakdown = priority
    
    # Auto-update status if enough confirmations
    if problem.confirmation_count >= 5 and problem.status == "published":
        problem.status = "community_validated"
    
    db.commit()
    db.refresh(confirmation)
    
    return ConfirmationResponse(
        id=confirmation.id,
        problem_id=confirmation.problem_id,
        user_id=confirmation.user_id,
        user_name=user.name,
        note=confirmation.note,
        created_at=confirmation.created_at
    )


@router.get("/{problem_id}/confirmations", response_model=List[ConfirmationResponse])
def list_confirmations(problem_id: int, db: Session = Depends(get_db)):
    """List all confirmations for a problem."""
    confirmations = db.query(Confirmation).filter(
        Confirmation.problem_id == problem_id
    ).order_by(Confirmation.created_at.desc()).all()
    
    results = []
    for c in confirmations:
        user = db.query(User).filter(User.id == c.user_id).first()
        results.append(ConfirmationResponse(
            id=c.id,
            problem_id=c.problem_id,
            user_id=c.user_id,
            user_name=user.name if user else "Unknown",
            note=c.note,
            created_at=c.created_at
        ))
    return results
