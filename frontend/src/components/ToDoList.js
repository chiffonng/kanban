import React from "react";
import ToDoItem from "./ToDoItem";
import { Draggable } from "react-beautiful-dnd";
import ListActions from "./ListActions";
import PropTypes from "prop-types";

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

				<ListActions
					listId={listId}
					removeList={removeList}
					editListTitle={editListTitle}
					handleAddTask={handleAddTask}
				/>
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
		</div>
	);
};

ToDoList.propTypes = {
	listId: PropTypes.string.isRequired,
	tasks: PropTypes.array.isRequired,
	createTask: PropTypes.func.isRequired,
	removeList: PropTypes.func.isRequired,
	removeTask: PropTypes.func.isRequired,
	listName: PropTypes.string.isRequired,
	updateListTitle: PropTypes.func.isRequired,
};

export default ToDoList;
