#call stuff from the clients to get the data, then pass to utils, then return to user

from stats.clients.rapid_api import RapidApiClient

class TeamService:
	def __init__(self, api_client=None):
		#allows injecting a mock client for tests, but defaults to normal one
		self.api = api_client or RapidApiClient()
	
	def get_all_teams(self):
		"""
        Pull all teams from the external API.
        (Business logic can be added later.)
        """
		teams = self.api.list_teams()
		return teams
	
	def get_team_info(self, team_id: int):
		"""
        Pull all teams from the external API.
        (Business logic can be added later.)
        """
		team = self.api.get_team_info(team_id)
		return team
	
	def get_standings(self):

		return 1
