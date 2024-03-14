import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserPage from "./pages/UserPage";
import UserContext from "./UserContext";
import { AUTH_ROUTES } from "./utils/constants";

function App() {
	const [user, setUser] = useState(null); // null means no user is logged in

	return (
		<UserContext.Provider value={{ user, setUser }}>
			<Router>
				<div className="App">
					<Routes>
						<Route path={AUTH_ROUTES.LOGIN} element={<LoginPage />} />
						<Route path={AUTH_ROUTES.USER} element={<UserPage />} />
						<Route path={AUTH_ROUTES.REGISTER} element={<RegisterPage />} />
					</Routes>
				</div>
			</Router>
		</UserContext.Provider>
	);
}

export default App;
