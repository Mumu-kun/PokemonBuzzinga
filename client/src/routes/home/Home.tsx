import React from "react";
import { Link } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";

function Home() {
	const user = useAuthContext();
	return (
		<div className="flex flex-1 flex-col items-center justify-center">
			<h1 className="mb-10 text-4xl">Welcome to Pokemon Buzzinga</h1>
			<div className="grid grid-cols-3 items-center justify-center gap-4">
				<Link to="/pokemons" className="btn w-full">
					All Pokemons
				</Link>
				<Link to="/tournaments" className="btn w-full">
					Tournaments
				</Link>
				<Link to="/battles" className="btn w-full">
					Battles
				</Link>
				{user ? (
					<>
						<Link className="btn w-full" to="/queue">
							Queue
						</Link>
					</>
				) : (
					<></>
				)}
			</div>
		</div>
	);
}

export default Home;
