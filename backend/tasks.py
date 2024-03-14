from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app import db
from auth import get_current_user
from models import List, Task, User
from uri import (
    CREATE_TASK_ENDPOINT,
    DELETE_TASK_ENDPOINT,
    EDIT_TASK_ENDPOINT,
    GET_SUBTASKS_ENDPOINT,
    TASK_MOVE_LIST_ENDPOINT,
    TASKS_ENDPOINT,
)

task_bp = Blueprint("task", __name__, url_prefix=TASKS_ENDPOINT)


@task_bp.route(GET_SUBTASKS_ENDPOINT, methods=["GET"])
@jwt_required()
def get_subtasks(task_id):
    """Get all subtasks for a specific task."""
    user = get_current_user()
    if not user:
        return jsonify({"error": "User not authenticated"}), 401
    try:
        subtasks = Task.query.filter_by(parent_id=task_id, user_id=user.id).all()
        return jsonify([subtask.serialize() for subtask in subtasks]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@task_bp.route(CREATE_TASK_ENDPOINT, methods=["POST"])
@jwt_required()
def create_task(list_id: int):
    """Create a new task, in the specified list and with an optional parent task."""
    user = get_current_user()
    try:
        data = request.json
        parent_id = data.get("parent_id", None)

        # Ensure parent task exists and belongs to the current user (For Subtasks)
        if parent_id:
            parent_task = Task.query.filter_by(id=parent_id, user_id=user.id).first()
            if not parent_task:
                return jsonify({"error": "Parent task not found"}), 404

        new_task = Task(
            title=data["title"], user_id=user.id, list_id=list_id, parent_id=parent_id
        )
        db.session.add(new_task)
        db.session.commit()
        return jsonify({"message": "Task added successfully", "id": new_task.id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@task_bp.route(EDIT_TASK_ENDPOINT, methods=["PUT"])
@jwt_required()
def update_task(task_id: int):
    """Update a task's title or status."""
    user = get_current_user()
    try:
        task = Task.query.filter_by(id=task_id, user_id=user.id).first()
        if not task:
            return jsonify({"error": "Task not found"}), 404
        data = request.json
        task.title = data.get("title", task.title)
        task.status = data.get("status", task.status)
        db.session.commit()
        return jsonify(task.serialize()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@task_bp.route(TASK_MOVE_LIST_ENDPOINT, methods=["PUT"])
@jwt_required()
def move_task(task_id, new_list_id):
    """Move a task from a list to another list"""
    user = get_current_user()
    try:
        task = Task.query.filter_by(id=task_id, user_id=user.id).first()
        if not task:
            return jsonify({"error": "Task not found"}), 404

        new_list = List.query.filter_by(id=new_list_id, user_id=user.id).first()
        if not new_list:
            return jsonify({"error": "New list not found"}), 404

        task.list_id = new_list_id
        db.session.commit()
        return jsonify({"message": f"Task moved to list {new_list.name}"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@task_bp.route(DELETE_TASK_ENDPOINT, methods=["DELETE"])
@jwt_required()
def delete_task(task_id: int):
    """Delete a task and all associated subtasks."""
    user = get_current_user()
    try:
        task_to_delete = Task.query.filter_by(id=task_id, user_id=user.id).first()
        if not task_to_delete:
            return jsonify({"error": "Task not found"}), 404
        db.session.delete(task_to_delete)
        db.session.commit()
        return jsonify({"message": "Task deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
