import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000/api";

// Set up the headers with the token
const getConfig = (token) => ({
	headers: {
		Authorization: `Bearer ${token}`,
	},
});

// Handle API responses
const handleResponse = (response) => {
	if (response.status === 200) {
		return response.data;
	} else {
		throw new Error(response.data.error || "Unknown Error");
	}
};

// Handle API errors
const handleError = (error, navigate) => {
	console.error("API Error:", error.message);
	if (error.response && error.response.status === 401) {
		if (error.response.data.error === "Token has expired") {
			window.alert("Your token has expired. Please log in again.");
			navigate("/login");
		}
	} else {
		window.alert("There was an issue with the request. Please try again.");
	}
	throw error;
};

// Fetch all lists
const fetchLists = async (token, navigate) => {
	try {
		const response = await axios.get(`${API_BASE_URL}/list`, getConfig(token));
		return handleResponse(response);
	} catch (error) {
		handleError(error, navigate);
	}
};

// Add a new list
const addNewList = async (title, token, navigate) => {
	try {
		const response = await axios.post(
			`${API_BASE_URL}/list`,
			{ name: title },
			getConfig(token)
		);
		return handleResponse(response);
	} catch (error) {
		handleError(error, navigate);
	}
};

// Remove a list
const removeList = async (listId, token, navigate) => {
	try {
		const response = await axios.delete(
			`${API_BASE_URL}/list/${listId}`,
			getConfig(token)
		);
		return handleResponse(response);
	} catch (error) {
		handleError(error, navigate);
	}
};

// Update a list title
const updateListTitle = async (listId, newTitle, token, navigate) => {
	try {
		const response = await axios.put(
			`${API_BASE_URL}/list/${listId}`,
			{ name: newTitle },
			getConfig(token)
		);
		return handleResponse(response);
	} catch (error) {
		handleError(error, navigate);
	}
};

export const ListService = {
	fetchLists,
	addNewList,
	removeList,
	updateListTitle,
};

export default ListService;
