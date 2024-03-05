import React, { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
import axios from "../../utils/AxiosSetup";
import { Link, useParams } from "react-router-dom";
import TeamPokemonEntry from "../team/TeamPokemonEntry";
import Popup from "../../components/Popup";
import { IoMdCloseCircle } from "react-icons/io";
import { FaAngleLeft, FaAngleDoubleLeft, FaAngleRight, FaAngleDoubleRight, FaPlay, FaPause } from "react-icons/fa";
import Stage from "../../assets/stage2.jpeg";
import VictoryImg from "../../assets/VictoryImg.jpg";
import Explosion from "./Corregidor";
import Loading from "../../components/Loading";
import ConfettiExplosion from "react-confetti-explosion";

const battleContext = createContext(null);

const TeamSidebar = ({ trainer_id, trainer_name, team_name, pokemons }) => {
	const [popupPokemon, setPopupPokemon] = useState(null);
	return (
		<div className="flex flex-col items-center gap-2 self-stretch rounded-md bg-slate-800 p-3">
			{!!popupPokemon && (
				<Popup>
					<div className="min-w-1/2 relative w-fit rounded-md">
						<button
							className=" absolute -right-5 -top-5 z-50"
							onClick={() => {
								setPopupPokemon(null);
							}}
						>
							<IoMdCloseCircle />
						</button>
						<TeamPokemonEntry key={popupPokemon.id} {...popupPokemon} hideDetails={true} />
					</div>
				</Popup>
			)}
			<p>
				Trainer{" "}
				<Link to={`/profile/${trainer_id}`} className="rounded-md bg-slate-600 px-2 py-0.5">
					{trainer_name}
				</Link>
			</p>
			<h3>
				Team <span className="rounded-md bg-slate-600 px-2 py-0.5">{team_name}</span>
			</h3>
			<div className="mt-3 flex flex-col gap-2">
				{pokemons.map((pokemon) => (
					<div
						className={`flex w-20 flex-col gap-1 rounded-lg bg-white p-2 text-xs font-semibold text-black shadow-md`}
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

const typeToColor = {
	1: "#A8A77A",
	2: "#EE8130",
	3: "#6390F0",
	4: "#F7D02C",
	5: "#7AC74C",
	6: "#96D9D6",
	7: "#C22E28",
	8: "#A33EA1",
	9: "#E2BF65",
	10: "#A98FF3",
	11: "#F95587",
	12: "#A6B91A",
	13: "#B6A136",
	14: "#735797",
	15: "#6F35FC",
	16: "#705746",
	17: "#B7B7CE",
	18: "#D685AD",
};

const effectivity = {
	0: "It's had no effective",
	0.25: "It's not very effective",
	0.5: "It's not effective",
	1: null,
	2: "It's very effective",
	4: "It's super effective",
};

const BattlePokemon = ({
	currHp,
	nickname,
	pokemonData,
	attacked_type,
	attacked = false,
	defended = false,
	celebrate,
}) => {
	const [faint, setFaint] = useState(false);
	const [death, setDeath] = useState(false);
	const [timer, setTimer] = useState(null);

	const pokemonAnimation = () => {
		if (attacked) {
			return "animate-attack";
		} else if (defended) {
			return "animate-defend";
		}

		return "";
	};

	useLayoutEffect(() => {
		setFaint(false);
		setDeath(false);
		clearTimeout(timer);
		setTimer(null);

		return () => {
			clearTimeout(timer);
		};
	}, [currHp]);

	return (
		<div className="flex flex-col items-center gap-2">
			<div className="relative h-40 w-40">
				<img
					src={`${axios.getUri()}pokemons/${pokemonData.pokemon_id}/image`}
					className={`${pokemonAnimation()} transition-all ${faint && "grayscale"} ${death && "scale-0"}`}
					onAnimationEnd={() => {
						if (currHp <= 0) {
							setFaint(true);
							setTimer(
								setTimeout(() => {
									setDeath(true);
								}, 500)
							);
							celebrate && celebrate();
						}
					}}
				/>
				{defended && (
					<Explosion
						size="200"
						delay={0.1}
						color={typeToColor[attacked_type]}
						className="!absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
					/>
				)}
			</div>
			<div className="mt-8 w-60 rounded-md border-2 border-black bg-white p-2 px-3 text-black outline outline-[3px] outline-offset-1 outline-black ring-2 ring-white">
				<div className="text-base font-bold">{nickname}</div>
				<div className="flex items-center">
					<div className={`my-2 h-2 flex-1 overflow-hidden rounded-full  bg-green-500 bg-opacity-20`}>
						<div
							className={`h-full w-full bg-green-500 transition-all duration-150`}
							style={{
								transformOrigin: "left",
								transform: `scaleX(${currHp / pokemonData.stats.hp})`,
							}}
						></div>
					</div>
					<div className="ml-1 min-w-10 text-right text-xs font-semibold">
						{currHp < 0 ? 0 : currHp} / {pokemonData.stats.hp}
					</div>
				</div>
			</div>
		</div>
	);
};

const BattleCanvas = ({ logs, pokemons_1, pokemons_2 }) => {
	const [currentTurn, setCurrentTurn] = useState(0);
	const [playing, setPlaying] = useState(false);
	const [battleMsgElem, setBattleMsgElem] = useState(null);
	const [faintedPokemonData, setFaintedPokemonData] = useState(null);
	const [winCelebration, setWinCelebration] = useState(false);
	const battleInfo = useContext(battleContext);

	const log = useMemo(() => {
		if (logs) {
			return logs[currentTurn];
		}
		return null;
	}, [logs, currentTurn]);

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

	const attacker = useMemo(() => {
		if (log) {
			switch (log.attacker_no) {
				case 1:
					return pokemon_1_data;
				case 2:
					return pokemon_2_data;
				default:
					break;
			}
		}
		return null;
	}, [log]);

	const prevTurn = () => {
		setCurrentTurn((prev) => (prev > 0 ? prev - 1 : 0));
	};
	const nextTurn = () => {
		setCurrentTurn((prev) => (prev < logs.length - 1 ? prev + 1 : logs.length - 1));
	};

	const winner = useMemo(() => {
		if (!!logs) {
			if (logs[logs.length - 1].hp_1 <= 0) {
				return battleInfo.trainer_2_name;
			} else if (logs[logs.length - 1] <= 0) {
				return battleInfo.trainer_1_name;
			}
		}
	}, [logs, battleInfo]);

	const celebrate = () => {
		setWinCelebration(true);
		setPlaying(false);
	};

	useLayoutEffect(() => {
		setWinCelebration(false);
		if (log) {
			if (log.hp_1 <= 0) {
				setFaintedPokemonData(pokemon_1_data);
			} else if (log.hp_2 <= 0) {
				setFaintedPokemonData(pokemon_2_data);
			}
			if (currentTurn === 0) {
				setBattleMsgElem("Battle Start");
			} else if (logs[currentTurn].attacker_no === null) {
				if (logs[currentTurn - 1].hp_1 <= 0) {
					setBattleMsgElem(
						<>
							<p>
								<span className="font-semibold">{faintedPokemonData.nickname}</span> Fainted
							</p>
							<p>
								<span className="font-semibold">{battleInfo.trainer_1_name} </span>
								sent
								<span className="font-semibold"> {pokemon_1_data.nickname}</span>
							</p>
						</>
					);
				} else if (logs[currentTurn - 1].hp_2 <= 0) {
					setBattleMsgElem(
						<>
							<p>
								<span className="font-semibold">{faintedPokemonData.nickname}</span> Fainted
							</p>
							<p>
								<span className="font-semibold">{battleInfo.trainer_2_name} </span>
								sent
								<span className="font-semibold"> {pokemon_2_data.nickname}</span>
							</p>
						</>
					);
				}
			} else {
				setBattleMsgElem(null);
			}
		}
	}, [currentTurn]);

	return (
		<div className="relative flex flex-1 flex-col items-center gap-3">
			<div
				className={`text-bold dialogue--border absolute top-10 z-20 flex flex-col items-center gap-4 bg-white p-4 px-6 text-3xl text-black transition-all ${winCelebration ? "" : "opacity-0"}`}
			>
				<div>{winner} Won</div>
				<div className="text-lg">Received {battleInfo.reward}$</div>
				<img src={VictoryImg} alt="" className="w-96" />
				{winCelebration && <ConfettiExplosion className="-mt-4" />}
			</div>
			<div
				className="flex h-[40rem] items-end justify-between gap-40 bg-cover bg-center p-4 px-24"
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
							attacked={log.attacker_no === 1}
							defended={log.attacker_no === 2}
							factor={log.factor}
							attacked_type={pokemon_2_data.move.type_id}
							celebrate={logs.length - 1 === currentTurn ? celebrate : null}
						/>
						<BattlePokemon
							currHp={log.hp_2}
							nickname={pokemon_2_data.nickname}
							pokemonData={pokemon_2_data.pokemonData}
							attacked={log.attacker_no === 2}
							defended={log.attacker_no === 1}
							factor={log.factor}
							attacked_type={pokemon_1_data.move.type_id}
							celebrate={logs.length - 1 === currentTurn ? celebrate : null}
						/>
					</>
				)}
			</div>

			{/* Timer */}
			<div className="h-2 w-full self-stretch bg-white">
				<div
					className={`animate-progressBar h-full w-full bg-red-900 ${currentTurn !== logs.length - 1 && playing ? "" : "pause"}`}
					onAnimationIteration={nextTurn}
				></div>
			</div>

			{/* Battle Messages */}
			<div className="dialogue--border relative flex h-24 w-full flex-col items-center justify-center bg-white text-black">
				{!!attacker && (
					<>
						<p>
							<span className="font-semibold">{attacker.nickname} </span>
							used
							<span className="font-semibold"> {attacker.move.name}</span>
						</p>
						{log.damage === 0 ? <p>But it failed</p> : effectivity[log.factor] && <p>{effectivity[log.factor]}</p>}
					</>
				)}
				{!!battleMsgElem && battleMsgElem}
			</div>

			{/* Battle Playback Controls */}
			<div className="flex gap-10 text-xl">
				<FaAngleDoubleLeft className="cursor-pointer" onClick={setCurrentTurn.bind(null, 0)} />
				<FaAngleLeft
					className="cursor-pointer"
					onClick={() => {
						prevTurn();
						setPlaying(false);
					}}
				/>
				{playing ? (
					<FaPause className="cursor-pointer" onClick={() => setPlaying(false)} />
				) : (
					<FaPlay
						className="cursor-pointer"
						onClick={() => {
							currentTurn < logs.length - 1 && setPlaying(true);
						}}
					/>
				)}
				<FaAngleRight
					className="cursor-pointer"
					onClick={() => {
						nextTurn();
						setPlaying(false);
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
	const [msg, setMsg] = useState(null);

	const getBattle = async () => {
		try {
			const req = await axios.get(`/battle/${battleId}`);
			const data = req.data;

			setBattleInfo(data);
		} catch (error) {
			console.error(error);
			if (error?.response?.status === 409) {
				setMsg(error.response.data.message);
			}
		}
	};

	useEffect(() => {
		getBattle();
	}, []);

	if (!battleInfo) {
		if (!msg) {
			return <Loading />;
		}
		return (
			<div className="flex flex-1 flex-col items-center justify-center">
				<h1 className="text-4xl">{msg}</h1>
			</div>
		);
	}

	return (
		<battleContext.Provider value={battleInfo}>
			<div className="my-8  flex justify-between gap-6">
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
		</battleContext.Provider>
	);
};

export default BattleSpecific;
