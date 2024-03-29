import os
from dotenv import load_dotenv

base_dir = os.path.abspath(os.path.dirname(__file__))

# search for .env in the parent directory
load_dotenv(os.path.join(base_dir, "..", ".env"))


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.environ.get("DATABASE_URL")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_SAME_SITE = "None"
