import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TeamPokemonEntry from "./TeamPokemonEntry";
import axiosApi from "../../utils/AxiosSetup";
import useAuthContext from "../../hooks/useAuthContext";
import MessagePopup from "../../components/MessagePopup";

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
		} catch (error) {
			console.error(error);
		}
	};

	const handleSetBattleTeam = async (clear = false) => {
		try {
			const req = await axiosApi.put(`/trainer/${user.id}/battle-team`, { team_id: clear ? null : team_id });
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

	const isMyTeam = teamDetails.trainer_id === user.id;

	return (
		<>
			{!!msg && <MessagePopup message={msg} setMessage={setMsg} />}
			<h1 className="text-h1">{teamDetails.team_name}</h1>
			<h3 className="text-h3">
				Trainer :{" "}
				<Link to={`/profile/${teamDetails.trainer_id}`} className="rounded-md bg-slate-600 px-2 py-0.5">
					{teamDetails.name}
				</Link>
			</h3>
			{teamDetails.trainer_id === user.id &&
				(teamDetails.is_battle_team ? (
					<button className="btn--red my-4" onClick={handleSetBattleTeam.bind(null, true)}>
						Deselect Battle Team
					</button>
				) : (
					<button className="btn my-4" onClick={handleSetBattleTeam.bind(null, false)}>
						Set Battle Team
					</button>
				))}
			<div className="my-10 flex flex-wrap justify-center gap-4">
				{!!pokemons &&
					pokemons.map((myPokemon) => {
						const { id, nickname, pokemon_id, name, hp, attack, defense, speed, sp_attack, sp_defense, total } =
							myPokemon;
						const stats = { hp, attack, defense, speed, sp_attack, sp_defense, total };

						const { move_id, move_name, power, accuracy } = myPokemon;

						return (
							<TeamPokemonEntry
								key={id}
								id={id}
								nickname={nickname}
								move={!!move_id && { name: move_name, power, accuracy }}
								pokemonData={{ pokemon_id, name, stats, buy: false }}
								getTeamDetails={getTeamDetails}
								hideDetails={!isMyTeam}
								hideMove={!isMyTeam}
							/>
						);
					})}
			</div>
		</>
	);
}

export default TeamPage;
