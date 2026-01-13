from sqlmodel import SQLModel, create_engine

DATABASE_URL = "postgresql+psycopg://postgres:user@localhost:5432/eyeq"

engine = create_engine(DATABASE_URL, echo=True)
