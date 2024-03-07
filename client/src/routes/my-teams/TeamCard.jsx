import React, { useEffect, useState } from "react";
import axiosApi from "../../utils/AxiosSetup";
import { Link } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";

function TeamCard({ team_id, trainer_id, team_name, is_battle_team, refreshTeams }) {
	const [pokemons, setPokemons] = useState([]);

	const { user } = useAuthContext();

	const showDelete = user.id === trainer_id && !!refreshTeams;

	const getTeamPokemons = async () => {
		try {
			const req = await axiosApi.get(`/team/${team_id}/pokemons`);
			const data = req.data;

			console.log(data);

			setPokemons(data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleDeleteTeam = async () => {
		const formData = {
			teamId: team_id,
		};

		try {
			const req = await axiosApi.delete(`/teams/${trainer_id}`, { data: formData });
			const data = req.data;
			console.log(data);

			refreshTeams();
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getTeamPokemons();
	}, []);

	return (
		<div
			className={`flex min-h-80 w-60 flex-col items-center gap-2 rounded-lg bg-white px-6 py-4 text-black ${
				!!is_battle_team && "border-2 border-amber-500 outline outline-2 outline-amber-500"
			}`}
		>
			{/* <span>{id}</span> */}
			<span className="text-h3 my-2">{team_name}</span>
			<div className="mb-4 flex w-full cursor-default flex-col gap-2">
				{pokemons.map((pokemon) => (
					<div
						key={pokemon.id}
						className="flex w-full items-center justify-start gap-4 rounded-md bg-slate-200 px-4 py-1 text-left text-sm"
					>
						{/* <span>{pokemon.id} : </span> */}
						<img src={`${axiosApi.getUri()}pokemons/${pokemon.pokemon_id}/image`} className="h-6 w-6 p-0.5" />
						<span className="flex-auto">{pokemon.nickname}</span>
						<span>{pokemon.total}</span>
					</div>
				))}
			</div>
			<Link to={`/team/${team_id}`} className="btn--green mt-auto">
				Details
			</Link>

			{showDelete && (
				<button className="btn--red" onClick={handleDeleteTeam}>
					Delete
				</button>
			)}
		</div>
	);
}

export default TeamCard;
