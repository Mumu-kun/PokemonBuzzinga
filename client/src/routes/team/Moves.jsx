import React from "react";

const typeToStyle = {
	1: { bgColor: "bg-gray-400", textColor: "text-gray-900" },
	2: { bgColor: "bg-red-500", textColor: "text-white" },
	3: { bgColor: "bg-blue-500", textColor: "text-white" },
	4: { bgColor: "bg-yellow-400", textColor: "text-gray-900" },
	5: { bgColor: "bg-green-500", textColor: "text-white" },
	6: { bgColor: "bg-blue-200", textColor: "text-gray-900" },
	7: { bgColor: "bg-red-700", textColor: "text-white" },
	8: { bgColor: "bg-purple-500", textColor: "text-white" },
	9: { bgColor: "bg-yellow-700", textColor: "text-white" },
	10: { bgColor: "bg-indigo-400", textColor: "text-white" },
	11: { bgColor: "bg-pink-400", textColor: "text-white" },
	12: { bgColor: "bg-green-700", textColor: "text-white" },
	13: { bgColor: "bg-gray-600", textColor: "text-white" },
	14: { bgColor: "bg-purple-700", textColor: "text-white" },
	15: { bgColor: "bg-indigo-700", textColor: "text-white" },
	16: { bgColor: "bg-gray-800", textColor: "text-white" },
	17: { bgColor: "bg-gray-400", textColor: "text-gray-900" },
	18: { bgColor: "bg-pink-200", textColor: "text-gray-900" },
};

const Moves = ({ moves, setMove }) => {
	if (!moves) {
		return null;
	}

	console.log(moves);

	return (
		<div div className="overflow-hidden rounded-md">
			<div className="flex items-center justify-between gap-2 bg-slate-800 p-2 px-4 pr-3">
				<span className="w-44 px-4 py-2 text-center">Name</span>
				<span className={`w-28 px-4 py-2 text-center`}>Type</span>
				<span className="w-28 px-4 py-2 text-center">Category</span>
				<span className="w-16 px-4 py-2 text-center">Power</span>
				<span className="w-24 px-4 py-2 text-center">Accuracy</span>
			</div>
			<div className="scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-700 max-h-96 w-full overflow-y-scroll bg-slate-600">
				{moves.map((move) => (
					<div
						key={move.move_id}
						onClick={() => {
							setMove(move.move_id);
						}}
						className="flex cursor-pointer items-center justify-between gap-2 px-4 py-0 hover:bg-slate-700"
					>
						<span className="w-44  px-4 py-4">{move.move_name}</span>
						<span className="flex w-28 flex-col justify-center self-stretch  pr-3">
							<div
								className={`w-full rounded-md px-4 py-2 text-center ${typeToStyle[move.type_id].bgColor} ${typeToStyle[move.type_id].textColor}`}
							>
								{move.type_name}
							</div>
						</span>
						<span className="w-28 border-r-2 border-slate-800 px-4 py-4 text-center">{move.category}</span>
						<span className="w-16 border-r-2 border-slate-800 px-4 py-4 text-right">
							{move.power ? move.power : "-"}
						</span>
						<span className="w-16 border-slate-800 px-4 py-4 text-right">{move.accuracy}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default Moves;
