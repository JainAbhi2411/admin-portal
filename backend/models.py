from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Tenant(Base):
    __tablename__ = 'tenants'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)
    timezone = Column(String)
    pipeline_enabled = Column(Boolean, default=False)
    configs = relationship("SourceConfig", back_populates="tenant")

class SourceConfig(Base):
    __tablename__ = 'source_configs'
    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
    host = Column(String)
    port = Column(String)
    username = Column(String)
    password = Column(String)

    tenant = relationship("Tenant", back_populates="configs")

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    password = Column(String)
    role = Column(String)  # 'admin' or 'viewer'
