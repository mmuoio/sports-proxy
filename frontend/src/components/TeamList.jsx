import React, { useState, useEffect } from "react";
import { getTeams } from "../api";
import TeamCard from "./TeamCard";

function TeamList() {
	const [teams, setTeams] = useState([]);

	useEffect(() => {
		const fetchTeams = async () => {
			try {
				const response = await getTeams();
				console.log(response);
				setTeams(response);
			} catch (err) {
				console.error("Failed to fetch teams", err);
			}
		};

		fetchTeams();
	}, []);

	return (
		<div className="p-6">
			<h2 className="text-3xl font-bold mb-6 text-gray-800">NFL Teams</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{teams.map((team) => (
					<TeamCard key={team.team.id} team={team} />
				))}
			</div>
		</div>
	);
}

export default TeamList;
