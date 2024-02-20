import React, { useState } from "react";
import PokemonEntry from "./PokemonEntry";
import axios from "../../utils/AxiosSetup";
import ErrorPopup from "../../components/ErrorPopup";
import Popup from "../../components/Popup";
import useAuthContext from "../../hooks/useAuthContext";

function MyPokemonEntry({ id, nickname, team_id, pokemonData, teams, getMyPokemons }) {
	const { user } = useAuthContext();

	const [selectedTeam, setSelectedTeam] = useState(team_id);
	const [error, setError] = useState(null);
	const [freePrompt, setFreePrompt] = useState(false);

	const handleChangeTeam = async (e) => {
		const formData = {
			ownedPokemonId: id,
		};

		setSelectedTeam("loading");

		try {
			const selectedOption = e.target.value;

			const req =
				selectedOption === "none"
					? await axios.delete(`/delete-pokemon-from-team/`, { data: formData })
					: await axios.post(`/add-pokemon-to-team/${selectedOption}`, formData);

			const data = req.data;

			setSelectedTeam(selectedOption === "none" ? "none" : data.team_id);

			getMyPokemons();
		} catch (error) {
			console.error(error);

			if (error.response.data.message) {
				setError(error.response.data.message);
			}

			setSelectedTeam(null);
		}
	};

	const handleFreePokemon = async () => {
		const formData = {
			ownedPokemonId: id,
		};

		try {
			const req = await axios.delete(`/owned-pokemons/${user.id}`, { data: formData });
			const data = req.data;

			getMyPokemons();
		} catch (error) {
			console.error(error);

			if (error.response?.data?.message) {
				setError(error.response.data.message);
			}
		} finally {
			setFreePrompt(false);
		}
	};

	return (
		<>
			{!!error && <ErrorPopup message={error} setMessage={setError} />}

			<div className="flex flex-col bg-slate-100 text-black rounded-lg items-center p-2" key={id}>
				<div className="text-center p-2 mx-4 min-w-3/4" style={{ wordSpacing: `0.5rem` }}>
					Nickname : {nickname}
				</div>
				<PokemonEntry {...pokemonData} className="border-t-2 border-slate-500 shadow-sm shadow-slate-300" />
				<div className="w-full flex justify-center items-center">
					<span className="font-semibold pr-2">Team :</span>
					<select
						name="teams"
						value={selectedTeam ?? "none"}
						onChange={handleChangeTeam}
						className="inline-block text-black max-w-48 w-full my-2 p-1 rounded-md bg-white cursor-pointer"
					>
						<option value={"none"}>None</option>
						<option value={"loading"} hidden>
							-----
						</option>

						{!!teams && teams.map((teamInfo) => <option value={teamInfo.team_id}>{teamInfo.team_name}</option>)}
					</select>
				</div>
				<button
					className="btn--red"
					onClick={() => {
						setFreePrompt(true);
					}}
				>
					Free
				</button>
			</div>
			{!!freePrompt && (
				<Popup>
					<>
						<div className="text-lg font-semibold mx-6">Are you sure?</div>
						<div className="mb-4">Freeing a pokemon is irreversible.</div>
						<div className="flex gap-4">
							<button
								className="btn--green"
								onClick={() => {
									setFreePrompt(false);
								}}
							>
								Cancel
							</button>
							<button
								className="btn--red"
								onClick={() => {
									handleFreePokemon();
								}}
							>
								Free
							</button>
						</div>
					</>
				</Popup>
			)}
		</>
	);
}

export default MyPokemonEntry;
