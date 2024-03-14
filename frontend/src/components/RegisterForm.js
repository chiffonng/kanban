import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { AUTH_ROUTES } from "../utils/constants";

const RegisterForm = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const navigate = useNavigate();

	// This code gets the user's email and password, and sends it to the backend to create a new user
	const handleSubmit = async (event) => {
		event.preventDefault();

		// Check if passwords match
		if (password !== confirmPassword) {
			console.error("Passwords do not match");
			window.alert("Passwords do not match!");
			return;
		}

		try {
			const response = await axios.post("http://127.0.0.1:5000/api/register", {
				email: email,
				password: password,
			});

			console.log("Signup successful:", response.data.message);
			navigate(AUTH_ROUTES.LOGIN);
		} catch (error) {
			console.error("Signup error:", error.response.data.message);

			// Check if the error is due to the email already existing
			if (
				error.response.data.message.includes("Email address already exists!")
			) {
				window.alert("Email already exists!");
			} else {
				window.alert("There was an issue signing up. Please try again.");
			}
		}
	};

	const handleLoginClick = () => {
		navigate(AUTH_ROUTES.LOGIN);
	};

	return (
		<div className="flex h-screen justify-center items-center bg-gray-100">
			<div className="card w-full max-w-md bg-base-100 shadow-xl p-6">
				<h2 className="text-center text-2xl font-bold">Register</h2>

				<form className="form-control" onSubmit={handleSubmit}>
					{/* Email Field */}
					<label className="label" htmlFor="email">
						Email
					</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="input input-bordered"
					/>

					{/* Password Field */}
					<div className="form-control">
						<label className="label" htmlFor="password">
							Password
						</label>
						<div className="relative">
							<input
								id="password"
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="input input-bordered w-full pr-10"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute inset-y-0 right-0 flex items-center pr-3"
							>
								{showPassword ? (
									<EyeSlashIcon className="h-5 w-5" />
								) : (
									<EyeIcon className="h-5 w-5" />
								)}
							</button>
						</div>
					</div>

					{/* Confirm Password Field */}
					<div className="form-control">
						<label className="label" htmlFor="confirmPassword">
							Confirm Password
						</label>
						<div className="relative">
							<input
								id="confirmPassword"
								type={showConfirmPassword ? "text" : "password"}
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								className="input input-bordered w-full pr-10"
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className="absolute inset-y-0 right-0 flex items-center pr-3"
							>
								{showConfirmPassword ? (
									<EyeSlashIcon className="h-5 w-5" />
								) : (
									<EyeIcon className="h-5 w-5" />
								)}
							</button>
						</div>
					</div>

					{/* Submit Button */}
					<button type="submit" className="btn btn-primary mt-4">
						Register
					</button>
				</form>

				<div className="text-center mt-4">
					<p>
						Already have an account?{" "}
						<button onClick={handleLoginClick} className="link link-primary">
							Login
						</button>
					</p>
				</div>
			</div>
		</div>
	);
};

export default RegisterForm;
