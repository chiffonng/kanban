import os

from auth import jwt
from database import db
from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from jwt import ExpiredSignatureError

from config import Config


def create_app(test_config=None):
    app = Flask(__name__)

    CORS(app, supports_credentials=True)

    app.config.from_object(Config)

    # Override config with test config if passed
    if test_config:
        app.config.update(test_config)

    jwt.init_app(app)
    db.init_app(app)

    @app.errorhandler(ExpiredSignatureError)
    def handle_expired_token(e):
        return jsonify({"error": "Token has expired"}), 401

    from models import User

    with app.app_context():
        db.create_all()

    # blueprint for auth routes in our app
    from auth import auth as auth_blueprint

    app.register_blueprint(auth_blueprint)

    from routes import api

    app.register_blueprint(api)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
