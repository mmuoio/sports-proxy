import asyncio
from stats.clients.rapid_api import AsyncRapidApiClient
from stats.services.teams_serv import TeamService  # your existing sync service

class StandingsService:
    def __init__(self):
        self.team_service = TeamService()
        self.async_client = AsyncRapidApiClient()

    async def build_standings(self):
        # Step 1: Get list of all teams (sync)
        all_teams = self.team_service.get_all_teams()

        # Step 2: Prepare async tasks for each team's profile
        tasks = [
            self.async_client.get_team(team["teamId"])
            for team in all_teams
        ]

        # Step 3: Run requests in parallel
        results = await asyncio.gather(*tasks)

        # Step 4: Transform into standings
        formatted = []
        for team, data in zip(all_teams, results):
            formatted.append({
                "teamId": team["teamId"],
                "name": team["name"],
                "wins": data["wins"],
                "losses": data["losses"],
                "winPct": data["wins"] / (data["wins"] + data["losses"])
            })

        # Step 5: Sort standings
        formatted.sort(key=lambda t: (-t["winPct"], t["name"]))

        return formatted
