from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# === Auth ===
class UserRegister(BaseModel):
    name: str
    phone: str
    role: str = "citizen"  # citizen, validator, solver, admin
    organization_id: Optional[int] = None

class UserLogin(BaseModel):
    phone: str
    otp: str  # mock OTP - any 6-digit code works

class UserResponse(BaseModel):
    id: int
    name: str
    phone: str
    role: str
    organization_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# === Problems ===
class ProblemCreate(BaseModel):
    title: str
    description: str
    location: Optional[str] = None
    severity: str = "medium"  # low, medium, high
    category: Optional[str] = None

class ProblemUpdate(BaseModel):
    status: Optional[str] = None
    category: Optional[str] = None

class AIResult(BaseModel):
    ai_summary: str
    ai_category: str
    ai_tags: List[str]
    ai_domains: List[str]
    ai_duplicate_hint: Optional[str] = None

class PriorityBreakdown(BaseModel):
    community_signal: float
    evidence_score: float
    severity_signal: float
    urgency_signal: float
    validation_signal: float
    total: float

class ProblemResponse(BaseModel):
    id: int
    problem_id: str
    title: str
    description: str
    category: Optional[str] = None
    status: str
    location: Optional[str] = None
    severity: str
    evidence_urls: List[str] = []
    ai_summary: Optional[str] = None
    ai_category: Optional[str] = None
    ai_tags: List[str] = []
    ai_domains: List[str] = []
    ai_duplicate_hint: Optional[str] = None
    priority_score: float = 0.0
    priority_breakdown: dict = {}
    confirmation_count: int = 0
    submitted_by: int
    submitter_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ProblemListResponse(BaseModel):
    problems: List[ProblemResponse]
    total: int
    page: int
    page_size: int


# === Confirmations ===
class ConfirmationCreate(BaseModel):
    note: Optional[str] = None

class ConfirmationResponse(BaseModel):
    id: int
    problem_id: int
    user_id: int
    user_name: Optional[str] = None
    note: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# === Organizations ===
class OrganizationResponse(BaseModel):
    id: int
    name: str
    org_type: str
    expertise_tags: List[str] = []
    location: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True


# === Solver Adoption ===
class AdoptionCreate(BaseModel):
    notes: Optional[str] = None

class AdoptionResponse(BaseModel):
    id: int
    problem_id: int
    organization_id: int
    organization_name: Optional[str] = None
    status: str
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# === Milestones ===
class MilestoneCreate(BaseModel):
    title: str
    description: Optional[str] = None
    evidence_url: Optional[str] = None

class MilestoneResponse(BaseModel):
    id: int
    problem_id: int
    title: str
    description: Optional[str] = None
    evidence_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# === Dashboard ===
class DashboardStats(BaseModel):
    total_problems: int
    total_users: int
    total_organizations: int
    problems_by_status: dict
    problems_by_category: dict
    total_confirmations: int
    total_adoptions: int

class StakeholderMappingResponse(BaseModel):
    id: int
    category: str
    govt_body: Optional[str] = None
    university_expertise: List[str] = []
    startup_type: Optional[str] = None
    ngo_type: Optional[str] = None
    solution_path: Optional[str] = None

    class Config:
        from_attributes = True
