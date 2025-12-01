import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getTeamDetail } from "../api";

function TeamDetail() {
	const { teamId } = useParams();
	const [team, setTeam] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchDetail = async () => {
			try {
				console.log("test");
				const data = await getTeamDetail(teamId);
				console.log(data);
				setTeam(data); // Assuming the backend response structure has a 'body' key with the team details
				setLoading(false);
			} catch (err) {
				console.error("Failed to fetch team details", err);
				setError("Could not load team details.");
				setLoading(false);
			}
		};

		fetchDetail();
	}, [teamId]);

	if (loading) {
		return <div className="p-6 text-xl">Loading team data...</div>;
	}

	if (error) {
		return <div className="p-6 text-xl text-red-600">{error}</div>;
	}

	// Assuming the team detail data structure is similar to the list API for now
	const teamData = team.teaminfo;
	const teamColor = "#" + teamData.color;

	return (
		<div className="p-8 max-w-4xl mx-auto">
			{/* Back Link */}
			<Link to="/" className="text-blue-500 hover:text-blue-700 mb-6 block">
				&larr; Back to Teams List
			</Link>

			{/* Dashboard Header */}
			<div className="bg-white shadow-xl rounded-2xl p-6 mb-8 border-t-4" style={{ borderColor: teamColor }}>
				<div className="flex items-center space-x-6">
					<img src={teamData.logos[0].href} alt={teamData.displayName} className="w-24 h-24 object-contain" />
					<div>
						<h1 className="text-4xl font-extrabold text-gray-900" style={{ color: teamColor }}>
							{teamData.displayName}
						</h1>
						<p className="text-xl text-gray-500">{teamData.location}</p>
					</div>
				</div>
			</div>

			{/* Dashboard Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Example Stat Card 1 */}
				<div className="bg-white shadow-lg rounded-xl p-6">
					<h3 className="text-2xl font-bold mb-2 text-gray-800">Record</h3>
					{/* Placeholder for fetching and displaying wins/losses/etc. */}
					<p className="text-lg text-gray-600">Wins: N/A (To be implemented)</p>
					<p className="text-lg text-gray-600">Losses: N/A (To be implemented)</p>
				</div>

				{/* Example Stat Card 2 */}
				<div className="bg-white shadow-lg rounded-xl p-6">
					<h3 className="text-2xl font-bold mb-2 text-gray-800">Conference & Division</h3>
					{/* Placeholder for fetching and displaying division data using constants.py data */}
					<p className="text-lg text-gray-600">Conference: AFC/NFC</p>
					<p className="text-lg text-gray-600">Division: East/West/North/South</p>
				</div>

				{/* Add more dashboard sections here, like recent scores, roster, etc. */}
			</div>
		</div>
	);
}

export default TeamDetail;
