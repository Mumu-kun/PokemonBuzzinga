import React, { useState, useEffect } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import axios from "../../utils/AxiosSetup";
import { useNavigate } from "react-router-dom";
import MessagePopup from "../../components/MessagePopup";
import "./BattlePage.css"; 

function BattlePage() {
  const [challengers, setChallengers] = useState([]);
  const [trainersInQueue, setTrainersInQueue] = useState([]);
  const [isInQueue, setIsInQueue] = useState(false); 
  const [msg, setMsg] = useState(null);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    fetchChallengers();
    fetchQueueState();
	console.log(challengers);
  }, []);

  const fetchChallengers = async () => {
    try {
      const response = await axios.get(`/challengers/${user.id}`);
      setChallengers(response.data);
	  
    } catch (error) {
      console.error("Failed to fetch challengers", error);
    }
  };

  const fetchQueueState = async () => {
    try {
      const response = await axios.get(`/state/${user.id}`);
      setIsInQueue(response.data);
      if (response.data) {
        fetchTrainersInQueue();
      }
    } catch (error) {
      console.error("Failed to fetch queue state", error);
    }
  };

  const fetchTrainersInQueue = async () => {
    try {
      const response = await axios.get(`/trainers_line`);
      setTrainersInQueue(response.data.filter(trainerId => trainerId !== user.id));
    } catch (error) {
      console.error("Failed to fetch trainers in queue", error);
    }
  };

  const toggibattle = async () => {
    try {
      const updatedQueueState = !isInQueue;
      await axios.put(updatedQueueState ? `/battle_yes/${user.id}` : `/battle_no/${user.id}`);
      setIsInQueue(updatedQueueState);
      if (updatedQueueState) {
        fetchTrainersInQueue();
      } else {
        setTrainersInQueue([]);
      }
    } catch (error) {
      console.error("Failed to toggle queue status", error);
      if (error?.response?.status === 409) {
        setMsg(error.response.data.message);
      }
    }
  };

  const handleSendBattle = async (trainerId) => {
    try {
      await axios.post(`/send_battle`, { challenger_id: user.id, trainer_id: trainerId });
      fetchTrainersInQueue();
    } catch (error) {
      console.error("Failed to send battle request", error);
    }
  };

  const handleAcceptBattle = async (challengerId) => {
    try {
      const response = await axios.put(`/accept_battle`, { challenger_id: challengerId, defender_id: user.id });
      const bat_id = response.data;
      console.log(bat_id);
      navigate(`/battle/${bat_id}`);
      //console.log(response.data);
    } catch (error) {
      console.error("Failed to accept battle request", error);
    }
  };

  return (
    <div className="battle-page">
      {!!msg && <MessagePopup message={msg} setMessage={setMsg} />}
      <div className="title-background">
        <h1 className="title-text">Battle Page</h1>
      </div>
	  <div className="challengers-container">
  {isInQueue && (
    <>
      <h2>Challengers</h2>
      <ul>
	  {challengers.map((challenger) => (
  <li key={challenger.id}>
    {challenger.name}
    <button className="accept-button" onClick={() => handleAcceptBattle(challenger.id)}>Accept Battle Request</button>
  </li>
))}
      </ul>
    </>
  )}
</div>

      <div className="trainers-container">
        {isInQueue && (
          <>
            <h2>Trainers in Queue</h2>
            <ul>
              {trainersInQueue.map((trainer) => (
                <li key={trainer.id}>
                  {trainer.name} : <button className="send-button" onClick={() => handleSendBattle(trainer.id)}>Send Battle Request</button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <button className={isInQueue ? "leave-queue-button" : "join-queue-button"} onClick={toggibattle}>{isInQueue ? "Leave Queue" : "Join Queue"}</button>
    </div>
  );
}

export default BattlePage;
