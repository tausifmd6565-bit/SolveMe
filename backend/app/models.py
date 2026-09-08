from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Enum as SAEnum, Boolean, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
from .database import Base


class UserRole(str, enum.Enum):
    CITIZEN = "citizen"
    VALIDATOR = "validator"
    SOLVER = "solver"
    ADMIN = "admin"


class ProblemStatus(str, enum.Enum):
    SUBMITTED = "submitted"
    PUBLISHED = "published"
    COMMUNITY_VALIDATED = "community_validated"
    UNDER_REVIEW = "under_review"
    ADOPTED = "adopted"
    IN_PROGRESS = "in_progress"
    PROTOTYPE_PILOT = "prototype_pilot"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class Severity(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(15), unique=True, nullable=False, index=True)
    role = Column(String(20), default=UserRole.CITIZEN.value)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    problems = relationship("Problem", back_populates="submitter")
    confirmations = relationship("Confirmation", back_populates="user")
    organization = relationship("Organization", back_populates="members")


class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(String(20), unique=True, index=True)  # e.g. P001
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=True)  # user-selected or AI
    status = Column(String(30), default=ProblemStatus.SUBMITTED.value)
    location = Column(String(200), nullable=True)
    severity = Column(String(10), default=Severity.MEDIUM.value)
    evidence_urls = Column(JSON, default=list)  # list of file paths/urls
    
    # AI-generated fields
    ai_summary = Column(Text, nullable=True)
    ai_category = Column(String(100), nullable=True)
    ai_tags = Column(JSON, default=list)
    ai_domains = Column(JSON, default=list)
    ai_duplicate_hint = Column(String(200), nullable=True)
    
    # Priority scoring
    priority_score = Column(Float, default=0.0)
    priority_breakdown = Column(JSON, default=dict)
    
    # Counts (denormalized for speed)
    confirmation_count = Column(Integer, default=0)
    
    submitted_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    submitter = relationship("User", back_populates="problems")
    confirmations = relationship("Confirmation", back_populates="problem", cascade="all, delete-orphan")
    adoptions = relationship("SolverAdoption", back_populates="problem")
    milestones = relationship("Milestone", back_populates="problem", cascade="all, delete-orphan")


class Confirmation(Base):
    __tablename__ = "confirmations"

    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    note = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    problem = relationship("Problem", back_populates="confirmations")
    user = relationship("User", back_populates="confirmations")


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    org_type = Column(String(50), nullable=False)  # university, startup, ngo, govt, industry
    expertise_tags = Column(JSON, default=list)
    location = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    members = relationship("User", back_populates="organization")
    adoptions = relationship("SolverAdoption", back_populates="organization")


class SolverAdoption(Base):
    __tablename__ = "solver_adoptions"

    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    status = Column(String(30), default="interested")  # interested, under_review, adopted, rejected
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    problem = relationship("Problem", back_populates="adoptions")
    organization = relationship("Organization", back_populates="adoptions")


class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    evidence_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    problem = relationship("Problem", back_populates="milestones")


class StakeholderMapping(Base):
    __tablename__ = "stakeholder_mappings"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(100), nullable=False, unique=True)
    govt_body = Column(String(200), nullable=True)
    university_expertise = Column(JSON, default=list)
    startup_type = Column(String(100), nullable=True)
    ngo_type = Column(String(100), nullable=True)
    solution_path = Column(String(200), nullable=True)
