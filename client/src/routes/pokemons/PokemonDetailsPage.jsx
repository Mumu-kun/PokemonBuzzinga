// import axios from "../../utils/AxiosSetup";
// import React, { useEffect, useState } from "react";
// import './DetailsPage.css'; 

// const PokemonDetailsPage = ({ match }) => {
//   const [pokemonDetails, setPokemonDetails] = useState(null);
//   const { params: { id } } = match;

//   useEffect(() => {
//     const fetchPokemonDetails = async () => {
//       try {
//         const response = await axios.get("/pokemons-dets/${id}");
//         const data = response.data;
//         setPokemonDetails(data);
//       } catch (error) {
//         console.error('Failed to fetch Pokémon details', error);
//       }
//     };

//     fetchPokemonDetails();
//   }, [id]);

//   if (!pokemonDetails) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="pokemon-details-container">
//       <div className="pokemon-details-header">
//         <h1 className="pokemon-name">{pokemonDetails.name}</h1>
//         <img className="pokemon-image" src={`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokemonDetails.pokemon_id}.png`} alt={pokemonDetails.name} />
//       </div>
//       <div className="pokemon-details-content">
//         <div className="pokemon-details-section">
//           <h2 className="section-title">Base Stats</h2>
//           <ul className="stat-list">
//             <li className="stat-item">HP: {pokemonDetails.stats.hp}</li>
//             <li className="stat-item">Attack: {pokemonDetails.stats.attack}</li>
//             <li className="stat-item">Defense: {pokemonDetails.stats.defense}</li>
//             <li className="stat-item">Speed: {pokemonDetails.stats.speed}</li>
//             <li className="stat-item">Special Attack: {pokemonDetails.stats.sp_attack}</li>
//             <li className="stat-item">Special Defense: {pokemonDetails.stats.sp_defense}</li>
//           </ul>
//         </div>
//         <div className="pokemon-details-section">
//           <h2 className="section-title">Types</h2>
//           <div className="type-list">
//             <span className="type">{pokemonDetails.type1}</span>
//             {pokemonDetails.type2 && <span className="type">{pokemonDetails.type2}</span>}
//           </div>
//         </div>
//         <div className="pokemon-details-section">
//           <h2 className="section-title">Abilities</h2>
//           <ul className="ability-list">
//             {pokemonDetails.abilities.map((ability) => (
//               <li className="ability-item" key={ability.ability_id}>
//                 <span>{ability.ability}</span>
//                 <span className="ability-description">{ability.description}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="pokemon-details-section">
//           <h2 className="section-title">Moves</h2>
//           <ul className="move-list">
//             {pokemonDetails.moves.map((move) => (
//               <li className="move-item" key={move.move_id}>{move.name}</li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PokemonDetailsPage;

import axios from "../../utils/AxiosSetup";
import React, { useState, useEffect } from "react";

const PokemonDetailsPage = ({ match }) => {
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const { params: { id } } = match;

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await axios.get(`/api/pokemons-dets/${id}`); 
        const data = response.data;
        setPokemonDetails(data);
      } catch (error) {
        console.error('Failed to fetch Pokémon details', error);
      }
    };

    fetchPokemonDetails();
  }, [id]);

  if (!pokemonDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pokemon-details-container">
      <h1>Pokémon ID: {pokemonDetails.pokemon_id}</h1>
      <h2>Name: {pokemonDetails.name}</h2>

    </div>
  );
};

export default PokemonDetailsPage;
