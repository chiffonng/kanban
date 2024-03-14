from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity

from app import db
from models import User
from uri import API_ENDPOINT, AUTH_ENDPOINT, LOGIN_ENDPOINT, REGISTER_ENDPOINT


auth_bp = Blueprint("auth", __name__, url_prefix=API_ENDPOINT)


@auth_bp.route(REGISTER_ENDPOINT, methods=["POST"])
def signup():
    data = request.get_json()

    email = data["email"]
    password = data["password"]

    user = User.query.filter_by(email=email).first()

    if user:
        return jsonify({"message": "Email address already exists!"}), 400

    new_user = User(email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Successfully signed up! Please login."}), 201


@auth_bp.route(LOGIN_ENDPOINT, methods=["POST"])
def login():
    """Log in a user."""
    data = request.get_json()

    email = data["email"]
    password = data["password"]

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return (
            jsonify({"message": "Please check your login details and try again."}),
            401,
        )

    access_token = create_access_token(identity=email)
    return (
        jsonify({"message": "Logged in successfully!", "access_token": access_token}),
        200,
    )


def get_current_user():
    email = get_jwt_identity()
    return User.query.filter_by(email=email).first()
