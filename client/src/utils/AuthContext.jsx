import { createContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const authReducer = (user, action) => {
	switch (action.type) {
		case "LOGIN":
			window.localStorage.setItem("user", JSON.stringify(action.payload));
			return action.payload;
		case "LOGOUT":
			window.localStorage.removeItem("user");
			return null;
		default:
			return user;
	}
};

export const AuthContextProvider = ({ children }) => {
	const [user, userDispatch] = useReducer(
		authReducer,
		window.localStorage.getItem("user") ? JSON.parse(window.localStorage.getItem("user")) : null
	);

	console.log(`TrainerContext State : ${user?.name}`);

	return <AuthContext.Provider value={{ user, userDispatch }}>{children}</AuthContext.Provider>;
};
