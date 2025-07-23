from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# For local development
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://admindashboard_gn0p_user:xUlQuEfWBXgVbgEHS0pRs1dp58KJVX6J@dpg-d20a50ngi27c73cbsga0-a:5432/admindashboard_gn0p")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
