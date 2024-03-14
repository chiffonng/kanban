import {
	TrashIcon,
	PencilSquareIcon,
	PlusIcon,
} from "@heroicons/react/24/outline";
import PropTypes from "prop-types";

const ListActions = ({ listId, removeList, editListTitle, handleAddTask }) => {
	return (
		<div className="flex items-center">
			<button
				onClick={editListTitle}
				className="btn btn-ghost btn-xs"
				title="Edit list name"
			>
				<PencilSquareIcon className="h-5 w-5 text-base-content" />
			</button>
			<button
				onClick={() => removeList(listId)}
				className="btn btn-ghost btn-xs"
				title="Remove list"
			>
				<TrashIcon className="h-5 w-5 text-base-content" />
			</button>
			<button
				onClick={handleAddTask}
				className="btn btn-ghost btn-xs"
				title="Add task"
			>
				<PlusIcon className="h-5 w-5 text-base-content" />
			</button>
		</div>
	);
};

ListActions.propTypes = {
	listId: PropTypes.number.isRequired,
	removeList: PropTypes.func.isRequired,
	editListTitle: PropTypes.func.isRequired,
	handleAddTask: PropTypes.func.isRequired,
};
