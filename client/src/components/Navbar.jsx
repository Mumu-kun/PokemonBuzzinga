import React from "react";
import useAuthContext from "../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";

function LoggedOutElements() {
	return (
		<>
			<>
				<Link to="/login" className="btn">
					Login
				</Link>
				<Link to="/signup" className="btn">
					Sign Up
				</Link>
			</>
		</>
	);
}

function LoggedInElements() {
	const { user, userDispatch } = useAuthContext();
	const navigate = useNavigate();

	return (
		<>
			<Link to="/my-pokemons/" className="btn">
				My Pokemons
			</Link>
			<Link to="/my-teams/" className="btn">
				My Teams
			</Link>
			<Link to={`/profile/${user.id}`} className="btn">
				Profile
			</Link>
			<button
				className="btn"
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
	const { user } = useAuthContext();

	return (
		<div className="sticky top-0 flex items-center justify-end w-full px-8 bg-opacity-100 bg-slate-900 z-40 text-center gap-5 py-5 shadow-md shadow-slate-900">
			<Link to="/" className="mr-auto font-bold">
				Pokemon Buzzinga
			</Link>
			<Link to="/pokemons" className="btn">
				All Pokemons
			</Link>

			{user ? <LoggedInElements /> : <LoggedOutElements />}
		</div>
	);
}

export default Navbar;
