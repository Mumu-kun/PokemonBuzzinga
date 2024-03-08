import axios from "../../utils/AxiosSetup";
import { useCallback, useEffect, useMemo, useState } from "react";
import PokemonEntry from "./PokemonEntry";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";

const stats = ["hp", "attack", "defense", "speed", "sp_attack", "sp_defense", "total"];

function AllPokemons() {
	const [pokemons, setPokemons] = useState([]);
	const [limit, setLimit] = useState(20);
	const [offset, setOffset] = useState(0);
	const [sortField, setSortField] = useState("pokemon_id");
	const [sortOrder, setSortOrder] = useState("asc");
	const [filterText, setFilterText] = useState("");
	const [totalPages, setTotalPages] = useState(0);
	const [selectedRegion, setSelectedRegion] = useState(0);
	const [regions, setRegions] = useState([]);

	const navigate = useNavigate();

	const getAllPokemons = async () => {
		try {
			const req = await axios.get("/pokemons", {
				params: { limit: limit === 0 ? "all" : limit, offset, sortField, sortOrder, filterText, selectedRegion },
			});
			const data = req.data;

			setTotalPages(Math.ceil(data.count / (limit ? limit : data.count)));

			setPokemons(data.pokemonList);
		} catch (error) {
			console.error(error);
		}
	};

	const getRegions = async () => {
		try {
			const req = await axios.get("/regions");
			const data = req.data;

			setRegions(
				data.map((region) => {
					const { region_id, region_name } = region;
					return {
						region_id,
						region_name,
					};
				})
			);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getRegions();
	}, []);

	useEffect(() => {
		getAllPokemons();
	}, [limit, offset, sortField, sortOrder, selectedRegion]);

	useDebounce(
		() => {
			getAllPokemons();
		},
		[filterText],
		200
	);

	const PrevPageBtn = () => {
		return (
			<button
				className="btn mr-auto"
				onClick={() => {
					setOffset((prev) => (prev - limit < 0 ? 0 : prev - limit));
				}}
			>
				Prev
			</button>
		);
	};

	const NextPageBtn = () => {
		return (
			<button
				className="btn ml-auto"
				onClick={() => {
					setOffset((prev) => (prev + limit >= totalPages * limit ? prev : prev + limit));
				}}
			>
				Next
			</button>
		);
	};

	const dekhNature = () => {
		navigate("/naturing");
	};

	return (
		<>
			<h1 className="text-h1">All Pokemons</h1>
			<button className="teal-button" onClick={dekhNature}>
				View Natures
			</button>
			<div className="mb-4 flex w-full items-center justify-between gap-4 text-white">
				<PrevPageBtn />
				<input
					type="text"
					placeholder="Search Pokemons"
					value={filterText}
					onChange={(e) => {
						setOffset(0);
						setFilterText(e.target.value);
					}}
					className="w-60 rounded-md px-4 py-2 text-black focus:outline-none active:outline-none"
				/>

				<div className="rounded-md bg-slate-700 p-1">
					<label className="mx-1">Region :</label>
					<select
						value={selectedRegion}
						onChange={(e) => {
							setOffset(0);
							setSelectedRegion(parseInt(e.target.value));
						}}
						className="w-fit rounded-md px-2 py-1 text-black focus:outline-none active:outline-none"
					>
						<option value="0">All</option>
						{!!regions && regions.map((region) => <option value={region.region_id}>{region.region_name}</option>)}
					</select>
				</div>

				<div className="rounded-md bg-slate-700 p-1">
					<label className="mx-1">Sort :</label>
					<select
						value={sortField}
						onChange={(e) => {
							setOffset(0);
							setSortField(e.target.value);
						}}
						className="mr-1 w-fit rounded-md px-2 py-1 capitalize text-black focus:outline-none active:outline-none"
					>
						<option value="pokemon_id">ID</option>
						{stats.map((stat) => (
							<option value={stat}>{stat.replace("_", " ")}</option>
						))}
						<option value="price">Price</option>
					</select>
					<select
						value={sortOrder}
						onChange={(e) => {
							setOffset(0);
							setSortOrder(e.target.value);
						}}
						className="w-fit rounded-md px-2 py-1 capitalize text-black focus:outline-none active:outline-none"
					>
						<option value="asc">Asc</option>
						<option value="desc">Desc</option>
					</select>
				</div>
				<div className="rounded-md bg-slate-700 p-1">
					<label className="mx-1">Limit :</label>
					<select
						value={limit}
						onChange={(e) => {
							setOffset(0);
							setLimit(parseInt(e.target.value));
						}}
						className="w-fit rounded-md px-2 py-1 text-black focus:outline-none active:outline-none"
					>
						<option value="20">20</option>
						<option value="50">50</option>
						<option value="80">80</option>
						<option value="100">100</option>
						<option value="200">200</option>
						<option value="0">All</option>
					</select>
				</div>
				<NextPageBtn />
			</div>
			<div className="mb-4">
				Page {!(pokemons && pokemons.length > 0) ? "0" : offset / (limit ? limit : 1) + 1} of {totalPages}
			</div>
			<div className="mb-8 flex flex-wrap justify-center gap-4">
				{!!pokemons &&
					pokemons.map((pokemonData) => (
						<PokemonEntry
							{...pokemonData}
							key={pokemonData.pokemon_id}
							showPrice={true}
							className="transition-all hover:scale-105"
						/>
					))}
			</div>
			<div className="flex w-full justify-between">
				<PrevPageBtn />
				<div>
					Page {!(pokemons && pokemons.length > 0) ? "0" : offset / (limit ? limit : 1) + 1} of {totalPages}
				</div>
				<NextPageBtn />
			</div>{" "}
		</>
	);
}

export default AllPokemons;

function useDebounce(effect, dependencies, delay) {
	const callback = useCallback(effect, dependencies);

	useEffect(() => {
		const timeout = setTimeout(callback, delay);
		return () => clearTimeout(timeout);
	}, [callback, delay]);
}
