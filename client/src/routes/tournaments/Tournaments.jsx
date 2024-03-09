import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../utils/AxiosSetup";
import useAuthContext from "../../hooks/useAuthContext";
import TeamCard from "../my-teams/TeamCard";
import "./Tournaments.css";

const Tournaments = () => {
	const [allTournaments, setAllTournaments] = useState([]);
	const [joinedTournaments, setJoinedTournaments] = useState([]);
	const [battleTeam, setBattleTeam] = useState(null);
	const { user } = useAuthContext();
	const navigate = useNavigate();

	useEffect(() => {
		getAllTournaments();
		getJoinedTournaments();
		fetchBattleTeam();
	}, []);

	const getAllTournaments = async () => {
		try {
			const req = await axios.get("/tournaments");
			const data = req.data;
			setAllTournaments(data);
		} catch (error) {
			console.error(error);
		}
	};

	const getJoinedTournaments = async () => {
		try {
			const req = await axios.get(`/joined_tournaments/${user.id}`);
			const data = req.data;
			console.log(data);
			setJoinedTournaments(data);
		} catch (error) {
			console.error("Failed to fetch joined tournaments:", error);
		}
	};

	const handleJoinTournament = async (tournamentId) => {
		try {
			const formData = {
				tournament_id: tournamentId,
				trainer_id: user.id,
			};
			const response = await axios.post("/join_tournament", formData);
			console.log("Join tournament with ID:", tournamentId);
			getJoinedTournaments();
		} catch (error) {
			console.error("Failed to join tournament:", error);
		}
	};
	const fetchBattleTeam = async () => {
		try {
			const response = await axios.get(`/trainer/${user.id}`);
			const data = response.data;

			if (data.team_id) {
				setBattleTeam({
					team_id: data.team_id,
					trainer_id: data.trainer_id,
					team_name: data.team_name,
				});
			} else {
				setBattleTeam(null);
			}
		} catch (error) {
			console.error("Failed to fetch battle team", error);
		}
	};

	const handleSelectBattleTeam = async (teamId) => {
		try {
			await axios.put(`/trainer/${user.id}/battle-team`, { team_id: teamId });
			fetchBattleTeam();
		} catch (error) {
			console.error("Failed to select battle team", error);
		}
	};

	const handleDeselectBattleTeam = async () => {
		try {
			await axios.put(`/trainer/${user.id}/battle-team`, { team_id: null });
			fetchBattleTeam();
		} catch (error) {
			console.error("Failed to deselect battle team", error);
		}
	};

	const isTournamentJoined = (tournamentId) => {
		return joinedTournaments.some((tournament) => tournament.tournament_id === tournamentId);
	};

	return (
		<>
			<div className="tournaments-container rounded-md bg-slate-700">
				<div className="left-section mb-4 w-full">
					<h1 className="text-h3 mb-2 text-white">Latest Tournaments</h1>
					{!!allTournaments.length && (
						<ul>
							{allTournaments.map(
								(tournament) =>
									!tournament.has_concluded && (
										<li key={tournament.tournament_id} className="tournament-item">
											<span className="tournament-name flex items-center">
												<span className="mr-2 inline-block w-36 truncate">{tournament.tournament_name}</span>
												<span className="mr-6 inline-block w-36">reward: {tournament.reward}$</span>
												<span className="inline-block w-32">
													{tournament.present}/{tournament.max_participants}
												</span>
											</span>
											{isTournamentJoined(tournament.tournament_id) ? (
												<span className="joined">Joined</span>
											) : (
												<button onClick={() => handleJoinTournament(tournament.tournament_id)} className="join-btn">
													Join
												</button>
											)}
											<Link
												to={`/tournaments/${tournament.tournament_id}`}
												className="join-btn bg-blue-500 hover:bg-blue-600"
											>
												View
											</Link>
										</li>
									)
							)}
						</ul>
					)}
				</div>
				<div className="left-section w-full">
					<h1 className="text-h3 mb-2 text-white">Concluded Tournaments</h1>
					{!!allTournaments.length && (
						<ul>
							{allTournaments.map(
								(tournament) =>
									!!tournament.has_concluded && (
										<li key={tournament.tournament_id} className="tournament-item">
											<span className="tournament-name flex items-center">
												<span className="mr-2 inline-block w-36 truncate">{tournament.tournament_name}</span>
												<span className="mr-6 inline-block w-36">reward: {tournament.reward}$</span>
												<span className="inline-block w-32">
													{tournament.present}/{tournament.max_participants}
												</span>
											</span>
											<Link
												to={`/tournaments/${tournament.tournament_id}`}
												className="join-btn bg-blue-500 hover:bg-blue-600"
											>
												View
											</Link>
										</li>
									)
							)}
						</ul>
					)}
				</div>
				<div className="right-section">
					<Link to="/tournaments/create" className="btn create-tournament-btn">
						Create A Tournament
					</Link>
				</div>
			</div>
			<div className="battle-team-container">
				{battleTeam ? (
					<>
						<TeamCard {...battleTeam} />
						<button className="deselect-button" onClick={handleDeselectBattleTeam}>
							Deselect Battle Team
						</button>
					</>
				) : (
					<>
						<p>No Battle Team</p>
						<button className="select-button" onClick={() => navigate("/my-teams")}>
							Select Battle Team
						</button>
					</>
				)}
			</div>
		</>
	);
};

export default Tournaments;
