import React from "react";
import ToDoItem from "./ToDoItem";
import { Draggable } from "react-beautiful-dnd";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

const ToDoList = ({
	listId,
	tasks,
	createTask,
	removeList,
	removeTask,
	listName,
	updateListTitle,
}) => {
	const editListTitle = () => {
		const newListName = prompt("Edit list title", listName);
		if (newListName && updateListTitle) {
			updateListTitle(listId, newListName);
		}
	};

	const handleCreateTask = (listId, title, parentId, callback) =>
		createTask(listId, title, parentId, callback);

	const handleRemoveTask = (listId, taskId, callback) =>
		removeTask(listId, taskId, callback);

	const handleAddTask = () => createTask(listId, prompt("Enter task title"));

	return (
		<div className="card bg-base-200 shadow-md rounded-lg p-6 mt-10 min-w-[200px] w-full">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-semibold">{listName}</h2>

				<div>
					<button onClick={editListTitle} className="btn btn-ghost btn-xs">
						<PencilSquareIcon className="h-5 w-5 text-base-content" />
					</button>
					<button
						onClick={() => removeList(listId)}
						className="btn btn-ghost btn-xs"
					>
						<TrashIcon className="h-5 w-5 text-base-content" />
					</button>
				</div>
			</div>

			<div className="space-y-2">
				{tasks.map((task, index) => (
					<Draggable key={task.id} draggableId={String(task.id)} index={index}>
						{(provided) => (
							<div
								{...provided.draggableProps}
								{...provided.dragHandleProps}
								ref={provided.innerRef}
							>
								<ToDoItem
									taskId={task.id}
									item={task}
									level={1}
									listId={listId}
									onCreateTask={handleCreateTask}
									onRemoveTask={handleRemoveTask}
								/>
							</div>
						)}
					</Draggable>
				))}
			</div>

			<div className="mt-4">
				<button
					onClick={handleAddTask}
					className="btn btn-primary text-sm flex py-1"
				>
					<p>Add Task</p>
				</button>
			</div>
		</div>
	);
};

export default ToDoList;
