from sqlalchemy.orm import Session
import models, schemas
from passlib.hash import bcrypt
from models import SourceConfig

def create_tenant(db: Session, tenant: schemas.TenantCreate):
    new_tenant = models.Tenant(**tenant.dict())
    db.add(new_tenant)
    db.commit()
    db.refresh(new_tenant)
    return new_tenant

def get_tenants(db: Session):
    return db.query(models.Tenant).all()

def save_config(db, config: schemas.ConfigCreate):
    new_config = SourceConfig(
        tenant_id=config.tenant_id,
        host=config.host,
        port=config.port,
        username=config.username,
        password=config.password
    )
    db.add(new_config)
    db.commit()
    db.refresh(new_config)
    return new_config

def toggle_pipeline(db: Session, tenant_id: int, state: bool):
    tenant = db.query(models.Tenant).filter(models.Tenant.id == tenant_id).first()
    if tenant:
        tenant.pipeline_enabled = state
        db.commit()
        db.refresh(tenant)
        return tenant

def create_user(db: Session, username: str, password: str, role: str):
    hashed = bcrypt.hash(password)
    user = models.User(username=username, password=hashed, role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(models.User).filter(models.User.username == username).first()
    if user and bcrypt.verify(password, user.password):
        return user
    return None
