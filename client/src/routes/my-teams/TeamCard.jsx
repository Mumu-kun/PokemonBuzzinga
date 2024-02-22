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
			const req = await axiosApi.get(`/teams/${team_id}/pokemons`);
			const data = req.data;

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
			className={`flex flex-col gap-2 items-center w-52 min-h-80 rounded-lg bg-white text-black py-4 px-6 ${
				!!is_battle_team && "outline outline-2 outline-amber-500 border-2 border-amber-500"
			}`}
		>
			{/* <span>{id}</span> */}
			<span className="text-h3 my-2">{team_name}</span>
			<div className="flex flex-col w-full gap-2 mb-4 cursor-default">
				{pokemons.map((pokemon) => (
					<div
						key={pokemon.id}
						className="flex w-full px-4 py-1 justify-start gap-4 text-left text-sm bg-slate-200 rounded-md"
					>
						{/* <span>{pokemon.id} : </span> */}
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
