from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import jwt
from datetime import datetime, timedelta, timezone
from ..database import get_db
from ..models import User
from ..schemas import UserRegister, UserLogin, UserResponse, TokenResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

SECRET_KEY = "sih-innovation-hub-secret-key-2026"  # For prototype only
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = None, db: Session = None):
    """Dependency to extract user from token."""
    pass  # Implemented via middleware in main.py


@router.post("/register", response_model=TokenResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    # Check if phone already exists
    existing = db.query(User).filter(User.phone == user_data.phone).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number already registered"
        )
    
    user = User(
        name=user_data.name,
        phone=user_data.phone,
        role=user_data.role,
        organization_id=user_data.organization_id
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user)
    )


@router.post("/login", response_model=TokenResponse)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    # Mock OTP: accept any 6-digit code
    if len(login_data.otp) != 6 or not login_data.otp.isdigit():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP. Please enter a 6-digit code."
        )
    
    user = db.query(User).filter(User.phone == login_data.phone).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Phone number not registered. Please register first."
        )
    
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user)
    )


@router.get("/me", response_model=UserResponse)
def get_me(db: Session = Depends(get_db), user_id: int = None):
    # In real app, extract from JWT. For prototype, accept query param or header.
    from fastapi import Request
    # This will be handled by the dependency injection in main.py
    if user_id:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            return UserResponse.model_validate(user)
    raise HTTPException(status_code=401, detail="Not authenticated")
