import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000/api";

const handleResponse = (response) => {
	if (response.status === 200) {
		return response.data;
	} else {
		throw new Error(response.data.error || "Unknown Error");
	}
};

const handleError = (error, navigate) => {
	console.error("Error:", error.message);
	if (
		error.response &&
		error.response.status === 401 &&
		error.response.data.error === "Token has expired"
	) {
		window.alert("Your token has expired. Please log in again.");
		navigate("/login");
	} else {
		window.alert("There was an issue with the request. Please try again.");
	}
	throw error;
};

const fetchSubTasks = async (taskId, navigate) => {
	try {
		const response = await axios.get(`${API_BASE_URL}/task/${taskId}/subtasks`);
		return handleResponse(response);
	} catch (error) {
		handleError(error, navigate);
	}
};

const updateTask = async (taskId, updatedFields, navigate) => {
	try {
		const response = await axios.put(
			`${API_BASE_URL}/task/${taskId}`,
			updatedFields
		);
		return handleResponse(response);
	} catch (error) {
		handleError(error, navigate);
	}
};

const updateTaskStatus = async (taskId, newStatus, navigate) => {
	return updateTask(taskId, { status: newStatus }, navigate);
};

const editTask = async (taskId, newTitle, status, navigate) => {
	return updateTask(taskId, { title: newTitle, status }, navigate);
};

export const TaskService = {
	fetchSubTasks,
	updateTaskStatus,
	editTask,
};
