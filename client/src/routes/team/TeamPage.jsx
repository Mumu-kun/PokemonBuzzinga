import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import TeamPokemonEntry from "./TeamPokemonEntry";
import axiosApi from "../../utils/AxiosSetup";
import useAuthContext from "../../hooks/useAuthContext";
import MsgPopup from "../../components/MsgPopup";

function TeamPage() {
	const { user } = useAuthContext();

	const { team_id } = useParams();

	const [teamDetails, setTeamDetails] = useState();
	const [msg, setMsg] = useState(null);

	const pokemons = useMemo(() => {
		return teamDetails?.pokemons ?? null;
	}, [teamDetails]);

	const getTeamDetails = async () => {
		try {
			const req = await axiosApi.get(`/team/${team_id}/details`);
			const data = req.data;

			setTeamDetails(data);

			// console.log(data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleSetBattleTeam = async () => {
		try {
			const req = await axiosApi.put(`/trainer/${user.id}/battle-team`, { team_id });
			const data = req.data;

			// console.log(data);
			getTeamDetails();
		} catch (error) {
			console.error(error);
			if (error.response.status === 409) {
				setMsg(error.response.data.message);
			}
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
			{!!msg && <MsgPopup message={msg} setMessage={setMsg} />}
			<h1 className="text-h1">{teamDetails.team_name}</h1>
			<h3 className="text-h3">Trainer : {teamDetails.name}</h3>
			{teamDetails.trainer_id === user.id &&
				(teamDetails.is_battle_team ? (
					<div className="my-4">This is your battle team</div>
				) : (
					<button className="btn my-4" onClick={handleSetBattleTeam}>
						Set Battle Team
					</button>
				))}
			<div className="flex flex-wrap justify-center gap-4 my-10">
				{!!pokemons &&
					pokemons.map((myPokemon) => {
						const { id, nickname, pokemon_id, name, hp, attack, defense, speed, sp_attack, sp_defense, total } =
							myPokemon;
						const stats = { hp, attack, defense, speed, sp_attack, sp_defense, total };

						const { move_id, move_name, power, category } = myPokemon;

						return (
							<TeamPokemonEntry
								key={id}
								id={id}
								nickname={nickname}
								move={!!move_id && { name: move_name, power, category }}
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
