import React, { useState, useEffect } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import axios from "../../utils/AxiosSetup";
import { Link, useNavigate } from "react-router-dom";
import MessagePopup from "../../components/MessagePopup";
import TeamCard from "../my-teams/TeamCard";

import "./QueuePage.css";

function BattlePage() {
	const [challengers, setChallengers] = useState([]);
	const [trainersInQueue, setTrainersInQueue] = useState([]);
	const [isInQueue, setIsInQueue] = useState(false);
	const [msg, setMsg] = useState(null);
	const [bmsg, setbMsg] = useState(null);
	const [battleTeam, setBattleTeam] = useState(null);
	const { user } = useAuthContext();
	const navigate = useNavigate();

	useEffect(() => {
		fetchChallengers();
		fetchQueueState();
		fetchBattleTeam();
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
			setTrainersInQueue(response.data.filter((trainerId) => trainerId !== user.id));
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

	const handleSendBattle = async (trainerId) => {
		try {
			await axios.post(`/send_battle`, { challenger_id: user.id, trainer_id: trainerId });
			fetchTrainersInQueue();
			setbMsg("Battle Requested");
		} catch (error) {
			console.error("Failed to send battle request", error);
		}
	};

	const handleAcceptBattle = async (challengerId) => {
		try {
			const response = await axios.put(`/accept_battle`, { challenger_id: challengerId, defender_id: user.id });
			const data = response.data;
			// console.log(data);
			navigate(`/battle/${data}`);
		} catch (error) {
			console.error("Failed to accept battle request", error);
		}
	};

	return (
		<div className="battle-page bg-slate-700">
			{!!msg && <MessagePopup message={msg} setMessage={setMsg} />}
			{!!bmsg && <MessagePopup message={bmsg} setMessage={setbMsg} />}
			<div className="title-background">
				<h1 className="title-text">Queue</h1>
			</div>

			<div className="challengers-container">
				{isInQueue && (
					<>
						<h2 className="text-h3 mb-4 text-white">Challengers</h2>
						<ul>
							{challengers.map((challenger) => (
								<li key={challenger.id}>
									<Link
										to={`/profile/${challenger.id}`}
										className="mr-2 rounded-md bg-slate-300 p-1 px-4 transition-all hover:bg-slate-400"
									>
										{challenger.name}
									</Link>
									<button className="accept-button" onClick={() => handleAcceptBattle(challenger.id)}>
										Accept Battle Request
									</button>
								</li>
							))}
						</ul>
					</>
				)}
			</div>

			<div className="trainers-container">
				{isInQueue && (
					<>
						<h2 className="text-h3 mb-4 text-white">Trainers in Queue</h2>
						<ul>
							{trainersInQueue.map(
								(trainer) =>
									trainer.id !== user.id && (
										<li key={trainer.id}>
											<Link
												to={`/profile/${trainer.id}`}
												className="mr-2 rounded-md bg-slate-300 p-1 px-4 transition-all hover:bg-slate-400"
											>
												{trainer.name}
											</Link>{" "}
											:{" "}
											<button className="send-button" onClick={() => handleSendBattle(trainer.id)}>
												Send Battle Request
											</button>
										</li>
									)
							)}
						</ul>
					</>
				)}
				<div className="request-info">
					<p className="margin-20px text-sm text-gray-500">
						You need to check battles page for previously requested battles
					</p>
				</div>
			</div>
			<button className={`${isInQueue ? "leave-queue-button" : "join-queue-button"} mt-64`} onClick={toggibattle}>
				{isInQueue ? "Leave Queue" : "Join Queue"}
			</button>
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
		</div>
	);
}

export default BattlePage;
