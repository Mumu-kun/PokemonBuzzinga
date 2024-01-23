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
		<div className="flex justify-end w-full px-8 text-center gap-5 my-5">
			<Link to="/pokemons" className="btn">
				All Pokemons
			</Link>

			{user ? <LoggedInElements /> : <LoggedOutElements />}
		</div>
	);
}

export default Navbar;
