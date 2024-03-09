import React, { useState, useEffect } from "react";
import axios from "../../utils/AxiosSetup";

function NaturePage() {
	const [natures, setNatures] = useState([]);

	useEffect(() => {
		const fetchNatures = async () => {
			try {
				const response = await axios.get("/nature");
				setNatures(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchNatures();
	}, []);

	return (
		<div className="nature-page">
			<h1 className="title">Natures</h1>
			<div className="fancy-text">
				<p>
					Your Pokemon Can Have Different Natures. These Natures May Or May Not Effect You In Battles. What Nature Shall
					Your Fate Chose
				</p>
			</div>
			<h1 className="nature-page-title">The Natures and The Effects</h1>
			<table className="nature-table">
				<thead>
					<tr className="!text-white">
						<th>Nature</th>
						<th>Attack Multiplier</th>
						<th>Defense Multiplier</th>
						<th>Special Attack Multiplier</th>
						<th>Special Defense Multiplier</th>
						<th>Speed Multiplier</th>
					</tr>
				</thead>
				<tbody>
					{natures.map((nature) => (
						<tr key={nature.nature_id} className="nature-item">
							<td className="nature-name">{nature.nature_name}</td>
							<td className="numeric-value">{nature.attack_multiplyer}</td>
							<td className="numeric-value">{nature.defense_multiplyer}</td>
							<td className="numeric-value">{nature.sp_attack_multiplyer}</td>
							<td className="numeric-value">{nature.sp_defense_multiplyer}</td>
							<td className="numeric-value">{nature.speed_multiplyer}</td>
						</tr>
					))}
				</tbody>
			</table>
			<style>{`
                .nature-page {
                    margin: 25px;
                }

                .title{
                    font-size: 2.5rem;
                    margin-bottom: 8px;
                }

                .fancy-text {
                    font-family: 'Georgia', serif;
                    color: lightblue;
                    margin-bottom: 20px;
                    font-weight: bold;
                }

                .nature-page-title {
                    margin-bottom: 10px;
                }

                .nature-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .nature-table th, .nature-table td {
                    border: 1px solid #dddddd;
                    padding: 8px;
                    text-align: left;
                    color: black;
                }

                .nature-table th {
                    background-color: #333;
                }


                .nature-table tr:nth-child(even) {
                    background-color: #ddd;
                    color: white;
                }

                .nature-table tr:hover {
                    background-color: #555;
                }

                .nature-name {
                    font-weight: bold;
                }
            `}</style>
		</div>
	);
}

export default NaturePage;
