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

function PokemonEntry({
	pokemon_id,
	name,
	stats,
	price,
	showPrice = false,
	className: PClassName,
	linkDisable = false,
}) {
	return (
		<Link
			to={`/pokemonsdets/${pokemon_id}`}
			className={`flex w-64 flex-col items-center gap-2 rounded-lg bg-white p-6 pb-4 text-black shadow-md shadow-slate-200 ${PClassName} ${
				linkDisable && `pointer-events-none`
			}`}
		>
			<div className="flex w-full pl-3 text-center">
				<span>{pokemon_id}</span>
				<span className="mx-auto">{name}</span>
			</div>
			<img
				src={`${axios.getUri()}pokemons/${pokemon_id}/image`}
				loading="lazy"
				alt=""
				className="mx-auto my-2 aspect-square w-2/3"
			/>

			<div className="grid w-full grid-cols-[fit-content(10%)_auto_fit-content(10%)] items-center gap-2 gap-y-1 text-xs">
				{Object.keys(stats).map((key) => (
					<>
						<span className={`${statToStyle[key].textCol}`}>{statToStyle[key].icon}</span>
						<div className={`mx-1 h-1 bg-opacity-20 ${statToStyle[key].color} overflow-hidden rounded-full`}>
							<div
								className={`h-full w-full ${statToStyle[key].color}`}
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
			{!!showPrice && <div className="text-md font-semibold text-green-600">{price}$</div>}
		</Link>
	);
}

export default PokemonEntry;
