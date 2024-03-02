import React, { useEffect, useMemo, useState } from "react";
import axios from "../../utils/AxiosSetup";
import { useParams } from "react-router-dom";
import TeamPokemonEntry from "../team/TeamPokemonEntry";
import Popup from "../../components/Popup";
import { IoMdCloseCircle } from "react-icons/io";
import { FaAngleLeft, FaAngleDoubleLeft, FaAngleRight, FaAngleDoubleRight } from "react-icons/fa";
import Stage from "../../assets/stage.webp";

const TeamSidebar = ({ trainer_id, trainer_name, team_name, pokemons }) => {
	const [popupPokemon, setPopupPokemon] = useState(null);
	return (
		<div className="flex flex-col gap-2 items-center">
			{!!popupPokemon && (
				<Popup>
					<div className="min-w-1/2 w-fit relative rounded-md">
						<button
							className=" absolute -top-5 -right-5 z-50"
							onClick={() => {
								setPopupPokemon(null);
							}}
						>
							<IoMdCloseCircle />
						</button>
						<TeamPokemonEntry key={popupPokemon.id} {...popupPokemon} inBattle={true} />
					</div>
				</Popup>
			)}
			<p>
				Trainer <span className="bg-slate-600 px-2 py-0.5 rounded-md">{trainer_name}</span>
			</p>
			<h3>
				Team <span className="bg-slate-600 px-2 py-0.5 rounded-md">{team_name}</span>
			</h3>
			<div className="flex flex-col gap-2">
				{pokemons.map((pokemon) => (
					<div
						className={`flex flex-col w-20 p-2 gap-1 shadow-md rounded-lg bg-white text-black font-semibold text-xs`}
					>
						<img
							src={`${axios.getUri()}pokemons/${pokemon.pokemonData.pokemon_id}/image`}
							loading="lazy"
							alt=""
							className="aspect-square"
							onClick={() => {
								setPopupPokemon(pokemon);
							}}
						/>
						<div className="text-center">{pokemon.pokemonData.name}</div>
					</div>
				))}
			</div>
		</div>
	);
};

const BattlePokemon = ({ currHp, nickname, pokemonData }) => {
	return (
		<div className="flex flex-col items-center gap-2">
			<img src={`${axios.getUri()}pokemons/${pokemonData.pokemon_id}/image`} className={`w-40`} />
			<div className="bg-white text-black w-40">
				{nickname}
				<div className={`mx-1 h-1 bg-opacity-20 bg-green-500 rounded-full overflow-hidden`}>
					<div
						className={`w-full h-full bg-green-500`}
						style={{
							transformOrigin: "left",
							transform: `scaleX(${currHp / pokemonData.stats.hp})`,
						}}
					></div>
				</div>
			</div>
		</div>
	);
};

const BattleCanvas = ({ logs, pokemons_1, pokemons_2 }) => {
	const [currentTurn, setCurrentTurn] = useState(0);

	const log = useMemo(() => {
		if (logs) {
			return logs[currentTurn];
		}
		return null;
	}, [logs, currentTurn]);
	// console.log(log);

	const pokemon_1_data = useMemo(() => {
		if (log) {
			return pokemons_1.find((pokemon) => pokemon.id === log.pokemon_1);
		}
		return null;
	}, [log]);

	const pokemon_2_data = useMemo(() => {
		if (log) {
			return pokemons_2.find((pokemon) => pokemon.id === log.pokemon_2);
		}
		return null;
	}, [log]);

	return (
		<div className="flex-1 flex flex-col items-center gap-3">
			<div
				className="w-[50rem] flex-1 flex items-end justify-between gap-40 p-6 bg-cover bg-center pb-32 px-24"
				style={{
					backgroundImage: `url(${Stage})`,
				}}
			>
				{!!log && (
					<>
						<BattlePokemon
							currHp={log.hp_1}
							nickname={pokemon_1_data.nickname}
							pokemonData={pokemon_1_data.pokemonData}
						/>
						<BattlePokemon
							currHp={log.hp_2}
							nickname={pokemon_2_data.nickname}
							pokemonData={pokemon_2_data.pokemonData}
						/>
					</>
				)}
			</div>
			<div className="flex gap-10">
				<FaAngleDoubleLeft className="cursor-pointer" onClick={setCurrentTurn.bind(null, 0)} />
				<FaAngleLeft
					className="cursor-pointer"
					onClick={() => {
						setCurrentTurn((prev) => (prev > 0 ? prev - 1 : 0));
					}}
				/>
				<FaAngleRight
					className="cursor-pointer"
					onClick={() => {
						setCurrentTurn((prev) => (prev < logs.length - 1 ? prev + 1 : logs.length - 1));
					}}
				/>
				<FaAngleDoubleRight className="cursor-pointer" onClick={setCurrentTurn.bind(null, logs.length - 1)} />
			</div>
		</div>
	);
};

const BattleSpecific = () => {
	const { battleId } = useParams();
	const [battleInfo, setBattleInfo] = useState(null);

	const getBattle = async () => {
		try {
			const req = await axios.get(`/battle/${battleId}`);
			const data = req.data;
			console.log(data);

			setBattleInfo(data);
		} catch (error) {}
	};

	useEffect(() => {
		getBattle();
	}, []);

	if (!battleInfo) {
		return null;
	}

	return (
		<div className="flex justify-between gap-2 my-8">
			<TeamSidebar
				trainer_id={battleInfo.trainer_1}
				trainer_name={battleInfo.trainer_1_name}
				team_name={battleInfo.team_1_name}
				pokemons={battleInfo.pokemons_1}
			/>
			<BattleCanvas logs={battleInfo.logs} pokemons_1={battleInfo.pokemons_1} pokemons_2={battleInfo.pokemons_2} />
			<TeamSidebar
				trainer_id={battleInfo.trainer_2}
				trainer_name={battleInfo.trainer_2_name}
				team_name={battleInfo.team_2_name}
				pokemons={battleInfo.pokemons_2}
			/>
		</div>
	);
};

export default BattleSpecific;
