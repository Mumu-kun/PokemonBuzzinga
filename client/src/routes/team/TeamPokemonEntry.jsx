import { useState } from "react";
import PokemonEntry from "../pokemons/PokemonEntry";
import axios from "../../utils/AxiosSetup";
import Moves from "./Moves";
import { IoMdCloseCircle } from "react-icons/io";
import MessagePopup from "../../components/MessagePopup";

function TeamPokemonEntry({
	id,
	nickname,
	move,
	pokemonData,
	getTeamDetails,
	hideDetails = false,
	hideMove = false,
	className: PClassName,
}) {
	const [error, setError] = useState(null);
	const [moves, setMoves] = useState([]);

	const handleRemovePokemon = async () => {
		const formData = {
			ownedPokemonId: id,
		};

		try {
			const req = await axios.delete(`/delete-pokemon-from-team/`, { data: formData });

			const data = req.data;

			getTeamDetails();
		} catch (error) {
			console.error(error);
		}
	};

	const getMoves = async () => {
		try {
			const req = await axios.get(`/pokemons/${pokemonData.pokemon_id}/moves`);
			const data = req.data;

			setMoves(data);
		} catch (error) {
			console.error(error);
		}
	};

	const setMove = async (moveId) => {
		const formData = {
			moveId,
			ownedPokemonId: id,
		};

		try {
			const req = await axios.put(`/set-move`, formData);
			const data = req.data;

			setMoves([]);
			getTeamDetails();
		} catch (error) {
			console.error(error);

			if (error.response.data.message) {
				setError(error.response.data.message);
			}
		}
	};

	const showMoves = () => {
		getMoves();
	};

	return (
		<>
			{!!error && <MessagePopup message={error} setMessage={setError} />}
			{!!moves.length && (
				<div
					className={`fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-slate-700 bg-opacity-25`}
				>
					<div className="min-w-1/2 relative rounded-md">
						<button
							className=" absolute -right-5 -top-5 z-50"
							onClick={() => {
								setMoves([]);
							}}
						>
							<IoMdCloseCircle />
						</button>
						<Moves moves={moves} setMove={setMove} />
					</div>
				</div>
			)}

			<div className={`flex w-72 flex-col items-center rounded-lg bg-slate-100 p-2 text-black ${PClassName}`}>
				<div className="w-3/4 p-2 text-center" style={{ wordSpacing: `0.5rem` }}>
					Nickname : {nickname}
				</div>
				<PokemonEntry
					{...pokemonData}
					linkDisable={hideDetails}
					className="border-t-2 border-slate-400 shadow-sm shadow-slate-300"
				/>

				{!hideMove && (
					<>
						{!hideDetails && <div className="ml-2 mt-2 self-start">Select Move :</div>}
						<div
							className="m-2 flex cursor-pointer justify-between self-stretch rounded-md bg-white px-4 py-1 text-sm transition-all hover:bg-green-400"
							onClick={!hideDetails ? showMoves : null}
						>
							{!!move ? (
								<>
									<span className="flex-1">{move.name}</span>
									<span className="w-10 text-right">{move.power}</span>
									<span className="w-10 text-right">{move.accuracy}</span>
								</>
							) : (
								<span className="mx-auto">None</span>
							)}
						</div>
					</>
				)}

				{!hideDetails && (
					<button className="btn--red my-2 mt-4" onClick={handleRemovePokemon}>
						Delete
					</button>
				)}
			</div>
		</>
	);
}

export default TeamPokemonEntry;
