import React from "react";
import useAuthContext from "../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";

function LoggedOutElements() {
	return (
		<>
			<Link to="/login" className="btn">
				Login
			</Link>
			<Link to="/signup" className="btn">
				Sign Up
			</Link>
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
	const navigate = useNavigate();

	return (
		<div className="sticky top-0 z-40 flex w-full items-center justify-end gap-5 bg-slate-900 bg-opacity-100 px-8 py-5 text-center shadow-md shadow-slate-900">
			<Link to="/" className="mr-auto font-bold">
				Pokemon Buzzinga
			</Link>

			{user ? <LoggedInElements /> : <LoggedOutElements />}
		</div>
	);
}

export default Navbar;
