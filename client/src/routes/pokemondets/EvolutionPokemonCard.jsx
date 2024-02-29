import React, { useEffect, useRef, useState } from "react";
import axios from "../../utils/AxiosSetup";
import { Link } from "react-router-dom";

const EvolutionPokemonCard = ({ ev_chain, pokemon_id }) => {
	const [pokemonData, setPokemonData] = useState();
	const cardRef = useRef();

	const getPokemonData = async () => {
		try {
			const reqPokemonData = await axios.get(`/pokemons/${pokemon_id}`);
			const pokemonData = reqPokemonData.data;

			setPokemonData(pokemonData);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getPokemonData();
	}, []);

	const next_pokemons = ev_chain
		.filter((ev) => ev.evolve_from === pokemon_id && ev.evolve_to !== null)
		.map((ev) => ev.evolve_to);

	return (
		<div className="flex items-center">
			<div className="" ref={cardRef}>
				{!!pokemonData && (
					<Link
						to={`/pokemonsdets/${pokemon_id}`}
						className={`flex flex-col w-20 p-2 gap-1 shadow-md rounded-lg bg-white text-black font-semibold text-xs`}
					>
						<img
							src={`${axios.getUri()}pokemons/${pokemon_id}/image`}
							loading="lazy"
							alt=""
							className="aspect-square"
						/>
						<div className="text-center">{pokemonData.name}</div>
					</Link>
				)}
				{/* {!!pokemonData && <PokemonEntry {...pokemonData} className={`origin-top-left scale-50`} />} */}
			</div>

			{next_pokemons?.length > 0 && (
				<>
					<div className="w-8 h-0 border-[1px] border-black ml-2"></div>
					<div
						className={`w-0.5 bg-black`}
						style={{
							height: `calc(2px + ${cardRef.current?.offsetHeight * (next_pokemons.length - 1)}px + ${
								next_pokemons.length - 1
							}*1rem)`,
						}}
					></div>
					<div className="flex flex-col items-center gap-4">
						{next_pokemons.map((pok) => (
							<div className="flex items-center">
								<div className="w-4 h-0 border-[1px] border-black"></div>
								<div className="border-4 border-l-black border-transparent mr-2"></div>
								<EvolutionPokemonCard key={pok} ev_chain={ev_chain} pokemon_id={pok} />
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);
};

export default EvolutionPokemonCard;
