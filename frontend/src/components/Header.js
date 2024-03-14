import { Link, useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import UserContext from "../UserContext";
import axios from "axios";
import { AUTH_ROUTES } from "../utils/constants";

export default function Header() {
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();

	const handleLogout = () => {
		// Remove the token from localStorage
		localStorage.removeItem("jwtToken");
		localStorage.removeItem("userEmail");

		// Clear the JWT from Axios headers
		delete axios.defaults.headers.common["Authorization"];

		// Clear user from React context
		setUser(null);
		navigate("/login");
	};

	return (
		<header className="bg-base-100">
			<nav className="navbar" aria-label="Global">
				<div className="flex-1">
					<h1 className="text-xl font-bold text-primary">To Do</h1>
				</div>

				{/* Conditional rendering for user/email and buttons */}
				<div className="flex gap-4 items-center">
					{user ? (
						<>
							<span className="text-base-content">{user.email}</span>
							<button
								onClick={handleLogout}
								className="btn btn-primary hover:bg-primary-focus" // Add hover effect
							>
								Logout
							</button>
						</>
					) : (
						<>
							<Link to={AUTH_ROUTES.REGISTER} className="btn btn-primary">
								Register
							</Link>
							<Link to={AUTH_ROUTES.LOGIN} className="btn btn-primary">
								Log in
							</Link>
						</>
					)}
				</div>
			</nav>
		</header>
	);
}
