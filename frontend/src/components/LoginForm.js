import axios from "axios";
import UserContext from "../UserContext";
import { useNavigate } from "react-router-dom";
import React, { useState, useContext } from "react";
import { AUTH_ROUTES } from "../utils/constants";

const LoginForm = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { setUser } = useContext(UserContext);

	// This code handles the login form submission.
	// It sends the user's email and password to the login endpoint and stores the response access_token in local storage.

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const response = await axios.post("http://127.0.0.1:5000/api/login", {
				email: email,
				password: password,
			});

			if (response.data && response.data.access_token) {
				// if login is successful
				const token = response.data.access_token;
				axios.defaults.headers.common["Authorization"] = "Bearer " + token;

				// set the user with both email and token after successful login
				setUser({ email: email, token: token });

				// Store the token in localStorage for persistence
				localStorage.setItem("jwtToken", token);
				localStorage.setItem("userEmail", email);
			}

			console.log("Logged in successfully:", response.data.message);

			// Navigate to Userpage.js
			navigate(AUTH_ROUTES.USER);
		} catch (error) {
			console.error("Login error:", error.response?.data?.message);
			if (
				error.response?.data?.message.includes(
					"Please check your login details and try again."
				)
			) {
				window.alert("Please check your login details and try again.");
			}
		}
	};

	const handleRegisterClick = () => {
		navigate(AUTH_ROUTES.REGISTER);
	};

	return (
		<div className="flex h-screen justify-center items-center bg-gray-100">
			<div className="card w-full max-w-md bg-base-100 shadow-xl p-6">
				<div className="card bg-base-100">
					<h2 className="text-center text-2xl font-bold">Login</h2>

					<div className="card-body">
						<form onSubmit={handleSubmit}>
							<div className="form-control">
								<label className="label" htmlFor="email">
									Email
								</label>
								<input
									id="email"
									type="email"
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									required
									className="input input-bordered"
								/>
							</div>

							<div className="form-control">
								<label className="label" htmlFor="password">
									Password
								</label>
								<input
									id="password"
									type="password"
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									required
									className="input input-bordered"
								/>
							</div>

							<div className="form-control mt-4">
								<button type="submit" className="btn btn-primary">
									Log In
								</button>
							</div>
						</form>

						<div className="text-center">
							<p>
								Don't have an account?{" "}
								<button
									onClick={handleRegisterClick}
									className="link link-primary"
								>
									Register
								</button>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
