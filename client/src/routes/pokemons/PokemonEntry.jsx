import { useEffect, useState } from "react";
import axios from "../../utils/AxiosSetup";
import useAuthContext from "../../hooks/useAuthContext";
import { FaHeart, FaShieldAlt, FaListAlt, FaFistRaised } from "react-icons/fa";
import { LuWind } from "react-icons/lu";
import { WiStars } from "react-icons/wi";
import { GiGlassBall } from "react-icons/gi";
import { Link } from "react-router-dom";

const statToStyle = {
	hp: { icon: <FaHeart />, color: "bg-green-500", textCol: "text-green-500" },
	attack: { icon: <FaFistRaised />, color: "bg-red-500", textCol: "text-red-500" },
	defense: { icon: <FaShieldAlt />, color: "bg-blue-400", textCol: "text-blue-400" },
	speed: { icon: <LuWind />, color: "bg-orange-400", textCol: "text-orange-400" },
	sp_attack: { icon: <WiStars />, color: "bg-pink-400", textCol: "text-pink-400" },
	sp_defense: { icon: <GiGlassBall />, color: "bg-violet-500", textCol: "text-violet-500" },
	total: { icon: <FaListAlt />, color: "bg-slate-700", textCol: "text-slate-700" },
};

function PokemonEntry({ pokemon_id, name, stats, className: PClassName }) {
	const { user } = useAuthContext();

	const handleBuy = async () => {
		try {
			const formData = {
				ownedPokemonId: pokemon_id,
				nickname: name,
			};
			const req = await axios.post(`/owned-pokemons/${user.id}`, formData);
			const data = req.data;
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Link
			to={`/pokemonsdets/${pokemon_id}`}
			className={`flex flex-col w-64 gap-2 p-6 items-center rounded-lg bg-white text-black ${PClassName}`}
		>
			<div className="flex pl-3 w-full text-center">
				<span>{pokemon_id}</span>
				<span className="mx-auto">{name}</span>
			</div>
			<img
				src={`${axios.getUri()}pokemons/${pokemon_id}/image`}
				loading="lazy"
				alt=""
				className="w-2/3 my-2 aspect-square mx-auto"
			/>

			<div className="w-full grid grid-cols-[fit-content(10%)_auto_fit-content(10%)] items-center gap-2 gap-y-1 text-xs">
				{Object.keys(stats).map((key) => (
					<>
						<span className={`${statToStyle[key].textCol}`}>{statToStyle[key].icon}</span>
						<div className={`mx-1 h-1 bg-opacity-20 ${statToStyle[key].color} rounded-full overflow-hidden`}>
							<div
								className={`w-full h-full ${statToStyle[key].color}`}
								style={{
									transformOrigin: "left",
									transform: `scaleX(${key === "total" ? stats[key] / 800 : stats[key] / 255})`,
								}}
							></div>
						</div>
						<span className={`text-right font-semibold`}>{stats[key]}</span>
					</>
				))}
			</div>
		</Link>
	);
}

export default PokemonEntry;
