from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Problem, User, Organization, Confirmation, SolverAdoption
from ..schemas import DashboardStats

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get overall platform statistics."""
    total_problems = db.query(Problem).count()
    total_users = db.query(User).count()
    total_orgs = db.query(Organization).count()
    total_confirmations = db.query(Confirmation).count()
    total_adoptions = db.query(SolverAdoption).count()
    
    # Problems by status
    status_counts = db.query(
        Problem.status, func.count(Problem.id)
    ).group_by(Problem.status).all()
    problems_by_status = {status: count for status, count in status_counts}
    
    # Problems by category
    category_counts = db.query(
        Problem.ai_category, func.count(Problem.id)
    ).group_by(Problem.ai_category).all()
    problems_by_category = {
        (cat or "Uncategorized"): count for cat, count in category_counts
    }
    
    return DashboardStats(
        total_problems=total_problems,
        total_users=total_users,
        total_organizations=total_orgs,
        problems_by_status=problems_by_status,
        problems_by_category=problems_by_category,
        total_confirmations=total_confirmations,
        total_adoptions=total_adoptions
    )


@router.get("/priority-list")
def get_priority_list(limit: int = 10, db: Session = Depends(get_db)):
    """Get top priority problems."""
    problems = db.query(Problem).order_by(
        Problem.priority_score.desc()
    ).limit(limit).all()
    
    return [
        {
            "id": p.id,
            "problem_id": p.problem_id,
            "title": p.title,
            "category": p.ai_category,
            "status": p.status,
            "priority_score": p.priority_score,
            "priority_breakdown": p.priority_breakdown,
            "confirmation_count": p.confirmation_count,
            "location": p.location,
            "severity": p.severity
        }
        for p in problems
    ]


@router.get("/recent-activity")
def get_recent_activity(limit: int = 20, db: Session = Depends(get_db)):
    """Get recent platform activity."""
    # Recent problems
    recent_problems = db.query(Problem).order_by(
        Problem.created_at.desc()
    ).limit(limit).all()
    
    # Recent confirmations
    recent_confirmations = db.query(Confirmation).order_by(
        Confirmation.created_at.desc()
    ).limit(limit).all()
    
    activities = []
    
    for p in recent_problems:
        activities.append({
            "type": "problem_submitted",
            "title": f"New problem: {p.title}",
            "category": p.ai_category,
            "timestamp": p.created_at.isoformat(),
            "problem_id": p.id
        })
    
    for c in recent_confirmations:
        problem = db.query(Problem).filter(Problem.id == c.problem_id).first()
        user = db.query(User).filter(User.id == c.user_id).first()
        activities.append({
            "type": "confirmation",
            "title": f"{user.name if user else 'Someone'} confirmed: {problem.title if problem else 'a problem'}",
            "timestamp": c.created_at.isoformat(),
            "problem_id": c.problem_id
        })
    
    # Sort by timestamp
    activities.sort(key=lambda x: x["timestamp"], reverse=True)
    return activities[:limit]
