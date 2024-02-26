import React, { useState } from "react";
import PokemonEntry from "./PokemonEntry";
import axios from "../../utils/AxiosSetup";
import ErrorPopup from "../../components/ErrorPopup";
import Popup from "../../components/Popup";
import useAuthContext from "../../hooks/useAuthContext";
import { TiTick } from "react-icons/ti";

function MyPokemonEntry({ id, nickname: pNickname, team_id, pokemonData, teams, getMyPokemons, inProfile = false }) {
	const { user } = useAuthContext();

	const [selectedTeam, setSelectedTeam] = useState(team_id);
	const [error, setError] = useState(null);
	const [freePrompt, setFreePrompt] = useState(false);
	const [nickname, setNickname] = useState(pNickname);
	const [nicknameChanged, setNicknameChanged] = useState(false);

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

			<div className="flex flex-col w-fit bg-slate-100 text-black rounded-lg items-center p-2" key={id}>
				<div className="text-xs my-1">Nickname</div>
				<div className="p-1 mb-2 mx-4 min-w-3/4 relative">
					<input
						className="text-center py-1  rounded-md outline outline-slate-200 outline-1 focus:outline-2 focus:outline-slate-400"
						value={nickname}
						onChange={(e) => {
							setNickname(e.target.value);
							setNicknameChanged(true);
						}}
						disabled={inProfile}
					/>
					{nicknameChanged && (
						<div className="absolute -right-4 top-1/2 -translate-y-1/2 bg-green-700 rounded-md text-white cursor-pointer">
							<TiTick />
						</div>
					)}
				</div>

				<PokemonEntry {...pokemonData} className="border-t-2 border-slate-500 shadow-sm shadow-slate-300" />
				{!inProfile && (
					<>
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
					</>
				)}
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
