import React, { useEffect, useMemo, useState } from "react";
import axiosApi from "../../utils/AxiosSetup";
import { Link, useParams } from "react-router-dom";
import { RiSwordFill } from "react-icons/ri";
import Loading from "../../components/Loading";

const InfoList = ({ children }) => {
	return <div className="ml-4 grid grid-cols-[max-content_max-content_auto] gap-x-1 gap-y-4">{children}</div>;
};

const Info = ({ title, value }) => {
	return (
		<>
			<span className="pr-4">{title}</span>
			<span className="pr-8">:</span>
			<span>{value}</span>
		</>
	);
};

const roundToName = (round, maxLevel) => {
	switch (round) {
		case 1:
			return "Final";
		case 2:
			return "Semi-Final";
		case 3:
			return "Quarter-Final";

		default:
			return `Round ${maxLevel - round + 1}`;
	}
};

const BattleList = ({ round, maxLevel, battles }) => {
	return (
		<div>
			<p className="mb-2 font-bold">{roundToName(round, maxLevel)}</p>
			<div className="scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-400 max-h-[490px]  overflow-y-auto rounded-md pr-2">
				{battles.map((battle) => (
					<Link
						to={`/battle/${battle.battle_id}`}
						key={battle.battle_id}
						className="mb-2 block rounded-md bg-slate-300 p-6"
					>
						<div className="mb-2 font-semibold text-black">{new Date(battle.created_at).toLocaleString()}</div>
						<div className="flex items-center justify-between gap-4">
							<div
								className={`w-24 rounded-md bg-slate-50 p-4 text-black shadow-[0_0_5px_1px,inset_0_0_2px_1px]  ${battle.participant_1 === battle.winner ? "shadow-green-500" : "shadow-red-500"}`}
							>
								<p className=" mb-4 text-center font-bold">{battle.trainer_1_name}</p>
								<p className="text-center text-sm font-semibold">{battle.team_1}</p>
								<p className="text-center text-xs">{battle.team_1_total}</p>
							</div>
							<RiSwordFill className="text-2xl text-black" />
							<div
								className={`w-24 rounded-md bg-slate-50 p-4 text-black shadow-[0_0_5px_1px,inset_0_0_2px_1px]  ${battle.participant_2 === battle.winner ? "shadow-green-500" : "shadow-red-500"}`}
							>
								<p className="mb-4 text-center font-bold">{battle.trainer_2_name}</p>
								<p className="text-center text-sm font-semibold">{battle.team_2}</p>
								<p className="text-center text-xs">{battle.team_2_total}</p>
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

const TournamentSpecific = () => {
	const [tournament, setTournament] = useState(null);
	const { tournamentId } = useParams();

	const getTournament = async () => {
		try {
			const response = await axiosApi.get(`/tournament/${tournamentId}`);
			const data = response.data;

			console.log(data);

			setTournament(data);
		} catch (error) {
			console.error("Failed to fetch tournament", error);
		}
	};

	const [maxLevel, battleLevels] = useMemo(() => {
		if (!tournament) return [null, null];
		let maxL = Math.log2(tournament.max_participants);
		const result = [];
		for (const battle of tournament.battles) {
			const round = maxL - battle.level;

			if (!result[round]) {
				result[round] = Array();
			}

			result[round].push(battle);
		}
		console.log(result);
		return [maxL, result];
	}, [tournament]);

	useEffect(() => {
		getTournament();
	}, [tournamentId]);

	if (!tournament) {
		return <Loading />;
	}

	return (
		<>
			<h1 className="text-h1 mt-20">{tournament.tournament_name}</h1>
			<div className="rounded-md bg-slate-600 p-8 pl-10 pr-20 text-white shadow-md shadow-slate-400">
				<h3 className="text-h3 mb-6">Tournament Info</h3>
				<InfoList>
					<Info
						title="Organized By"
						value={
							<Link
								to={`/profile/${tournament.organizer}`}
								className="rounded-md bg-slate-800 px-4 py-[6px] text-white"
							>
								{tournament.organizer_name}
							</Link>
						}
					/>
					<Info title="Reward" value={`${tournament.reward}$`} />
					<Info title="Started At" value={new Date(tournament.start_time).toLocaleString()} />
					<Info title="Max Participants" value={tournament.max_participants} />
					<Info title="Enlisted" value={tournament.teams.length} />
					{tournament.winner ? (
						<Info
							title="Winner"
							value={
								<Link to={`/profile/${tournament.winner}`} className="rounded-md bg-slate-800 px-4 py-[6px] text-white">
									{tournament.winner_name}
								</Link>
							}
						/>
					) : (
						<Info title="Concluded" value={tournament.has_concluded ? "Yes" : "No"} />
					)}
				</InfoList>
			</div>
			<div className="mt-10 w-1/2 min-w-96">
				<h3 className="text-h3 mb-4">Participants</h3>
				<div className="grid grid-cols-3 gap-x-1 gap-y-3">
					<div className="bg-slate-400 py-1 text-center">Trainer</div>
					<div className="bg-slate-400 py-1 text-center">Team</div>
					<div className="bg-slate-400 py-1 text-center">Team Power</div>
					{tournament.teams.map((team) => (
						<>
							<Link to={`/profile/${team.trainer_id}`} key={team.trainer_id} className="rounded-md  text-center ">
								<span className="rounded-md bg-slate-800 px-4 py-[5px] text-white">{team.trainer_name}</span>
							</Link>
							<div className="text-center">{team.team_name}</div>
							<div className="pr-10 text-right">{team.team_total}</div>
						</>
					))}
				</div>
			</div>

			{!!tournament.has_concluded && (
				<div className="mt-20 w-1/2 min-w-96">
					<h3 className="text-h3 mb-4">Battles</h3>
					{battleLevels.map((battles, index) => (
						<BattleList key={index} maxLevel={maxLevel} round={maxLevel - index} battles={battles} />
					))}
				</div>
			)}
		</>
	);
};

export default TournamentSpecific;
