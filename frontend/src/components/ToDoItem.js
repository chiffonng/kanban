import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TaskService } from "../services/TaskService";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import TaskActions from "./TaskActions";

const ToDoItem = ({
	listId,
	taskId,
	item,
	onRemoveTask,
	level,
	onCreateTask,
}) => {
	const [title, setTitle] = useState(item.title);
	const [status, setStatus] = useState(item.status);
	const [isExpanded, setIsExpanded] = useState(true);
	const [subTasks, setSubTasks] = useState([]);

	const navigate = useNavigate();

	useEffect(() => {
		loadSubTasks();
	}, [taskId, onRemoveTask]);

	const loadSubTasks = async () => {
		try {
			const data = await TaskService.fetchSubTasks(taskId, navigate);
			setSubTasks(data);
		} catch (error) {
			console.error("Error loading subtasks:", error);
		}
	};

	const handleEditTitle = async (taskId, newTitle, status) => {
		try {
			await TaskService.editTask(taskId, newTitle, status, navigate);
			setTitle(newTitle);
		} catch (error) {
			console.error("Error updating task title:", error);
		}
	};

	const markComplete = async () => {
		try {
			await TaskService.updateTaskStatus(taskId, "completed", navigate);
			setStatus("completed");
		} catch (error) {
			console.error("Error updating task status:", error);
		}
	};

	const undoComplete = async () => {
		try {
			await TaskService.updateTaskStatus(taskId, "pending", navigate);
			setStatus("pending");
		} catch (error) {
			console.error("Error updating task status:", error);
		}
	};

	const handleCreateSubTask = (listId, title, parentTaskId) => {
		onCreateTask(listId, title, parentTaskId, (newSubTask) => {
			setSubTasks((prevSubTasks) => [...prevSubTasks, newSubTask]);
		});
	};

	const handleRemoveSubTask = (listId, taskId) => {
		onRemoveTask(listId, taskId, (oldSubTask) => {
			setSubTasks((prevSubTasks) =>
				prevSubTasks.filter((subTask) => subTask.id !== oldSubTask.id)
			);
		});
	};

	return (
		<div className="my-1">
			<div className="flex items-start space-x-2 group">
				{/* if the task has children, show a chevron icon to expand/collapse the children. */}
				{item.children && item.children.length > 0 && (
					<div className="mt-1">
						<button
							onClick={() => setIsExpanded(!isExpanded)}
							className="focus:outline-none"
						>
							{isExpanded ? (
								<ChevronDownIcon className="h-5 w-5 text-gray-500" />
							) : (
								<ChevronRightIcon className="h-5 w-5 text-gray-500" />
							)}
						</button>
					</div>
				)}

				{/* Task Checkbox */}
				<div>
					<input
						type="checkbox"
						checked={status === "completed"}
						onChange={status === "completed" ? undoComplete : markComplete}
						className="h-4 w-4 rounded border-gray-300"
					/>
				</div>

				{/* Task Title */}
				<div
					className={`text-base-content flex-grow ${
						status === "completed"
							? "line-through text-gray-800"
							: "text-gray-800"
					}`}
				>
					{title}
				</div>

				{/* Edit, Remove, Add subtasks icons */}
				<TaskActions
					taskId={taskId}
					title={title}
					status={status}
					onEdit={handleEditTitle}
					onRemove={() => handleRemoveSubTask(listId, taskId)}
					onCreateSubTask={() =>
						handleCreateSubTask(listId, prompt("Enter subtask title"), taskId)
					}
				/>
			</div>

			{isExpanded && subTasks && (
				<ul className="pl-2">
					{subTasks.map((subTask) => (
						<li key={subTask.id} className="pl-5 pb-1">
							<ToDoItem
								taskId={subTask.id}
								item={subTask}
								level={level + 1}
								listId={listId}
								onCreateTask={onCreateTask}
								onRemoveTask={onRemoveTask}
							/>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

ToDoItem.propTypes = {
	listId: PropTypes.number.isRequired,
	taskId: PropTypes.number.isRequired,
	item: PropTypes.object.isRequired,
	onRemoveTask: PropTypes.func.isRequired,
	level: PropTypes.number.isRequired,
	onCreateTask: PropTypes.func.isRequired,
};
export default ToDoItem;
