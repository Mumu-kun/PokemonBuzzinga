import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";

function LoginOrLogout() {
	const { user, userDispatch } = useAuthContext();
	const navigate = useNavigate();

	if (!user) {
		return (
			<>
				<span className="bg-slate-500 p-2 w-32 rounded-lg">
					<Link to="/login">Login</Link>
				</span>
				<span className="bg-slate-500 p-2 w-32 rounded-lg">
					<Link to="/signup">Sign Up</Link>
				</span>
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

function App() {
	return (
		<div className=" min-h-dvh flex flex-col items-center bg-slate-900 text-slate-200">
			<div className="flex justify-end w-full px-8 text-center gap-5 my-5">
				<span className="bg-slate-500 p-2 w-32 rounded-lg">
					<Link to={`/my-pokemons/`}>My Pokemons</Link>
				</span>
				<span className="bg-slate-500 p-2 w-32 rounded-lg">
					<Link to="/pokemons">All Pokemons</Link>
				</span>
				{LoginOrLogout()}
			</div>

			<Outlet />
		</div>
	);
}

export default App;
