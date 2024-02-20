import axios from "../../utils/AxiosSetup";
import { useEffect, useMemo, useState } from "react";
import PokemonEntry from "./PokemonEntry";

const stats = ["hp", "attack", "defense", "speed", "sp_attack", "sp_defense", "total"];

function AllPokemons() {
	const [pokemons, setPokemons] = useState([]);
	const [limit, setLimit] = useState(20);
	const [offset, setOffset] = useState(0);
	const [sortField, setSortField] = useState("id");
	const [sortOrder, setSortOrder] = useState("asc");
	const [filterText, setFilterText] = useState("");

	const filteredPokemons = useMemo(() => {
		if (!pokemons) return [];

		let filtered = pokemons;

		if (sortField) {
			filtered = filtered.toSorted((a, b) => {
				if (sortOrder === "asc") {
					if (sortField === "pokemon_id") {
						return a[sortField] - b[sortField];
					}
					return a.stats[sortField] - b.stats[sortField];
				} else {
					if (sortField === "pokemon_id") {
						return b[sortField] - a[sortField];
					}
					return b.stats[sortField] - a.stats[sortField];
				}
			});
		}

		if (offset > 0) {
			filtered = filtered.slice(offset);
		}

		if (limit !== -1) {
			filtered = filtered.slice(0, limit);
		}

		if (filterText) {
			filtered = filtered.filter((pokemon) => {
				return (
					pokemon.name.toLowerCase().includes(filterText.toLowerCase()) ||
					pokemon.pokemon_id.toString().startsWith(filterText)
				);
			});
		}

		return filtered;
	}, [pokemons, limit, offset, filterText, sortField, sortOrder]);

	const getAllPokemons = async () => {
		try {
			const req = await axios.get("/pokemons");
			const data = req.data;

			setPokemons(data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getAllPokemons();
	}, []);

	const handlePokemonSearch = (e) => {
		setFilterText(e.target.value);
	};

	return (
		<>
			<h1 className="text-h1">All Pokemons</h1>
			<div className="flex w-full justify-between items-center mb-4 gap-4">
				<button
					className="btn mr-auto"
					onClick={() => {
						setOffset((prev) => (prev - limit < 0 ? 0 : prev - limit));
					}}
				>
					Prev
				</button>
				<input
					type="text"
					placeholder="Search Pokemons"
					value={filterText}
					onChange={(e) => {
						setOffset(0);
						setFilterText(e.target.value);
					}}
					className="text-black py-2 px-4 rounded-md w-60 active:outline-none focus:outline-none"
				/>
				<div className="bg-slate-700 p-1 rounded-md">
					<label className="mx-1">Limit :</label>
					<select
						value={limit}
						onChange={(e) => {
							setOffset(0);
							setLimit(parseInt(e.target.value));
						}}
						className="text-black py-1 px-2 w-fit rounded-md active:outline-none focus:outline-none"
					>
						<option value="20">20</option>
						<option value="50">50</option>
						<option value="80">80</option>
						<option value="100">100</option>
						<option value="200">200</option>
						<option value="-1">All</option>
					</select>
				</div>
				<div className="bg-slate-700 p-1 rounded-md">
					<label className="mx-1">Sort :</label>
					<select
						value={sortField}
						onChange={(e) => {
							setOffset(0);
							setSortField(e.target.value);
						}}
						className="text-black py-1 px-2 mr-1 w-fit rounded-md capitalize active:outline-none focus:outline-none"
					>
						<option value="pokemon_id">ID</option>
						{stats.map((stat) => (
							<option value={stat}>{stat.replace("_", " ")}</option>
						))}
					</select>
					<select
						value={sortOrder}
						onChange={(e) => {
							setOffset(0);
							setSortOrder(e.target.value);
						}}
						className="text-black py-1 px-2 w-fit rounded-md capitalize active:outline-none focus:outline-none"
					>
						<option value="asc">Asc</option>
						<option value="desc">Desc</option>
					</select>
				</div>
				<button
					className="btn ml-auto"
					onClick={() => {
						setOffset((prev) => (prev + limit > pokemons.length ? prev : prev + limit));
					}}
				>
					Next
				</button>
			</div>
			<div className="flex flex-wrap justify-center gap-4 mb-4">
				{!!filteredPokemons &&
					filteredPokemons.map((pokemonData) => (
						<PokemonEntry {...pokemonData} key={pokemonData.pokemon_id} buy={true} />
					))}
			</div>
			<div className="flex w-full justify-between">
				<button
					className="btn"
					onClick={() => {
						setOffset((prev) => (prev - limit < 0 ? 0 : prev - limit));
					}}
				>
					Prev
				</button>
				<button
					className="btn"
					onClick={() => {
						setOffset((prev) => prev + limit);
					}}
				>
					Next
				</button>
			</div>
		</>
	);
}

export default AllPokemons;
