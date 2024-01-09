import React from "react";
import ReactDOM from "react-dom/client";
import App from "./routes/App";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import Login from "./routes/login/Login";
import ErrorPage from "./utils/ErrorPage";

import { AuthContextProvider } from "./utils/AuthContext";
import AllPokemons from "./routes/pokemons/AllPokemons";
import MyPokemons from "./routes/pokemons/MyPokemons";
import Home from "./routes/home/Home";
import ProtectedRoute from "./routes/ProtectedRoute";
import SignUp from "./routes/signup/Signup";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "login/",
				element: <Login />,
			},
			{
				path: "signup/",
				element: <SignUp />,
			},
			{
				path: "/",
				element: <ProtectedRoute />,
				children: [
					{
						path: "pokemons/",
						element: <AllPokemons />,
					},
					{
						path: "my-pokemons/",
						element: <MyPokemons />,
					},
				],
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<AuthContextProvider>
			<RouterProvider router={router} />
		</AuthContextProvider>
	</React.StrictMode>
);
