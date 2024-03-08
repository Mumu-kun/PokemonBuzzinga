import React, { useState } from "react";
import useAuthContext from "../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

function LoggedOutElements() {
	return (
		<>
			<Link to="/tournaments" className="btn scale-x-100">
				Tournaments
			</Link>
			<Link to="/battles" className="btn scale-x-100">
				Battles
			</Link>
			<Link to="/pokemons" className="btn scale-x-100">
				All Pokemons
			</Link>
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
	const [expanded, setExpanded] = useState(false);

	return (
		<>
			<div
				className={`flex flex-row-reverse items-center gap-5 transition-all ${expanded ? "" : "origin-right scale-x-0"} `}
			>
				<Link to="/pokemons" className="btn scale-x-100">
					All Pokemons
				</Link>
				<Link to="/battles" className="btn scale-x-100">
					Battles
				</Link>
				<Link to="/tournaments" className="btn scale-x-100">
					Tournaments
				</Link>
				<Link to="/my-pokemons/" className="btn scale-x-100">
					My Pokemons
				</Link>
				<Link to="/my-teams/" className="btn scale-x-100">
					My Teams
				</Link>
				<Link className="btn scale-x-100" to="/queue">
					Queue
				</Link>
			</div>
			{expanded ? (
				<FaAngleRight onClick={() => setExpanded(false)} className="cursor-pointer text-2xl text-white" />
			) : (
				<FaAngleLeft onClick={() => setExpanded(true)} className="cursor-pointer text-2xl text-white" />
			)}
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
		<div className="sticky top-0 z-40 flex w-full items-center justify-end gap-5 bg-slate-800 bg-opacity-100 px-8 py-5 text-center shadow-md shadow-slate-900">
			<Link to="/" className="mr-auto font-bold text-white">
				Pokemon Buzzinga
			</Link>

			{user ? <LoggedInElements /> : <LoggedOutElements />}
		</div>
	);
}

export default Navbar;
