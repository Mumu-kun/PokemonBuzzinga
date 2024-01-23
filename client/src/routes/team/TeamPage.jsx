import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import TeamPokemonEntry from "./TeamPokemonEntry";
import axiosApi from "../../utils/AxiosSetup";

function TeamPage() {
	const { team_id } = useParams();

	const [teamDetails, setTeamDetails] = useState();

	const pokemons = useMemo(() => {
		return teamDetails?.pokemons ?? null;
	}, [teamDetails]);

	const getTeamDetails = async () => {
		try {
			const req = await axiosApi.get(`/teams/${team_id}/details`);
			const data = req.data;

			setTeamDetails(data);

			// console.log(data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getTeamDetails();
	}, []);

	if (!teamDetails) {
		return null;
	}

	return (
		<>
			<h1 className="text-h1">
				{teamDetails.id} : {teamDetails.team_name}
			</h1>
			<h3 className="text-h3">Trainer : {teamDetails.name}</h3>
			<div className="flex flex-wrap justify-center gap-4 my-10">
				{!!pokemons &&
					pokemons.map((myPokemon) => {
						const { id, nickname, pokemon_id, name, hp, attack, defense, speed, sp_attack, sp_defense, total } =
							myPokemon;
						const stats = { hp, attack, defense, speed, sp_attack, sp_defense, total };

						return (
							<TeamPokemonEntry
								key={id}
								id={id}
								nickname={nickname}
								pokemonData={{ pokemon_id, name, stats, buy: false }}
								getTeamDetails={getTeamDetails}
							/>
						);
					})}
			</div>
		</>
	);
}

export default TeamPage;
