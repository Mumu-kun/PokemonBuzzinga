import { useState } from "react";
import PokemonEntry from "../pokemons/PokemonEntry";
import axios from "../../utils/AxiosSetup";
import Moves from "./Moves";
import { IoMdCloseCircle } from "react-icons/io";
import MsgPopup from "../../components/MsgPopup";

function TeamPokemonEntry({ id, nickname, move, pokemonData, getTeamDetails }) {
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
			{!!error && <MsgPopup message={error} setMessage={setError} />}
			{!!moves.length && (
				<div className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen z-10 bg-opacity-50 bg-slate-900">
					<div className="w-1/2 relative rounded-md">
						<button
							className=" absolute -top-5 -right-5 z-50"
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

			<div className="flex flex-col items-center bg-slate-100 text-black rounded-lg p-2">
				<div className="text-center p-2 w-3/4" style={{ wordSpacing: `0.5rem` }}>
					Nickname : {nickname}
				</div>
				<PokemonEntry {...pokemonData} className="border-t-2 border-slate-400 shadow-sm shadow-slate-300" />
				<div className="self-start ml-2 mt-2">Select Move :</div>
				<div
					className="flex justify-between self-stretch m-2 px-4 py-1 rounded-md transition-all bg-white hover:bg-green-400 cursor-pointer text-sm"
					onClick={showMoves}
				>
					{!!move ? (
						<>
							<span>{move.name}</span>
							<span>{move.power}</span>
						</>
					) : (
						<span className="mx-auto">None</span>
					)}
				</div>
				<button className="btn--red my-2 mt-4" onClick={handleRemovePokemon}>
					Delete
				</button>
			</div>
		</>
	);
}

export default TeamPokemonEntry;
