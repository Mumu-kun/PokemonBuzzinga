import React, { useEffect, useState } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import axios from "../../utils/AxiosSetup";
import { useParams } from "react-router-dom";
import TeamCard from "../my-teams/TeamCard";

const InfoList = ({ children }) => {
	return <div className="ml-4 grid grid-cols-[max-content_max-content_auto] gap-x-1 gap-y-0.5">{children}</div>;
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

const Profile = () => {
	const { user } = useAuthContext();
	const { trainer_id } = useParams();

	const [profileData, setProfileData] = useState();

	const getProfileData = async () => {
		try {
			const req = await axios.get(`/trainer/${trainer_id}`);
			const data = await req.data;

			setProfileData(data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getProfileData();
	}, []);

	if (!profileData) {
		return null;
	}

	const battle_team = {
		team_id: profileData.team_id,
		trainer_id: profileData.trainer_id,
		team_name: profileData.team_name,
	};

	return (
		<>
			<div className="min-w-[800px] mt-8">
				<h1 className="text-h1 mb-20">Profile</h1>
				<div className="grid grid-cols-2 gap-20">
					<div className="mb-10">
						<h3 className="text-h3 mb-6">Trainer Info</h3>
						<InfoList>
							<Info title="Name" value={profileData.name} />
							<Info title="Region" value={profileData.region_name} />
							<Info title="Balance" value={profileData.balance} />
							<Info title="Pokemons Collected" value={profileData.pokemon_count} />
							<Info title="Teams Created" value={profileData.team_count} />
						</InfoList>
					</div>
					<div>
						<h3 className="text-h3 mb-6">Statistics</h3>
						<InfoList>
							<Info title="Battles Fought" value={profileData.battle_count} />
							<Info title="Battles Won" value={profileData.battle_win_count} />
							<Info title="Tournaments Played" value={profileData.tournament_count} />
							<Info title="Tournaments Won" value={profileData.tournament_win_count} />
						</InfoList>
					</div>
					<div className="">
						<h3 className="text-h3 mb-6">Battle Team</h3>
						<div className="ml-4">
							<TeamCard {...battle_team} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Profile;
