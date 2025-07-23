from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
from fastapi.security import OAuth2PasswordBearer


import models, schemas, crud
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:5173",  # React dev
    "https://admin-portal.netlify.app",  # add Netlify URL if deploying
]

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # can use ["*"] for public API (less secure)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],    
)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# JWT Config
SECRET_KEY = "vgl92tV0vrjh2ite05Sxsjdoi1R0pmmXZk2l9OAr_wQ"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(status_code=401, detail="Invalid credentials")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.username == username).first()
    
    if user is None:
        raise credentials_exception
    return user

# ROUTES

@app.post("/auth/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.authenticate_user(db, user.username, user.password)
    if not db_user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    token = create_access_token(data={"sub": db_user.username, "role": db_user.role})
    return {"access_token": token, "token_type": "bearer", "role": db_user.role}

@app.post("/users/create")
def create_user(username: str, password: str, role: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create users")
    return crud.create_user(db, username, password, role)

@app.post("/tenants")
def create_tenant(tenant: schemas.TenantCreate, db: Session = Depends(get_db)):
    return crud.create_tenant(db, tenant)

@app.get("/tenants")
def list_tenants(db: Session = Depends(get_db)):
    return crud.get_tenants(db)

@app.post("/config")
def save_source_config(
    config: schemas.ConfigCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
    
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can configure sources")
    return crud.save_config(db, config)

@app.post("/pipeline/{tenant_id}/toggle")
def toggle_pipeline(tenant_id: int, toggle: schemas.PipelineToggle, db: Session = Depends(get_db)):
    return crud.toggle_pipeline(db, tenant_id, toggle.pipeline_enabled)

@router.get("/health")
def health_snapshot():
    tenants = get_all_tenants()  # Fetch from DB (example: [{"id": 1, "name": "Tenant A"}, ...])

    health_data = []
    for tenant in tenants:
        # Simulated logic for sync and error status
        last_sync_time = datetime.now() - timedelta(minutes=tenant["id"] * 15)
        status = "green" if tenant["id"] % 2 == 0 else "red"
        last_error = "None" if status == "green" else "Connection timeout"

        health_data.append({
            "tenant": tenant["name"],
            "last_sync": last_sync_time.strftime("%Y-%m-%d %H:%M"),
            "last_error": last_error,
            "status": status
        })

    return health_data
@app.get("/tenant/{tenant_id}/configs")
def get_configs_for_tenant(tenant_id: int, db: Session = Depends(get_db)):
    configs = db.query(models.SourceConfig).filter(models.SourceConfig.tenant_id == tenant_id).all()
    return [{
        "id": c.id,
        "host": c.host,
        "port": c.port,
        "username": c.username,
        "password":c.password,
        "tenant": {
            "id": c.tenant.id,
            "name": c.tenant.name,
            "email": c.tenant.email,
        }
    } for c in configs]