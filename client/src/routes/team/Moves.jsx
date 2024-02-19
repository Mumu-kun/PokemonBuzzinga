import React from "react";

const Moves = ({ moves, setMove }) => {
	if (!moves) {
		return null;
	}

	return (
		<div className="w-full max-h-96 bg-slate-600 overflow-y-scroll rounded-md">
			{moves.map((move) => (
				<div
					key={move.move_id}
					onClick={() => {
						setMove(move.move_id);
					}}
					className="flex justify-between items-center p-2 px-4 hover:bg-slate-700 cursor-pointer"
				>
					<span>{move.move_name}</span>
					<span>{move.power}</span>
				</div>
			))}
		</div>
	);
};

export default Moves;
