from flask import Blueprint, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token
from database import db
from models import User

auth = Blueprint("auth", __name__, url_prefix="/api/v1")

# Setting up Flask-JWT-Extended
jwt = JWTManager()


@auth.route("/signup", methods=["POST"])
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


# This code is responsible for logging in a user.
@auth.route("/login", methods=["POST"])
def login():
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
