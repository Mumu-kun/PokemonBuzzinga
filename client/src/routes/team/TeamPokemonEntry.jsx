import React from "react";
import PokemonEntry from "../pokemons/PokemonEntry";
import axiosApi from "../../utils/AxiosSetup";

function TeamPokemonEntry({ id, nickname, pokemonData, getTeamDetails }) {
	const handleRemovePokemon = async () => {
		const formData = {
			ownedPokemonId: id,
		};

		try {
			const req = await axiosApi.delete(`/delete-pokemon-from-team/`, { data: formData });

			const data = req.data;

			// console.log(data);

			getTeamDetails();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="flex flex-col items-center bg-slate-800 rounded-lg p-2">
			<div className="text-center p-2 border-b-2 border-slate-500 w-3/4" style={{ wordSpacing: `0.5rem` }}>
				Nickname : {nickname}
			</div>
			<PokemonEntry {...pokemonData} />
			<button className="btn bg-red-900 my-2" onClick={handleRemovePokemon}>
				Delete
			</button>
		</div>
	);
}

export default TeamPokemonEntry;
