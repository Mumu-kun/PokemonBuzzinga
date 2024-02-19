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

			getTeamDetails();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="flex flex-col items-center bg-slate-100 text-black rounded-lg p-2">
			<div className="text-center p-2 w-3/4" style={{ wordSpacing: `0.5rem` }}>
				Nickname : {nickname}
			</div>
			<PokemonEntry {...pokemonData} className="border-t-2 border-slate-500 shadow-sm shadow-slate-300" />
			<button className="btn--red my-2 mt-4" onClick={handleRemovePokemon}>
				Delete
			</button>
		</div>
	);
}

export default TeamPokemonEntry;
