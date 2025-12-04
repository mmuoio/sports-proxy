import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getTeamDetail } from "../api";

// Helper component for the white tiles
const StatCard = ({ title, value, unit }) => (
	<div className="card  bg-base-100 card-sm shadow-sm border border-gray-300">
		<div className="card-body">
			<h2 className="card-title">{title}</h2>
			<p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
		</div>
	</div>
);

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

const TeamTitleCard = ({ team, record }) => {
	const overallRecord = record.items[0];
	return (
		<div className="navbar bg-base-100 border-2 border-gray-300 rounded-lg mb-3 pl-0">
			<img
				src={team.logos[0].href}
				alt={team.displayName}
				className="w-55 h-14 object-cover border-t-4 border-b-4"
				style={{ borderColor: "#" + team.color }}
			/>
			<div className="w-full p-3 rounded-lg" style={{ backgroundColor: "#" + team.color, color: "white" }}>
				<span className="text-2xl font-bold">{team.displayName}</span>
				<br />
				<span className="text-md">
					{overallRecord.displayValue} <span className="text-gray-400">({team.standingSummary})</span>
				</span>
			</div>
		</div>
	);
};

const ScheduleCard = ({ schedule }) => {
	const events = schedule?.events || [];
	return (
		<div className="card bg-base-100 card-sm shadow-sm border border-gray-300">
			<div className="card-body p-6">
				<h2 className="card-title text-xl font-bold mb-4">Schedule</h2>

				<div className="overflow-x-auto">
					{events.length > 0 ? (
						<table className="table table-xs text-center">
							{/* Table Header */}
							<thead>
								<tr>
									<th>Week</th>
									<th>Home</th>
									<th>Score</th>
									<th>Away</th>
								</tr>
							</thead>

							<tbody>
								{/* 2. Use .map() to generate one <tr> for each event */}
								{events.map((event, index) => {
									const homeTeam = event.competitions[0].competitors[0];
									const awayTeam = event.competitions[0].competitors[1];
									const homeScore = Number(homeTeam?.score?.value);
									const awayScore = Number(awayTeam?.score?.value);
									const displayScore = homeScore || awayScore ? homeScore + "-" + awayScore : "-";
									const eventDate = new Date(event.date);
									const eventMonth = String(eventDate.toLocaleDateString("en-US", { month: "short" }));
									const eventDay = String(eventDate.getDate()).padStart(2, "0");

									return (
										<tr key={event.id || index}>
											{/* Use event.id if available, otherwise index */}
											{/* Week Number */}
											<th className="font-normal">
												{event.week.number || "-"}{" "}
												<span className="text-gray-400">
													({eventMonth}/{eventDay})
												</span>
											</th>

											<td className={homeScore > awayScore ? "font-extrabold" : "font-normal"}>
												<img
													src={homeTeam.team.logos[0].href}
													alt={homeTeam.team.displayName}
													className="w-6 h-6 inline-block"
												/>{" "}
												{homeTeam.team.abbreviation}
											</td>

											<td className="">{displayScore}</td>

											<td className={homeScore < awayScore ? "font-extrabold" : "font-normal"}>
												{awayTeam.team.abbreviation}{" "}
												<img
													src={awayTeam.team.logos[0].href}
													alt={awayTeam.team.displayName}
													className="w-6 h-6 inline-block"
												/>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					) : (
						<div className="text-center py-4 text-gray-500">No scheduled events found.</div>
					)}
				</div>
			</div>
		</div>
	);
};

const ScheduleCardAlt = ({ schedule, currentTeamId }) => {
	const events = schedule?.events || [];
	return (
		<div className="card bg-base-100 card-sm shadow-sm border border-gray-300">
			<div className="card-body p-4">
				<h2 className="card-title text-xl font-bold mb-1">{schedule.requestedSeason.displayName} Regular Season</h2>

				<div className="overflow-x-auto">
					{events.length > 0 ? (
						<table className="table table-xs text-center">
							{/* Table Header */}
							<thead>
								<tr>
									<th>Week</th>
									<th>Opponent</th>
									<th>Outcome</th>
									<th>Score</th>
								</tr>
							</thead>

							<tbody>
								{/* 2. Use .map() to generate one <tr> for each event */}
								{events.map((event, index) => {
									const currentIndex = event.competitions[0].competitors[0].id == currentTeamId ? 0 : 1;
									const opponentIndex = event.competitions[0].competitors[0].id != currentTeamId ? 0 : 1;
									const currentTeam = event.competitions[0].competitors[currentIndex];
									const opponentTeam = event.competitions[0].competitors[opponentIndex];
									const atVs = currentTeam.homeAway == "home" ? "vs" : "@";
									const currentTeamScore = Number(currentTeam?.score?.value);
									const opponentTeamScore = Number(opponentTeam?.score?.value);
									let outcome = "-";
									let outcomeClass = "font-bold";
									if (currentTeamScore > opponentTeamScore) {
										outcome = "W";
										outcomeClass = "text-green-600 font-bold";
									} else if (currentTeamScore < opponentTeamScore) {
										outcome = "L";
										outcomeClass = "text-red-600 font-bold";
									} else if (currentTeamScore == opponentTeamScore) {
										outcome = "T";
									}

									const displayScore = currentTeamScore || opponentTeamScore ? currentTeamScore + "-" + opponentTeamScore : "-";
									const eventDate = new Date(event.date);
									const eventMonth = String(eventDate.toLocaleDateString("en-US", { month: "short" }));
									const eventDay = String(eventDate.getDate()).padStart(2, "0");

									return (
										<tr key={event.id || index} className="hover:bg-base-200">
											{/* Week Number */}
											<th className="font-normal">
												{event.week.number || "-"}{" "}
												<span className="text-gray-400">
													({eventMonth}/{eventDay})
												</span>
											</th>

											<td>
												<span className="align-middle">
													{atVs} {opponentTeam.team.abbreviation}{" "}
													<img
														src={opponentTeam.team.logos[0].href}
														alt={opponentTeam.team.displayName}
														className="w-6 h-6 inline-block"
													/>
												</span>
											</td>

											<td className={outcomeClass}>{outcome}</td>
											<td className="font-bold">{displayScore}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					) : (
						<div className="text-center py-4 text-gray-500">No scheduled events found.</div>
					)}
				</div>
			</div>
		</div>
	);
};

const TeamLeaderCard = ({ leaders, roster }) => (
	<div className="card bg-base-100 card-sm shadow-sm border border-gray-300">
		<div className="card-body p-4">
			<h2 className="card-title text-xl font-bold mb-1">Team Leaders</h2>
			{/*<div className="card lg:card-side bg-base-100 shadow-sm">
				<figure>
					<img src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp" alt="Album" />
				</figure>
				<div className="card-body">
					<h2 className="card-title">New album is released!</h2>
					<p>Click the button to listen on Spotiwhy app.</p>
					<div className="card-actions justify-end">
						<button className="btn btn-primary">Listen</button>
					</div>
				</div>
			</div>*/}
			{leaders.leaders.categories[0].displayName}
			<br />
			{leaders.leaders.categories[0].leaders[0].value}
			<br />
			{leaders.leaders.categories[0].leaders[0].rel}
			<p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
		</div>
	</div>
);

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
	const teamData = team.teaminfo;
	const teamDetail = team.stats.team_info.teaminfo;
	const teamRecord = team.stats.team_record;
	const teamSchedule = team.stats.team_schedule;
	const teamLeaders = team.stats.team_leaders;
	const teamRoster = team.stats.team_roster;
	const teamColor = "#" + teamDetail.color;

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			{/* Back Link */}
			<Link to="/" className="text-blue-500 hover:text-blue-700 mb-3 block">
				&larr; Back to Teams List
			</Link>

			<TeamTitleCard team={teamDetail} record={teamRecord} />

			{/* Dashboard Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 grid-rows-3">
				{/* 1. Overall Record Card */}
				{/*<RecordCard record={teamRecord} />*/}

				{/* <ScheduleCard schedule={teamSchedule} /> */}
				<div className="row-span-3">
					<ScheduleCardAlt schedule={teamSchedule} currentTeamId={teamId} />
				</div>

				<div className="row-span-1">
					<TeamLeaderCard leaders={teamLeaders} roster={teamRoster} />
				</div>

				{/* 2. Win Percentage Card */}
				<div className="row-span-1">
					<StatCard title="Win Percentage" value={teamRecord.items[0].stats.winPercent.value || "N/A"} />
				</div>

				{/* 2. Win Percentage Card */}
				<div className="row-span-1">
					<StatCard title="Win Percentage" value={teamRecord.items[0].stats.winPercent.value || "N/A"} />
				</div>

				{/* 2. Win Percentage Card */}
				<div className="row-span-1">
					<StatCard title="Win Percentage" value={teamRecord.items[0].stats.winPercent.value || "N/A"} />
				</div>

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
}

export default TeamDetail;
