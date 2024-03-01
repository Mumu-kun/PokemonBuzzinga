import React, { useState } from "react";
import MessagePopup from "../../components/MessagePopup";
import { Link } from "react-router-dom";
import axios from "../../utils/AxiosSetup";

const Tournaments = () => {
	// const [msg, setMsg] = useState(null);
	const [allTournaments, setAllTournaments] = useState([]);

	const getAllTournaments = async () => {
		try {
			const req = await axios.get("/tournaments");
			const data = req.data;

			setAllTournaments(data);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			{/* {!!msg && <MessagePopup message={msg} setMessage={setMsg} />} */}
			<h1 className="text-h1">Tournaments</h1>
			<Link to="/tournaments/create" className="btn">
				Create A Tournament
			</Link>
			{!!allTournaments.length && (
				<div className="w-full">
					<p>Latest Tournaments</p>
				</div>
			)}
		</>
	);
};

export default Tournaments;
