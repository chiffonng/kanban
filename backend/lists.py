from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app import db
from auth import get_current_user
from models import List, Task, User
from uri import (
    LISTS_ENDPOINT,
    GET_ALL_LISTS_ENDPOINT,
    CREATE_LIST_ENDPOINT,
    DELETE_LIST_ENDPOINT,
    EDIT_LIST_ENDPOINT,
    GET_TASKS_ENDPOINT,
)

list_bp = Blueprint("list", __name__, url_prefix=LISTS_ENDPOINT)


@list_bp.route(GET_ALL_LISTS_ENDPOINT, methods=["GET"])
@jwt_required()
def get_lists():
    """Get all lists for the current user."""
    user = get_current_user()
    if not user:
        return jsonify({"error": "User not authenticated"}), 401
    try:
        user_lists = List.query.filter_by(user_id=user.id).all()
        return jsonify([list_item.serialize() for list_item in user_lists]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@list_bp.route(CREATE_LIST_ENDPOINT, methods=["POST"])
@jwt_required()
def create_list():
    """create a new list."""
    user = get_current_user()
    if not user:
        return jsonify({"error": "User not authenticated"}), 401
    try:
        data = request.json
        new_list = List(name=data["name"], user_id=user.id)
        db.session.add(new_list)
        db.session.commit()
        return jsonify({"message": "List created successfully", "id": new_list.id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@list_bp.route(DELETE_LIST_ENDPOINT, methods=["DELETE"])
@jwt_required()
def delete_list(list_id):
    """Delete a list and all associated tasks."""
    user = get_current_user()
    try:
        list_to_delete = List.query.filter_by(id=list_id, user_id=user.id).first()
        if not list_to_delete:
            return jsonify({"error": "List not found"}), 404

        tasks_to_delete = Task.query.filter_by(list_id=list_id, user_id=user.id).all()
        for task in tasks_to_delete:
            db.session.delete(task)

        db.session.delete(list_to_delete)
        db.session.commit()
        return (
            jsonify({"message": "List and associated tasks deleted successfully"}),
            200,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@list_bp.route(EDIT_LIST_ENDPOINT, methods=["PUT"])
@jwt_required()
def update_list_title(list_id):
    """Update a list's title."""
    user = get_current_user()
    try:
        # Retrieve the list that matches the list_id and current user's id
        list_to_update = List.query.filter_by(id=list_id, user_id=user.id).first()

        # If the list is not found, return an error
        if not list_to_update:
            return jsonify({"error": "List not found"}), 404

        # Get the updated title from the request data
        data = request.json
        list_to_update.name = data.get("name", list_to_update.name)

        # Commit the changes to the database
        db.session.commit()

        # Return a success response
        return jsonify({"message": "List title updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@list_bp.route(GET_TASKS_ENDPOINT, methods=["GET"])
@jwt_required()
def get_tasks(list_id):
    """get all tasks for a specific list."""
    user = get_current_user()
    if not user:
        return jsonify({"error": "User not authenticated"}), 401
    try:
        tasks_in_list = Task.query.filter_by(
            list_id=list_id, user_id=user.id, parent_id=None
        ).all()
        return jsonify([task.serialize() for task in tasks_in_list]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
