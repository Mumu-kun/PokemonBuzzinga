import React, { useEffect, useState } from "react";
import axios from "../../utils/AxiosSetup";
import { Link } from "react-router-dom";
import { RiSwordFill } from "react-icons/ri";

const Battles = () => {
	const [battles, setBattles] = useState([]);
	const getBattles = async () => {
		try {
			const res = await axios.get("/battles");
			const data = res.data;

			console.log(data);

			setBattles(data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getBattles();
	}, []);

	return (
		<>
			<h1 className="text-h1">Battles</h1>
			<div>
				<p className="mb-4 text-lg font-bold">Recent Battles</p>
				<div className="scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-700 h-[600px] overflow-y-scroll">
					{battles.length === 0 ? (
						<p>No battles yet</p>
					) : (
						battles.map((battle) => (
							<Link
								to={`/battle/${battle.battle_id}`}
								key={battle.battle_id}
								className="my-2 block rounded-md bg-slate-700 p-6"
							>
								<div className="flex items-center justify-between gap-4">
									<div
										className={`w-24 rounded-md bg-slate-50 p-4 text-black shadow-[0_0_5px_1px,inset_0_0_2px_1px]  ${battle.participant_1 === battle.winner ? "shadow-green-500" : "shadow-red-500"}`}
									>
										<p className=" mb-4 text-center font-bold">{battle.trainer_1_name}</p>
										<p className="text-center text-sm font-semibold">{battle.team_1}</p>
										<p className="text-center text-xs">{battle.team_1_total}</p>
									</div>
									<RiSwordFill className="text-2xl" />
									<div
										className={`w-24 rounded-md bg-slate-50 p-4 text-black shadow-[0_0_5px_1px,inset_0_0_2px_1px]  ${battle.participant_2 === battle.winner ? "shadow-green-500" : "shadow-red-500"}`}
									>
										<p className="mb-4 text-center font-bold">{battle.trainer_2_name}</p>
										<p className="text-center text-sm font-semibold">{battle.team_2}</p>
										<p className="text-center text-xs">{battle.team_2_total}</p>
									</div>
								</div>
							</Link>
						))
					)}
				</div>
			</div>
		</>
	);
};
export default Battles;
