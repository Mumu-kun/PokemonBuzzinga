import React, { useState } from "react";
import PokemonEntry from "./PokemonEntry";
import axios from "../../utils/AxiosSetup";
import MessagePopup from "../../components/MessagePopup";
import Popup from "../../components/Popup";
import useAuthContext from "../../hooks/useAuthContext";
import { TiTick } from "react-icons/ti";

function MyPokemonEntry({ id, nickname: pNickname, team_id, pokemonData, teams, getMyPokemons, inProfile = false }) {
	const { user } = useAuthContext();

	const [selectedTeam, setSelectedTeam] = useState(team_id);
	const [msg, setMsg] = useState(null);
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
				setMsg(error.response.data.message);
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
				setMsg(error.response.data.message);
			}
		} finally {
			setFreePrompt(false);
		}
	};

	return (
		<>
			{!!msg && <MessagePopup message={msg} setMessage={setMsg} />}

			<div
				className="flex w-fit flex-col items-center rounded-lg bg-slate-200 p-3 text-black transition-all hover:bg-slate-300"
				key={id}
			>
				<div className="my-1 text-xs">Nickname</div>
				<div className="min-w-3/4 relative mx-4 mb-2 p-1">
					<input
						className="rounded-md py-1  text-center outline outline-1 outline-slate-200 focus:outline-2 focus:outline-slate-400"
						value={nickname}
						onChange={(e) => {
							setNickname(e.target.value);
							setNicknameChanged(true);
						}}
						disabled={inProfile}
					/>
					{nicknameChanged && (
						<div className="absolute -right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-md bg-green-700 text-white">
							<TiTick />
						</div>
					)}
				</div>

				<PokemonEntry {...pokemonData} className="border-t-2 border-slate-300 shadow-sm shadow-slate-300" />
				{!inProfile && (
					<>
						<div className="flex w-full items-center justify-center">
							<span className="pr-2 font-semibold">Team :</span>
							<select
								name="teams"
								value={selectedTeam ?? "none"}
								onChange={handleChangeTeam}
								className="my-2 inline-block w-full max-w-48 cursor-pointer rounded-md bg-white p-1 text-black"
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
						<div className="mx-6 text-lg font-semibold">Are you sure?</div>
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
