import { useParams } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
import axios from "../../utils/AxiosSetup";
import React, { useState, useEffect } from "react";
import { FaHeart, FaShieldAlt, FaListAlt, FaFistRaised } from "react-icons/fa";
import { LuWind } from "react-icons/lu";
import { WiStars } from "react-icons/wi";
import PopupBuy from "./PopupBuy";
import { GiGlassBall } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
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

export const typeToStyle = {
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
	const navigate = useNavigate();

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
		} finally {
			setShowPopup(false);
		}
	};

	const handleCancelNickname = () => {
		setShowPopup(false);
	};
	const handleNext = () => {
		const nextpok = parseInt(id, 10) + 1;
		navigate(`/pokemonsdets/${nextpok}`);
	};

	const handlePrev = () => {
		const prevpok = parseInt(id, 10) - 1;
		if (prevpok >= 0) {
			navigate(`/pokemonsdets/${prevpok}`);
		}
	};

	return (
		<div className="pokemon-details-container bg-gray-100 p-4 text-gray-800" style={{ width: "1000px" }}>
			{!!msg && <MessagePopup message={msg} setMessage={setMsg} />}
			<div className="pokemon-details-container bg-blue-100 p-6 rounded-lg">
				<div className="flex justify-between mt-4">
					<button
						onClick={handlePrev}
						disabled={pokemonDetails?.pokemon_id === 1}
						className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
					>
						Previous
					</button>
					<button
						onClick={handleNext}
						disabled={!pokemonDetails}
						className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
					>
						Next
					</button>
				</div>
				<div>
					<p>Pokémon ID: {pokemonDetails.pokemon_id}</p>
					<p className="font-bold">
						Name: <span className="italic">{pokemonDetails.name}</span>
					</p>
				</div>
				<div className="flex justify-center">
					<img
						src={`${axios.getUri()}pokemons/${pokemonDetails.pokemon_id}/image`}
						alt={pokemonDetails.name}
						className="w-50 h-50 my-2 aspect-square"
						style={{ width: "500px" }}
					/>
				</div>

				{/* <p>Region: {pokemonDetails.region}</p> */}
				<div className="text-lg font-semibold text-purple-700">
					<p>
						Region: <span className="italic">{pokemonDetails.region}</span>
					</p>
					<p className="text-lg font-semibold text-green-600">
						Price: <span className="italic">{pokemonDetails.price}$</span>
					</p>
				</div>
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
					onClick={handleBuy}
				>
					Buy
				</button>
				{showPopup && <PopupBuy onSubmit={handleSubmitNickname} onCancel={handleCancelNickname} />}
				<div className="text-lg font-bold my-4 mb-1">Stats :</div>
				<div className="mb-3">
					<div className="flex gap-2 items-center text-sm">
						<p className="font-semibold ml-2">Types:</p>
						{pokemonDetails.type1 && (
							<button
								className={`py-1 px-3 rounded ${typeToStyle[pokemonDetails.type1].bgColor} ${
									typeToStyle[pokemonDetails.type1].textColor
								}`}
							>
								{pokemonDetails.type1}
							</button>
						)}
						{pokemonDetails.type2 && (
							<button
								className={`py-1 px-3 rounded ${typeToStyle[pokemonDetails.type2].bgColor} ${
									typeToStyle[pokemonDetails.type2].textColor
								}`}
							>
								{pokemonDetails.type2}
							</button>
						)}
					</div>
				</div>
				<div className="w-full text-xs mb-8 pl-2">
					{Object.entries(stats).map(([key, value]) => (
						<div key={key} className="flex items-center mb-2">
							<div className="w-20">{key.toUpperCase()}:</div>
							<span className={`${statToStyle[key].textCol} mr-2`}>{statToStyle[key].icon}</span>
							<div className={`h-3 w-32 bg-opacity-20 ${statToStyle[key].color} rounded-full flex-1`}>
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
					<p className="text-lg font-bold mb-1">Abilities:</p>
					{pokemonDetails.abilities.map((ability, index) => (
						<div key={index} className="mb-2 ml-1">
							<p className="text-purple-700">{index === 0 ? "First" : "Second"} Ability:</p>
							<p className="ml-1 text-sm font-semibold">{ability.ability}</p>
							<p className="ml-1 text-sm italic text-gray-700">What it does: {ability.description}</p>
						</div>
					))}
				</div>

				<EvolutionChain ev_chain={pokemonDetails.ev_chain} />

				<div className="mb-8">
					<p className="text-lg font-bold mb-2">Moves:</p>
					<table className="border-collapse border border-gray-400 w-full">
						<thead>
							<tr>
								<th className="border border-gray-400 px-4 py-2">Move</th>
								<th className="border border-gray-400 px-4 py-2">Type</th>
								<th className="border border-gray-400 px-4 py-2">Category</th>
								<th className="border border-gray-400 px-4 py-2">Power</th>
								<th className="border border-gray-400 px-4 py-2">Accuracy</th>
								{/* <th className="border border-gray-400 px-4 py-2">PP</th> */}
							</tr>
						</thead>
						<tbody>
							{moves.map((move) => (
								<tr key={move.move_id}>
									<td className="border border-gray-400 px-4 py-2">{move.name}</td>
									<td
										className={`border border-gray-400 px-4 py-2 ${typeToStyle[move.type].bgColor} ${
											typeToStyle[move.type].textColor
										}`}
									>
										{move.type}
									</td>
									<td className="border border-gray-400 px-4 py-2">{move.category}</td>
									<td className="border border-gray-400 px-4 py-2">{move.power}</td>
									<td className="border border-gray-400 px-4 py-2">{move.accuracy}</td>
									{/* <td className="border border-gray-400 px-4 py-2">{move.pp}</td> */}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default PokemonDetailsPage;
