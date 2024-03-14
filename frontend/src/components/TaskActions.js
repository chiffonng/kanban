import React from "react";
import PropTypes from "prop-types";
import {
	PencilSquareIcon,
	TrashIcon,
	PlusIcon,
} from "@heroicons/react/24/outline";

const TaskActions = ({
	taskId,
	title,
	status,
	onEdit,
	onRemove,
	onCreateSubTask,
}) => {
	const handleEdit = async () => {
		const newTitle = prompt("Edit task title", title);
		if (newTitle) {
			onEdit(taskId, newTitle, status);
		}
	};

	return (
		<div className="flex space-x-1 mt-1">
			<button
				onClick={handleEdit}
				className="btn btn-ghost btn-xs p-1 focus:ring focus:ring-opacity-50"
				title="Edit task name"
			>
				<PencilSquareIcon className="h-5 w-5 text-base-content" />
			</button>
			<button
				onClick={() => onRemove(taskId)}
				className="btn btn-ghost btn-xs p-1 focus:ring focus:ring-opacity-50"
				title="Delete task"
			>
				<TrashIcon className="h-5 w-5 text-base-content" />
			</button>
			<button
				onClick={() => onCreateSubTask()}
				className="btn btn-ghost btn-xs p-1 focus:ring focus:ring-opacity-50"
				title="Add subtask"
			>
				<PlusIcon className="h-5 w-5 text-base-content" />
			</button>
		</div>
	);
};

TaskActions.propTypes = {
	taskId: PropTypes.number.isRequired,
	title: PropTypes.string.isRequired,
	status: PropTypes.string.isRequired,
	onEdit: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	onCreateSubTask: PropTypes.func.isRequired,
};

export default TaskActions;
