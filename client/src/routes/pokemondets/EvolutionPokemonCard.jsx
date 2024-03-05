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
	}, [pokemon_id]);

	const next_pokemons = ev_chain
		.filter((ev) => ev.evolve_from === pokemon_id && ev.evolve_to !== null)
		.map((ev) => ev.evolve_to);

	return (
		<div className="flex items-center">
			<div className="" ref={cardRef}>
				{!!pokemonData && (
					<Link
						to={`/pokemonsdets/${pokemon_id}`}
						className={`flex w-20 flex-col gap-1 rounded-lg bg-white p-2 text-xs font-semibold text-black shadow-md`}
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
			</div>

			{next_pokemons?.length > 0 && (
				<>
					<div className="ml-2 h-0 w-8 border-[1px] border-black"></div>
					<div
						className={`w-0.5 bg-black`}
						style={{
							height: `calc(2px + ${cardRef.current?.offsetHeight * (next_pokemons.length - 1)}px + ${
								next_pokemons.length - 1
							}*1rem)`,
						}}
					></div>
					<div className="flex flex-col items-start gap-4">
						{next_pokemons.map((pok) => (
							<div className="flex items-center">
								<div className="h-0 w-4 border-[1px] border-black"></div>
								<div className="mr-2 border-4 border-transparent border-l-black"></div>
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
