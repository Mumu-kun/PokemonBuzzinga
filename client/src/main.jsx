import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./routes/root";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import Login from "./routes/login/Login";
import ErrorPage from "./utils/ErrorPage";

import { AuthContextProvider } from "./utils/AuthContext";
import AllPokemons from "./routes/pokemons/AllPokemons";
import MyPokemons from "./routes/pokemons/MyPokemons";
import Home from "./routes/home/Home";
import ProtectedRoute from "./routes/ProtectedRoute";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "/",
				element: <Home />,
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
	{
		path: "login/",
		element: <Login />,
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<AuthContextProvider>
			<RouterProvider router={router} />
		</AuthContextProvider>
	</React.StrictMode>
);
