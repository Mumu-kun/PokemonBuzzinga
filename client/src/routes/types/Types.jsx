import React, { useEffect, useMemo, useState } from "react";
import axiosApi from "../../utils/AxiosSetup";

const typeToStyle = {
	Normal: { bgColor: "bg-gray-400", textColor: "text-gray-900" },
	Fire: { bgColor: "bg-red-500", textColor: "text-white" },
	Water: { bgColor: "bg-blue-500", textColor: "text-white" },
	Electric: { bgColor: "bg-yellow-400", textColor: "text-gray-900" },
	Grass: { bgColor: "bg-green-500", textColor: "text-white" },
	Ice: { bgColor: "bg-blue-200", textColor: "text-gray-900" },
	Fighting: { bgColor: "bg-red-700", textColor: "text-white" },
	Poison: { bgColor: "bg-purple-500", textColor: "text-white" },
	Ground: { bgColor: "bg-yellow-700", textColor: "text-white" },
	Flying: { bgColor: "bg-indigo-400", textColor: "text-white" },
	Psychic: { bgColor: "bg-pink-400", textColor: "text-white" },
	Bug: { bgColor: "bg-green-700", textColor: "text-white" },
	Rock: { bgColor: "bg-gray-600", textColor: "text-white" },
	Ghost: { bgColor: "bg-purple-700", textColor: "text-white" },
	Dragon: { bgColor: "bg-indigo-700", textColor: "text-white" },
	Dark: { bgColor: "bg-gray-800", textColor: "text-white" },
	Steel: { bgColor: "bg-gray-400", textColor: "text-gray-900" },
	Fairy: { bgColor: "bg-pink-200", textColor: "text-gray-900" },
};

const multToCol = {
	0: "bg-red-500",
	0.25: "bg-red-300",
	0.5: "bg-red-100",
	1: "bg-white",
	2: "bg-green-300",
};

const Types = () => {
	const [types, setTypes] = useState([]);
	const [typeMatchups, setTypeMatchups] = useState([]);

	const getTypes = async () => {
		try {
			const res = await axiosApi.get("/types");
			// console.log(res.data);
			setTypes(res.data);
		} catch (error) {
			console.error("Failed to fetch types:", error);
		}
	};

	const getTypeMatchups = async () => {
		try {
			const res = await axiosApi.get("/type-matchups");
			// console.log(res.data);
			setTypeMatchups(res.data);
		} catch (error) {
			console.error("Failed to fetch types:", error);
		}
	};

	const typeMatchupMatrix = useMemo(() => {
		const matrix = {};
		typeMatchups.forEach((matchup) => {
			if (!matrix[matchup.defender_type]) {
				matrix[matchup.defender_type] = {};
			}
			matrix[matchup.defender_type][matchup.attacker_type] = matchup.multiplier;
		});

		return matrix;
	}, [typeMatchups]);

	useEffect(() => {
		getTypes();
		getTypeMatchups();
	}, []);

	return (
		<>
			<h1 className="text-h1 mb-14 mt-20">Types</h1>
			{types.length > 0 && (
				<div className="mb-8 w-3/4">
					<h3 className="text-h3 mb-4">List of types in the game</h3>
					<div className="flex flex-wrap gap-2">
						{types.map((type) => (
							<div
								key={type.id}
								className={`m-2 w-24 rounded-md p-2 text-center ${typeToStyle[type.type_name].bgColor} ${typeToStyle[type.type_name].textColor}`}
							>
								{type.type_name}
							</div>
						))}
					</div>
				</div>
			)}
			{typeMatchups.length > 0 && (
				<div className="mb-8">
					<h3 className="text-h3 mb-4">Type Matchups</h3>
					<div className="mb-4 mt-4 grid grid-cols-[auto_repeat(19,minmax(0,1fr))] grid-rows-[repeat(20,minmax(0,1fr))]">
						<div className="col-[2_/_span_19] text-center">Attacker</div>
						<div className="col-span-1 row-span-full text-center [writing-mode:vertical-rl]">Defender</div>
						<div></div>
						{types.map((type) => (
							<div
								className={`p-1 text-center text-xs ${typeToStyle[type.type_name].bgColor} ${typeToStyle[type.type_name].textColor}`}
							>
								{type.type_name}
							</div>
						))}

						{types.map((defender) => {
							const defenderId = defender.type_id;
							const defenderType = defender.type_name;
							return (
								<>
									<div
										className={`p-1 text-center text-xs ${typeToStyle[defenderType].bgColor} ${typeToStyle[defenderType].textColor}`}
									>
										{defenderType}
									</div>
									{types.map((attacker) => {
										const attackerId = attacker.type_id;
										const attackerType = attacker.type_name;
										const multiplier = typeMatchupMatrix[defenderId][attackerId];
										return (
											<div className={`p-1 text-center text-xs ${multToCol[multiplier]} text-black`}>{multiplier}</div>
										);
									})}
								</>
							);
						})}
					</div>
					<div>
						Pokemons with multiple types will have the total multiplier as the product of the multipliers of each type
					</div>
				</div>
			)}
		</>
	);
};

export default Types;
