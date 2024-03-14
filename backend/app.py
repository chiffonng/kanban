import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from jwt import ExpiredSignatureError

from config import Config

db = SQLAlchemy()
jwt = JWTManager()


def create_app(test_config=None):
    app = Flask(__name__)

    CORS(app, supports_credentials=True)

    app.config.from_object(Config)

    # Override config with test config if passed
    if test_config:
        app.config.update(test_config)

    db.init_app(app)
    jwt.init_app(app)

    from auth import auth_bp
    from lists import list_bp
    from tasks import task_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(list_bp)
    app.register_blueprint(task_bp)

    with app.app_context():
        db.create_all()

    @app.errorhandler(ExpiredSignatureError)
    def handle_expired_token(e):
        return jsonify({"error": "Token has expired"}), 401

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
