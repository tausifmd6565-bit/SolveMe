from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Problem, Organization, SolverAdoption, Milestone, User
from ..schemas import (
    OrganizationResponse, AdoptionCreate, AdoptionResponse,
    MilestoneCreate, MilestoneResponse
)
from typing import List

router = APIRouter(prefix="/api", tags=["Solvers"])


@router.get("/organizations", response_model=List[OrganizationResponse])
def list_organizations(
    org_type: str = None,
    db: Session = Depends(get_db)
):
    """List solver organizations."""
    query = db.query(Organization)
    if org_type:
        query = query.filter(Organization.org_type == org_type)
    orgs = query.all()
    return [OrganizationResponse.model_validate(o) for o in orgs]


@router.post("/problems/{problem_id}/adopt", response_model=AdoptionResponse)
def adopt_problem(
    problem_id: int,
    data: AdoptionCreate,
    user_id: int = Query(..., description="Current user ID"),
    db: Session = Depends(get_db)
):
    """Express interest in solving a problem."""
    problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.organization_id:
        raise HTTPException(
            status_code=400,
            detail="User must belong to an organization to adopt problems"
        )
    
    # Check if org already expressed interest
    existing = db.query(SolverAdoption).filter(
        SolverAdoption.problem_id == problem_id,
        SolverAdoption.organization_id == user.organization_id
    ).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Your organization has already expressed interest"
        )
    
    adoption = SolverAdoption(
        problem_id=problem_id,
        organization_id=user.organization_id,
        notes=data.notes,
        status="interested"
    )
    db.add(adoption)
    db.commit()
    db.refresh(adoption)
    
    org = db.query(Organization).filter(Organization.id == user.organization_id).first()
    return AdoptionResponse(
        id=adoption.id,
        problem_id=adoption.problem_id,
        organization_id=adoption.organization_id,
        organization_name=org.name if org else None,
        status=adoption.status,
        notes=adoption.notes,
        created_at=adoption.created_at
    )


@router.get("/problems/{problem_id}/adoptions", response_model=List[AdoptionResponse])
def list_adoptions(problem_id: int, db: Session = Depends(get_db)):
    """List all adoption interests for a problem."""
    adoptions = db.query(SolverAdoption).filter(
        SolverAdoption.problem_id == problem_id
    ).all()
    
    results = []
    for a in adoptions:
        org = db.query(Organization).filter(Organization.id == a.organization_id).first()
        results.append(AdoptionResponse(
            id=a.id,
            problem_id=a.problem_id,
            organization_id=a.organization_id,
            organization_name=org.name if org else None,
            status=a.status,
            notes=a.notes,
            created_at=a.created_at
        ))
    return results


@router.patch("/adoptions/{adoption_id}")
def update_adoption_status(
    adoption_id: int,
    status: str = Query(..., description="New status: adopted, rejected, under_review"),
    db: Session = Depends(get_db)
):
    """Update adoption status (admin/validator action)."""
    adoption = db.query(SolverAdoption).filter(SolverAdoption.id == adoption_id).first()
    if not adoption:
        raise HTTPException(status_code=404, detail="Adoption not found")
    
    adoption.status = status
    
    # If adopted, update problem status too
    if status == "adopted":
        problem = db.query(Problem).filter(Problem.id == adoption.problem_id).first()
        if problem:
            problem.status = "adopted"
    
    db.commit()
    return {"message": "Status updated", "status": status}


@router.post("/problems/{problem_id}/milestones", response_model=MilestoneResponse)
def add_milestone(
    problem_id: int,
    data: MilestoneCreate,
    db: Session = Depends(get_db)
):
    """Add a progress milestone to an adopted problem."""
    problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    milestone = Milestone(
        problem_id=problem_id,
        title=data.title,
        description=data.description,
        evidence_url=data.evidence_url
    )
    db.add(milestone)
    
    # Update problem status if first milestone
    if problem.status == "adopted":
        problem.status = "in_progress"
    
    db.commit()
    db.refresh(milestone)
    return MilestoneResponse.model_validate(milestone)


@router.get("/problems/{problem_id}/milestones", response_model=List[MilestoneResponse])
def list_milestones(problem_id: int, db: Session = Depends(get_db)):
    """List milestones for a problem."""
    milestones = db.query(Milestone).filter(
        Milestone.problem_id == problem_id
    ).order_by(Milestone.created_at).all()
    return [MilestoneResponse.model_validate(m) for m in milestones]
