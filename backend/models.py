from app import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash


class User(UserMixin, db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(120), nullable=False)
    lists = db.relationship("List", backref="user", lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class List(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    tasks = db.relationship(
        "Task", backref="list", lazy=True, cascade="all, delete-orphan"
    )

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "user_id": self.user_id,
            "tasks": [task.serialize() for task in self.tasks],
        }


# Creates a table in the database for tasks, with the following columns:
# parent_id: the id of the parent task (if any)


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    status = db.Column(db.String(50), nullable=False, default="pending")
    list_id = db.Column(db.Integer, db.ForeignKey("list.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey("task.id"), nullable=True)
    children = db.relationship(
        "Task",
        backref=db.backref("parent", remote_side=[id]),
        cascade="all, delete-orphan",
    )

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "status": self.status,
            "parent_id": self.parent_id,
            "children": [
                child.serialize() for child in self.children
            ],  # Recursive serialization for child tasks
        }
