import React, { useState, useEffect } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import axios from "../../utils/AxiosSetup";
import MessagePopup from "../../components/MessagePopup";

function QueuePage() {
	const [challengers, setChallengers] = useState([]);
	const [trainersInQueue, setTrainersInQueue] = useState([]);
	const [isInQueue, setIsInQueue] = useState(false); // Track the in_queue status
	const [msg, setMsg] = useState(null);
	const { user } = useAuthContext();

	useEffect(() => {
		fetchChallengers();
		fetchTrainersInQueue();
		fetchQueueState();
	}, []);

	const fetchChallengers = async () => {
		try {
			const response = await axios.get(`/challengers/${user.id}`);
			setChallengers(response.data);
		} catch (error) {
			console.error("Failed to fetch challengers", error);
		}
	};

	const fetchTrainersInQueue = async () => {
		try {
			const response = await axios.get(`/trainers_line`);
			setTrainersInQueue(response.data);
		} catch (error) {
			console.error("Failed to fetch trainers in queue", error);
		}
	};

	const fetchQueueState = async () => {
		try {
			const response = await axios.get(`/state/${user.id}`);
			setIsInQueue(response.data);
		} catch (error) {
			console.error("Failed to fetch queue state", error);
		}
	};

	const toggibattle = async () => {
		try {
			if (isInQueue) {
				await axios.put(`/battle_no/${user.id}`);
			} else {
				await axios.put(`/battle_yes/${user.id}`);
			}
			setIsInQueue(!isInQueue);
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
			console.log(response.data);
		} catch (error) {
			console.error("Failed to accept battle request", error);
		}
	};

	return (
		<div>
			{!!msg && <MessagePopup message={msg} setMessage={setMsg} />}
			<h1>Battle Page</h1>
			<h2>Challengers:</h2>
			<ul>
				{challengers.map((challengerId) => (
					<li key={challengerId}>
						{challengerId}
						<button onClick={() => handleAcceptBattle(challengerId)}>Accept Battle Request</button>
					</li>
				))}
			</ul>
			<h2>Trainers in Queue:</h2>
			<ul>
				{trainersInQueue.map((trainerId) => (
					<li key={trainerId}>
						{trainerId} : <button onClick={() => handleSendBattle(trainerId)}>Send Battle Request</button>
					</li>
				))}
			</ul>
			<button onClick={toggibattle}>{isInQueue ? "Leave Queue" : "Join Queue"}</button>
		</div>
	);
}

export default QueuePage;
