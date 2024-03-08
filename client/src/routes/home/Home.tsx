import React from "react";
import useAuthContext from "../../hooks/useAuthContext";

function Home() {
	const user = useAuthContext();
	return (
		<div className="flex flex-1 flex-col items-center justify-center">
			<h1 className="mb-10 text-6xl font-bold text-white drop-shadow-[0_0px_5px_black]">Welcome to Pokemon Buzzinga</h1>
		</div>
	);
}

export default Home;
