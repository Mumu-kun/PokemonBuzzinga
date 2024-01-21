import React from "react";
import axios from "../../utils/AxiosSetup";
import useAuthContext from "../../hooks/useAuthContext";

function PokemonEntry({ pokemon_id, name, stats, buy }) {
	const { user } = useAuthContext();

	const handleBuy = async () => {
		try {
			const formData = {
				pokemonId: pokemon_id,
				nickname: name,
			};
			const req = await axios.post(`/owned-pokemons/${user.id}`, formData);
			const data = req.data;

			// console.log(data);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="flex gap-5 p-4 items-center rounded-lg bg-slate-800">
			<span className="w-8 pl-2 text-center">{pokemon_id}</span>
			<span className="w-32 text-center">{name}</span>
			<div className="flex flex-col gap-2 pr-2 ">
				{Object.keys(stats).map((key) => (
					<span key={key}>
						{key} : {stats[key]}
					</span>
				))}
			</div>
			{buy && (
				<button className="bg-slate-500 h-auto p-2 w-32 rounded-lg" onClick={handleBuy}>
					Buy
				</button>
			)}
		</div>
	);
}

export default PokemonEntry;
