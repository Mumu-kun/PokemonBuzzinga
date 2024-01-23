import axiosApi from "../../utils/AxiosSetup";
import React, { useEffect, useState } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import MyPokemonEntry from "./MyPokemonEntry";

function MyPokemons() {
	const { user } = useAuthContext();
	const [myPokemons, setMyPokemons] = useState([]);
	const [teams, setTeams] = useState([]);

	const getMyPokemons = async () => {
		try {
			const req = await axiosApi.get(`/owned-pokemons/${user.id}`);
			const data = req.data;

			const pokemonList = [];

			for (const myPokemon of data) {
				const reqPokemonData = await axiosApi.get(`/pokemons/${myPokemon.pokemon_id}`);
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

	const getTeams = async () => {
		try {
			const req = await axiosApi.get(`/teams/${user.id}`);
			const data = req.data;

			setTeams(data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getMyPokemons();
		getTeams();
	}, []);

	return (
		<>
			<h1 className="text-h1">My Pokemons</h1>
			<div className="flex flex-wrap justify-center gap-4">
				{myPokemons.map((myPokemon) => (
					<MyPokemonEntry key={myPokemon.id} {...myPokemon} teams={teams} getMyPokemons={getMyPokemons} />
				))}
			</div>
		</>
	);
}

export default MyPokemons;
