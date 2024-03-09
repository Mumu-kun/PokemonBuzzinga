import { useParams } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
import axios from "../../utils/AxiosSetup";
import React, { useState, useEffect } from "react";
import { FaHeart, FaShieldAlt, FaListAlt, FaFistRaised } from "react-icons/fa";
import { LuWind } from "react-icons/lu";
import { WiStars } from "react-icons/wi";
import PopupBuy from "./PopupBuy";
import { GiGlassBall } from "react-icons/gi";
import { Link } from "react-router-dom";
import MessagePopup from "../../components/MessagePopup";
import EvolutionChain from "./EvolutionChain";
import Loading from "../../components/Loading";

const statToStyle = {
	hp: { icon: <FaHeart />, color: "bg-green-500", textCol: "text-green-500" },
	attack: {
		icon: <FaFistRaised />,
		color: "bg-red-500",
		textCol: "text-red-500",
	},
	defense: {
		icon: <FaShieldAlt />,
		color: "bg-blue-400",
		textCol: "text-blue-400",
	},
	speed: {
		icon: <LuWind />,
		color: "bg-orange-400",
		textCol: "text-orange-400",
	},
	sp_attack: {
		icon: <WiStars />,
		color: "bg-pink-400",
		textCol: "text-pink-400",
	},
	sp_defense: {
		icon: <GiGlassBall />,
		color: "bg-violet-500",
		textCol: "text-violet-500",
	},
	total: {
		icon: <FaListAlt />,
		color: "bg-slate-700",
		textCol: "text-slate-700",
	},
};

const typeToStyle = {
	Normal: { bgColor: "bg-gray-400", textColor: "text-gray-900" },
	Fire: { bgColor: "bg-red-500", textColor: "text-white" },
	Water: { bgColor: "bg-blue-500", textColor: "text-white" },
	Electric: { bgColor: "bg-yellow-400", textColor: "text-gray-900" },
	Grass: { bgColor: "bg-green-500", textColor: "text-white" },
	Ice: { bgColor: "bg-blue-200", textColor: "text-gray-900" },
	Fighting: { bgColor: "bg-red-700", textColor: "text-white" },
	Poison: { bgColor: "bg-purple-500", textColor: "text-white" },
	Ground: { bgColor: "bg-yellow-700", textColor: "text-white" },
	Flying: { bgColor: "bg-indigo-400", textColor: "text-white" },
	Psychic: { bgColor: "bg-pink-400", textColor: "text-white" },
	Bug: { bgColor: "bg-green-700", textColor: "text-white" },
	Rock: { bgColor: "bg-gray-600", textColor: "text-white" },
	Ghost: { bgColor: "bg-purple-700", textColor: "text-white" },
	Dragon: { bgColor: "bg-indigo-700", textColor: "text-white" },
	Dark: { bgColor: "bg-gray-800", textColor: "text-white" },
	Steel: { bgColor: "bg-gray-400", textColor: "text-gray-900" },
	Fairy: { bgColor: "bg-pink-200", textColor: "text-gray-900" },
};

const PokemonDetailsPage = () => {
	const [pokemonDetails, setPokemonDetails] = useState(null);
	const [showPopup, setShowPopup] = useState(false);
	const [msg, setMsg] = useState(null);
	const { id } = useParams();
	const { user } = useAuthContext();

	const fetchPokemonDetails = async () => {
		try {
			const response = await axios.get(`/pokemons-dets/${id}`);
			const data = response.data;
			setPokemonDetails(data);
		} catch (error) {
			console.error("Failed to fetch Pokémon details", error);
		}
	};

	useEffect(() => {
		setPokemonDetails(null);
		fetchPokemonDetails();
	}, [id]);

	if (!pokemonDetails) {
		return <Loading />;
	}

	const { stats, abilities, moves } = pokemonDetails;

	const handleBuy = async () => {
		setShowPopup(true);
	};

	const handleSubmitNickname = async (denam) => {
		try {
			const formData = {
				pokemonId: pokemonDetails.pokemon_id,
				nickname: denam,
			};

			const res = await axios.post(`/owned-pokemons/${user.id}`, formData);
			setMsg("You have successfully bought the Pokémon!");
		} catch (error) {
			console.error(error);

			if (error.response.status === 409) {
				setMsg(error.response.data.message);
			}

			if (error.response.status === 409) {
				setMsg(error.response.data.message);
			}
		} finally {
			setShowPopup(false);
		}
	};

	const handleCancelNickname = () => {
		setShowPopup(false);
	};
	const nextpok = parseInt(id, 10) + 1;
	const prevpok = parseInt(id, 10) - 1;

	return (
		<div className="pokemon-details-container -mx-4 w-[105%] bg-gray-100 p-4 text-gray-800">
			{!!msg && <MessagePopup message={msg} setMessage={setMsg} />}
			<div className="pokemon-details-container rounded-lg bg-blue-100 p-10 px-14">
				<div className="my-4 flex justify-between">
					<Link
						to={`/pokemonsdets/${prevpok}`}
						disabled={pokemonDetails?.pokemon_id === 1}
						className="rounded bg-purple-500 px-4 py-2 font-bold text-white hover:bg-purple-700"
					>
						Previous
					</Link>
					<Link
						to={`/pokemonsdets/${nextpok}`}
						disabled={!pokemonDetails}
						className="rounded bg-purple-500 px-4 py-2 font-bold text-white hover:bg-purple-700"
					>
						Next
					</Link>
				</div>
				<div>
					<p>Pokémon ID: {pokemonDetails.pokemon_id}</p>
					<p className="font-bold">
						Name: <span className="italic">{pokemonDetails.name}</span>
					</p>
				</div>
				<div className="mb-4 flex justify-center">
					<img
						src={`${axios.getUri()}pokemons/${pokemonDetails.pokemon_id}/image`}
						alt={pokemonDetails.name}
						className="w-50 h-50 my-2 aspect-square"
						style={{ width: "500px" }}
					/>
				</div>

				{/* <p>Region: {pokemonDetails.region}</p> */}
				<div className="flex w-full items-center justify-between">
					<div className="flex flex-col text-lg font-semibold text-purple-700">
						<span>
							Region: <span className="italic">{pokemonDetails.region}</span>
						</span>
						<span className="text-lg font-semibold text-green-600">
							Price: <span className="italic">{pokemonDetails.price}$</span>
						</span>
					</div>
					<button
						className="btn--green ml-auto rounded-xl px-16 py-4 text-xl font-semibold tracking-wide text-white"
						onClick={handleBuy}
					>
						Buy
					</button>
				</div>
				{showPopup && <PopupBuy onSubmit={handleSubmitNickname} onCancel={handleCancelNickname} />}
				<div className="my-4 mb-1 text-lg font-bold">Stats :</div>
				<div className="mb-3">
					<div className="flex items-center gap-2 text-sm">
						<Link to={`/types`} className="ml-2 font-semibold underline underline-offset-2">
							Types:
						</Link>
						{pokemonDetails.type1 && (
							<Link
								to={`/types`}
								className={`rounded px-3 py-1 ${typeToStyle[pokemonDetails.type1].bgColor} ${
									typeToStyle[pokemonDetails.type1].textColor
								}`}
							>
								{pokemonDetails.type1}
							</Link>
						)}
						{pokemonDetails.type2 && (
							<Link
								to={`/types`}
								className={`rounded px-3 py-1 ${typeToStyle[pokemonDetails.type2].bgColor} ${
									typeToStyle[pokemonDetails.type2].textColor
								}`}
							>
								{pokemonDetails.type2}
							</Link>
						)}
					</div>
				</div>
				<div className="mb-8 w-full pl-2 text-xs">
					{Object.entries(stats).map(([key, value]) => (
						<div key={key} className="mb-2 flex items-center">
							<div className="w-20">{key.toUpperCase()}:</div>
							<span className={`${statToStyle[key].textCol} mr-2`}>{statToStyle[key].icon}</span>
							<div className={`h-3 w-32 bg-opacity-20 ${statToStyle[key].color} flex-1 rounded-full`}>
								<div
									className={`h-full ${statToStyle[key].color}`}
									style={{
										width: `${(key === "total" ? value / 800 : value / 255) * 100}%`,
									}}
								></div>
							</div>
							<span className={`ml-2 font-semibold`}>{value}</span>
						</div>
					))}
				</div>

				<div className="mb-8">
					<p className="mb-1 text-lg font-bold">Abilities:</p>
					{pokemonDetails.abilities.map((ability, index) => (
						<div key={index} className="mb-2 ml-1">
							<p className="text-purple-700">{index === 0 ? "First" : "Second"} Ability:</p>
							<p className="ml-1 text-sm font-semibold">{ability.ability}</p>
							<p className="ml-1 text-sm italic text-gray-700">What it does: {ability.description}</p>
						</div>
					))}
				</div>
				<div className="mb-8">
					<p className="mb-1 text-lg font-bold">Natures:</p>
					<Link to="/naturing" className="ml-2 text-sm text-blue-500 underline underline-offset-4 hover:text-blue-700">
						View Natures
					</Link>
				</div>

				<EvolutionChain ev_chain={pokemonDetails.ev_chain} />

				<div className="mb-8">
					<p className="mb-2 text-lg font-bold">Moves:</p>
					<table className="w-full">
						<thead>
							<tr>
								<th className="border-r-[2px] border-blue-100 bg-slate-500 px-4 py-2 text-white">Move</th>
								<th className="border-r-[2px] border-blue-100 bg-slate-500 px-4 py-2 text-white">Type</th>
								<th className="border-r-[2px] border-blue-100 bg-slate-500 px-4 py-2 text-white">Category</th>
								<th className="border-r-[2px] border-blue-100 bg-slate-500 px-4 py-2 text-white">Power</th>
								<th className="border-r-[2px] border-blue-100 bg-slate-500 px-4 py-2 text-white">Accuracy</th>
								{/* <th className=" px-4 py-2">PP</th> */}
							</tr>
						</thead>
						<tbody className="[&>*:nth-child(odd)]:border-blue-200 [&>*:nth-child(odd)]:bg-blue-200">
							{moves.map((move) => (
								<tr key={move.move_id}>
									<td className="border-r-[2px] border-blue-100 px-4 py-2">{move.name}</td>
									<td
										className={`w-32 border-x-[2px] border-t-0 border-blue-100 px-6 py-2 text-center ${typeToStyle[move.type].bgColor} ${typeToStyle[move.type].textColor}`}
									>
										{move.type}
									</td>
									<td className=" px-4 py-2">{move.category}</td>
									<td className="px-4 py-2 pr-14 text-right">
										{move.power ?? <hr className="float-right h-0.5 w-2 bg-slate-900" />}
									</td>
									<td className="px-4 py-2 pr-14 text-right">
										{move.accuracy ?? <hr className="float-right h-0.5 w-2 bg-slate-900" />}
									</td>
									{/* <td className=" px-4 py-2">{move.pp}</td> */}
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Locations */}
				<div>
					<h3 className="mb-2 text-lg font-bold">Locations:</h3>
					{pokemonDetails.locations.length === 0 ? (
						<p>This Pokémon is not found in the wild.</p>
					) : (
						<div className="grid grid-cols-[2fr_4fr_2fr_2fr_2fr] gap-x-0.5">
							<span className="border-r-2 border-slate-500 bg-slate-500 p-2 text-center font-semibold text-white">
								Region
							</span>
							<span className="border-r-2 border-slate-500 bg-slate-500 p-2 text-center font-semibold text-white">
								Location
							</span>
							<span className="border-r-2 border-slate-500 bg-slate-500 p-2 text-center font-semibold text-white">
								Catch Rate
							</span>
							<span className="border-r-2 border-slate-500 bg-slate-500 p-2 text-center font-semibold text-white">
								Min Level
							</span>
							<span className=" bg-slate-500 p-2 text-center font-semibold text-white">Max Level</span>
							{pokemonDetails.locations.map((location, i) => (
								<>
									<span className={`${i % 2 ? "" : "bg-blue-200"}  p-2 pl-[20%]`}>{location.region_name}</span>
									<span className={`${i % 2 ? "" : "bg-blue-200"}  p-2 pl-[20%] `}>{location.location_name}</span>
									<span className={`${i % 2 ? "" : "bg-blue-200"}  p-2 pr-[30%] text-right`}>{location.catchrate}</span>
									<span className={`${i % 2 ? "" : "bg-blue-200"}  p-2 pr-[30%] text-right`}>{location.level_min}</span>
									<span className={`${i % 2 ? "" : "bg-blue-200"} p-2 pr-[30%] text-right`}>{location.level_max}</span>
								</>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default PokemonDetailsPage;
