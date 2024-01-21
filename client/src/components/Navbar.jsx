import React from "react";
import useAuthContext from "../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";

function LoginOrLogout() {
	const { user, userDispatch } = useAuthContext();
	const navigate = useNavigate();

	if (!user) {
		return (
			<>
				<Link to="/login" className="bg-slate-500 p-2 w-32 rounded-lg">
					Login
				</Link>
				<Link to="/signup" className="bg-slate-500 p-2 w-32 rounded-lg">
					Sign Up
				</Link>
			</>
		);
	}

	return (
		<>
			<button
				className="bg-slate-500 p-2 w-32 rounded-lg"
				onClick={() => {
					navigate("/");
					userDispatch({
						type: "LOGOUT",
					});
				}}
			>
				{user.name} : Logout
			</button>
		</>
	);
}

function Navbar() {
	return (
		<div className="flex justify-end w-full px-8 text-center gap-5 my-5">
			<Link to="/my-pokemons/" className="bg-slate-500 p-2 w-32 rounded-lg">
				My Pokemons
			</Link>
			<Link to="/pokemons" className="bg-slate-500 p-2 w-32 rounded-lg">
				All Pokemons
			</Link>
			{LoginOrLogout()}
		</div>
	);
}

export default Navbar;
