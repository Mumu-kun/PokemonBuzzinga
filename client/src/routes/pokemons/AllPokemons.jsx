
import axios from "../../utils/AxiosSetup";
import React, { useEffect, useState } from "react";
import PokemonEntry from "./PokemonEntry";
import { Link, useNavigate } from "react-router-dom";

function AllPokemons() {
  const [pokemons, setPokemons] = useState([]);
  const navigate = useNavigate(); 

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

  const dekhNature = () => {
    navigate("/naturing");
  };

  return (
    <>
      <h1 className="text-h1">All Pokemons</h1>
      <button className="teal-button" onClick={dekhNature}>View Natures</button>
      <div className="flex flex-wrap justify-center gap-4 mt-10">
        {!!pokemons &&
          pokemons.map((pokemonData) => (
            <Link key={pokemonData.pokemon_id} to={`/pokemonsdets/${pokemonData.pokemon_id}`}>
              <PokemonEntry {...pokemonData} buy={true} />
            </Link>
          ))}
      </div>
      <style>{`
      .teal-button {
        background-color: teal;
        color: white;
      }
      `}
      </style>
    </>
  );
}

export default AllPokemons;






