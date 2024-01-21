import axios from "../../utils/AxiosSetup";
import React, { useEffect, useMemo, useState } from "react";
import PokemonEntry from "./PokemonEntry";
import useAuthContext from "../../hooks/useAuthContext";

function MyPokemons() {
	const { user } = useAuthContext();
	const [myPokemons, setMyPokemons] = useState([]);

	const getMyPokemons = async () => {
		try {
			const req = await axios.get(`/owned-pokemons/${user.id}`);
			const data = req.data;

			const pokemonList = [];

			for (const myPokemon of data) {
				const reqPokemonData = await axios.get(`/pokemons/${myPokemon.pokemon_id}`);
				const pokemonData = reqPokemonData.data;
				pokemonList.push({
					...myPokemon,
					pokemonData: { ...pokemonData },
				});
			}

			pokemonList.sort((a, b) => {
				return a.id - b.id;
			});

			setMyPokemons(pokemonList);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getMyPokemons();
	}, []);

	return (
		<>
			<p className="my-10">List Of My Pokemons</p>
			<div className="flex flex-wrap justify-center gap-4">
				{!!myPokemons &&
					myPokemons.map((myPokemon) => {
						const { id, nickname, team_id, pokemonData } = myPokemon;
						return (
							<div className="flex flex-col bg-slate-800 rounded-lg" key={id}>
								<div className="text-center p-2 border-b-2 border-slate-500" style={{ wordSpacing: `0.5rem` }}>
									Nickname : {nickname}
								</div>
								<PokemonEntry {...pokemonData} />
							</div>
						);
					})}
			</div>
		</>
	);
}

export default MyPokemons;
