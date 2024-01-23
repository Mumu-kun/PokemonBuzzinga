import React, { useState } from "react";
import PokemonEntry from "./PokemonEntry";
import axiosApi from "../../utils/AxiosSetup";

function MyPokemonEntry({ id, nickname, team_id, pokemonData, teams, getMyPokemons }) {
	const [selectedTeam, setSelectedTeam] = useState(team_id);

	const handleChangeTeam = async (e) => {
		const formData = {
			ownedPokemonId: id,
		};

		setSelectedTeam("loading");

		try {
			const selectedOption = e.target.value;

			const req =
				selectedOption === "none"
					? await axiosApi.delete(`/delete-pokemon-from-team/`, { data: formData })
					: await axiosApi.post(`/add-pokemon-to-team/${selectedOption}`, formData);

			const data = req.data;

			console.log(data);
			setSelectedTeam(selectedOption === "none" ? "none" : data.team_id);

			getMyPokemons();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="flex flex-col bg-slate-800 rounded-lg items-center p-2" key={id}>
			<div className="text-center p-2 border-b-2 border-slate-500 w-3/4" style={{ wordSpacing: `0.5rem` }}>
				Nickname : {nickname}
			</div>
			<PokemonEntry {...pokemonData} />
			<div className="w-full flex justify-center items-center">
				<span className="font-semibold pr-2">Team :</span>
				<select
					name="teams"
					value={selectedTeam ?? "none"}
					onChange={handleChangeTeam}
					className="inline-block text-black max-w-48 w-full my-2 p-1"
				>
					<option value={"none"}>None</option>
					<option value={"loading"} hidden>
						-----
					</option>

					{!!teams && teams.map((teamInfo) => <option value={teamInfo.id}>{teamInfo.team_name}</option>)}
				</select>
			</div>
		</div>
	);
}

export default MyPokemonEntry;
