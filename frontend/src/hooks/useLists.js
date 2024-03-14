import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ListService from "../services/ListService";
import UserContext from "../UserContext";

export const useLists = () => {
	const [lists, setLists] = useState([]);
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();

	// Effect for authentication check and token setup
	useEffect(() => {
		const token = localStorage.getItem("jwtToken");
		if (token) {
			const userEmail = localStorage.getItem("userEmail");
			setUser({ email: userEmail, token: token });
		} else {
			// If there is no token, redirect to login
			navigate("/login");
		}
	}, [setUser, navigate]);

	// Effect to fetch lists
	useEffect(() => {
		if (user && user.token) {
			ListService.fetchLists(user.token, navigate)
				.then(setLists)
				.catch((error) => {
					console.error("Error fetching lists:", error);
				});
		}
	}, [user, navigate]);

	// Function to add a new list
	const addNewList = async (title) => {
		if (!title) return;

		try {
			const newList = await ListService.addNewList(title, user.token, navigate);
			setLists((prevLists) => [...prevLists, newList]);
		} catch (error) {
			console.error("Error creating list:", error);
		}
	};

	// Function to remove a list
	const removeList = async (listId) => {
		const isConfirmed = window.confirm(
			"Are you sure you want to delete this list?"
		);
		if (!isConfirmed) return;

		try {
			await ListService.removeList(listId, user.token, navigate);
			setLists((prevLists) => prevLists.filter((list) => list.id !== listId));
		} catch (error) {
			console.error("Error deleting list:", error);
		}
	};

	// Function to update a list title
	const updateListTitle = async (listId, newTitle) => {
		try {
			const updatedList = await ListService.updateListTitle(
				listId,
				newTitle,
				user.token,
				navigate
			);

			setLists((prevLists) =>
				prevLists.map((list) => {
					if (list.id === listId) {
						return { ...list, name: newTitle };
					}
					return list;
				})
			);
		} catch (error) {
			console.error("Error updating list title:", error);
		}
	};

	return {
		lists,
		setLists,
		addNewList,
		removeList,
		updateListTitle,
	};
};

export default useLists;
