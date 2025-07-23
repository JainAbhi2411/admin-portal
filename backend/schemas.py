from pydantic import BaseModel
from typing import Optional

class TenantCreate(BaseModel):
    name: str
    email: str
    timezone: str

class TenantOut(BaseModel):
    id: int
    name: str
    email: str
    timezone: str
    pipeline_enabled: bool
    class Config:
        orm_mode = True

class ConfigCreate(BaseModel):
    tenant_id: int
    host: str
    port: str
    username: str
    password: str

class ConfigOut(ConfigCreate):
    id: int
    class Config:
        orm_mode = True

class PipelineToggle(BaseModel):
    pipeline_enabled: bool

class UserLogin(BaseModel):
    username: str
    password: str
