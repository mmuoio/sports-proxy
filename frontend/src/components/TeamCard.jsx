import { Link } from "react-router-dom";

function TeamCard({ team }) {
	return (
		<Link to={`/teams/${team.team.id}`}>
			<div className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center hover:shadow-xl transition-shadow cursor-pointer">
				<img src={team.team?.logos[0]?.href} alt={team.team.displayName} className="w-20 h-20 object-contain mb-3" />

				<h3 className="text-lg font-semibold text-gray-800 text-center" style={{ color: "#" + team.team.color }}>
					{team.team.nickname}
				</h3>

				{team.team.location && <p className="text-sm text-gray-500 text-center">{team.team.location}</p>}
			</div>
		</Link>
	);
}

export default TeamCard;
