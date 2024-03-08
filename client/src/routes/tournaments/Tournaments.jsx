import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../utils/AxiosSetup";
import useAuthContext from "../../hooks/useAuthContext";
import "./Tournaments.css";

const Tournaments = () => {
  const [allTournaments, setAllTournaments] = useState([]);
  const [joinedTournaments, setJoinedTournaments] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    getAllTournaments();
    getJoinedTournaments();
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

  return (
    <div className="tournaments-container rounded-md bg-slate-700">
      <div className="left-section">
        <h1 className="text-h1 text-white">Latest Tournaments</h1>
        {!!allTournaments.length && (
          <ul>
            {allTournaments.map(
              (tournament) =>
                !tournament.has_concluded && (
									<li key={tournament.tournament_id} className="tournament-item">
										<span className="tournament-name">
											{tournament.tournament_name}, reward:{tournament.reward}$ | {tournament.present}/
											{tournament.max_participants}
										</span>
										<button onClick={() => handleJoinTournament(tournament.tournament_id)} className="join-btn">
											Join
										</button>
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
			<div className="left-section">
				<h1 className="text-h1 text-white">Concluded Tournaments</h1>
				{!!allTournaments.length && (
					<ul>
						{allTournaments.map(
							(tournament) =>
								!!tournament.has_concluded && (
                  <li key={tournament.tournament_id} className="tournament-item">
                    <span className="tournament-name">{tournament.tournament_name}, reward: {tournament.reward}$</span>
                    {isTournamentJoined(tournament.tournament_id) ? (
                      <span className="joined">Joined</span>
                    ) : (
                      <button onClick={() => handleJoinTournament(tournament.tournament_id)} className="join-btn">Join</button>
										<Link
											to={`/tournaments/${tournament.tournament_id}`}
											className="join-btn bg-blue-500 hover:bg-blue-600"
										>
											View
										</Link>
                    )}
                  </li>
                )
            )}
          </ul>
        )}
      </div>
      <div className="right-section">
        <Link to="/tournaments/create" className="btn create-tournament-btn">Create A Tournament</Link>
      </div>
    </div>
  );
};

export default Tournaments;
