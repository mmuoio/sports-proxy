import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getTeamDetail } from "../api";

// Helper component for the white tiles
const StatCard = ({ title, value, unit }) => <div className="bg-white shadow-md rounded-lg p-5 border-l-4 border-indigo-500"></div>;

// Helper component for grouped stats (like W-L-T)
const RecordCard = ({ record }) => {
	// Assuming record is a flat dictionary like: {"wins": "4", "losses": "2", "ties": "0", "winPercent": ".667"}
	const winPercent = record.items[0].stats.winPercent.value || "N/A";
	const wins = record.items[0].stats.wins.value || "N/A";
	const losses = record.items[0].stats.losses.value || "N/A";
	const ties = record.items[0].stats.ties.value || "0";

	let recordStr = wins + "-" + losses;
	if (ties > 0) {
		recordStr += "-" + ties;
	}

	return (
		<div className="bg-white shadow-md rounded-lg p-5 border-l-4 border-green-600">
			<p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Overall Record</p>
			<div className="mt-2">
				<span className="text-3xl font-semibold text-gray-900">{recordStr}</span>
				<span className="text-base text-gray-500 ml-3">({winPercent} PCT)</span>
			</div>
		</div>
	);
};

function TeamDetail() {
	const { teamId } = useParams();
	const [team, setTeam] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchDetail = async () => {
			try {
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
	console.log(team);
	const teamData = team.teaminfo;
	const teamDetail = team.stats.team_info.teaminfo;
	const teamRecord = team.stats.team_record;
	const teamColor = "#" + teamDetail.color;

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			{/* Back Link */}
			<Link to="/" className="text-blue-500 hover:text-blue-700 mb-6 block">
				&larr; Back to Teams List
			</Link>

			{/* Dashboard Header - Using team color as a strong accent */}
			<div className="bg-white shadow-xl rounded-xl p-6 mb-8 border-l-8" style={{ borderColor: teamColor }}>
				<div className="flex items-center space-x-6">
					<img src={teamDetail.logos[0].href} alt={teamDetail.displayName} className="w-24 h-24 object-contain" />
					<div>
						<h1 className="text-4xl font-extrabold text-gray-900" style={{ color: teamColor }}>
							{teamDetail.displayName}
						</h1>
						<p className="text-xl text-gray-500">{teamDetail.location}</p>
					</div>
				</div>
			</div>

			{/* Dashboard Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{/* 1. Overall Record Card */}
				<RecordCard record={teamRecord} />

				{/* 2. Win Percentage Card */}
				<StatCard title="Win Percentage" value={teamRecord.items[0].stats.winPercent.value || "N/A"} />

				{/* 2. Win Percentage Card */}
				<StatCard title="Win Percentage" value={teamRecord.items[0].stats.winPercent.value || "N/A"} />

				{/* 2. Win Percentage Card */}
				<StatCard title="Win Percentage" value={teamRecord.items[0].stats.winPercent.value || "N/A"} />

				<button className="btn btn-primary">This is a button</button>
			</div>

			{/* Additional content/stats go here */}
			<div className="mt-8 bg-white shadow-xl rounded-lg p-6">
				<h3 className="text-xl font-bold text-gray-800">Additional Statistics</h3>
				<pre className="mt-4 text-sm bg-gray-50 p-4 rounded-md overflow-auto">
					{/* Display the raw data for debugging/development */}
					{/*JSON.stringify(concurrentStats, null, 2)*/}
				</pre>
			</div>
		</div>
	);

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
