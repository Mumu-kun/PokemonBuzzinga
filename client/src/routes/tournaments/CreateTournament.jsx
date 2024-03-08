import React, { useState } from "react";
import axios from "../../utils/AxiosSetup";
import useAuthContext from "../../hooks/useAuthContext";
import "./CreateTournament.css";

const CreateTournament = () => {
	const { user } = useAuthContext();
	const [formData, setFormData] = useState({
		tournament_name: "",
		max_participants: 2,
		reward: "",
		trainer_id: user.id,
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post("/tournaments", formData);
			console.log("Tournament created:", response.data);
		} catch (error) {
			console.error("Failed to create tournament:", error);
		}
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className="create-tournament-container">
			<h1 className="create-tournament-heading">Create Tournament</h1>
			<form onSubmit={handleSubmit} className="create-tournament-form">
				<label htmlFor="name" className="create-tournament-label">
					Tournament Name
				</label>
				<input
					type="text"
					name="tournament_name"
					id="name"
					value={formData.tournament_name}
					onChange={handleChange}
					className="create-tournament-input"
				/>
				<label htmlFor="max" className="create-tournament-label">
					Max Participants
				</label>
				<select
					name="max_participants"
					id="max"
					value={formData.max_participants}
					onChange={handleChange}
					className="create-tournament-select"
				>
					{[...Array(4).keys()].map((i) => (
						<option key={i} value={2 ** (i + 1)}>
							{2 ** (i + 1)}
						</option>
					))}
				</select>
				<label htmlFor="reward" className="create-tournament-label">
					Reward
				</label>
				<input
					type="text"
					name="reward"
					id="reward"
					value={formData.reward}
					onChange={handleChange}
					className="create-tournament-input"
				/>
				<button type="submit" className="create-tournament-submit-btn">
					Create Tournament
				</button>
			</form>
		</div>
	);
};

export default CreateTournament;
