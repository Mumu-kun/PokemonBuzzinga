import React from "react";
import EvolutionPokemonCard from "./EvolutionPokemonCard";

const EvolutionChain = ({ ev_chain }) => {
	if (!ev_chain || ev_chain.length === 0) {
		return null;
	}

	const currPok = ev_chain[0].evolve_from;

	return (
		<div className="w-full">
			<div className="text-lg font-bold mb-2">Evolution Chain :</div>
			<div className="w-full flex justify-center items-center">
				<EvolutionPokemonCard ev_chain={ev_chain} pokemon_id={currPok} />
			</div>
		</div>
	);
};

export default EvolutionChain;
