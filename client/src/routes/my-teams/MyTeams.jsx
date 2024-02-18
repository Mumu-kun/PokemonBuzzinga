import React, { useEffect, useState } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import axiosApi from "../../utils/AxiosSetup";
import TeamCard from "./TeamCard";

function MyTeams() {
	const { user } = useAuthContext();
	const [teams, setTeams] = useState([]);

	const getTeams = async () => {
		try {
			const req = await axiosApi.get(`/teams/${user.id}`);
			const data = req.data;

			setTeams(data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleAddTeam = async (e) => {
		e.preventDefault();

		const formData = {
			trainerId: user.id,
			teamName: e.target.teamName.value,
		};

		e.target.teamName.value = "";

		try {
			const req = await axiosApi.post(`/teams/${user.id}`, formData);
			const data = req.data;
			console.log(data);

			getTeams();
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getTeams();
	}, []);

	return (
		<>
			<h1 className="text-h1">My Teams</h1>
			<form className="flex flex-wrap justify-center mb-16" onSubmit={handleAddTeam}>
				<input className="input m-2" type="text" name="teamName" placeholder="Team Name" />
				<button className="btn m-2">Add Team</button>
			</form>

			<div className="flex flex-wrap justify-center gap-4">
				{teams.map((teamInfo) => (
					<TeamCard key={teamInfo.team_id} {...teamInfo} refreshTeams={getTeams} />
				))}
			</div>
		</>
	);
}

export default MyTeams;
