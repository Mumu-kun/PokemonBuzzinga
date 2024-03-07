import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../utils/AxiosSetup";
import useAuthContext from "../../hooks/useAuthContext";
import "./Tournaments.css";
import tourpic from "../../assets/tournament.jpg";

const Tournaments = () => {
  const [allTournaments, setAllTournaments] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    getAllTournaments();
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

  const handleJoinTournament = async (tournamentId) => {
    try {
      const formData = {
        tournament_id: tournamentId,
        trainer_id: user.id,
      };
      const response = await axios.post("/join_tournament", formData);
      console.log("Join tournament with ID:", tournamentId);
    } catch (error) {
      console.error("Failed to join tournament:", error);
    }
  };

  return (
    <div className="tournaments-container">
      <div className="left-section">
        <h1 className="text-h1">Latest Tournaments</h1>
        {!!allTournaments.length && (
          <ul>
            {allTournaments.map(
              (tournament) =>
                !tournament.has_concluded && (
                  <li key={tournament.tournament_id} className="tournament-item">
                    <span className="tournament-name">{tournament.tournament_name}, reward:{tournament.reward}$</span>
                    <button onClick={() => handleJoinTournament(tournament.tournament_id)} className="join-btn">Join</button>
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
