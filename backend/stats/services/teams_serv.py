#call stuff from the clients to get the data, then pass to utils, then return to user

import asyncio
from stats.clients.rapid_api import RapidApiClient, AsyncRapidApiClient
from django.core.cache import cache
from stats.constants import TEAM_DIVISIONS
from django.conf import settings
from stats.utils.teams_util import transform_stat_lists

CACHE_TTL = int(settings.CACHE_TTL)

class TeamService:
	def __init__(self, api_client=None, async_api_client=None):
		#allows injecting a mock client for tests, but defaults to normal one
		self.api = api_client or RapidApiClient()
		self.api_async = async_api_client or AsyncRapidApiClient()

	"""
		RETRIEVE CACHE OR MAKE NEW CALL
	"""
	def _get_cached_sync_data(self, cache_key: str, api_callable, ttl: int, *args, **kwargs):
		cached_data = cache.get(cache_key)
		if cached_data:
			return cached_data
		data = api_callable(*args, **kwargs)
		if data:
			cache.set(cache_key, data, timeout=ttl)
		return data
	
	async def _get_cached_async_data(self, cache_key: str, api_coroutine, ttl: int):
		cached_data = cache.get(cache_key)
		if cached_data:
			return cached_data
		data = await api_coroutine
		if data:
			cache.set(cache_key, data, timeout=ttl)
		return data
	

	"""
		STANDARD METHODS
	"""
	def get_all_teams(self):
		cache_key = "all_teams"
		return self._get_cached_sync_data(cache_key, self.api.list_teams, CACHE_TTL)
	
	# Basic get team data
	def get_team_info(self, team_id: int):
		# GET TEAM INFO
		cache_key_team_info = f"team_{team_id}"
		team = cache.get(cache_key_team_info)
		if not team:
			team = self.api.get_team_info(team_id)
			cache.set(cache_key_team_info, team, timeout=CACHE_TTL)
		return team
	
	# Complex team data, will get a bunch of different api calls before returning
	async def get_team_data(self, team_id: int, year: int = 2025):
		"""
		team details:
		-wins/losses/tie: nfl-team-record
			-standing: this is harder
			-schedule: nfl-team-schedule
			-team stats with ranks (passing, rushing, points for, points against)
			-team leaders: nfl-team-leaders (only returns player IDs, so need to get player list too)
			-game breakdowns: this might come from the schedule call
			-list of players: nfl-team-roster
		
		TODO: create a util to return the current season year (which might be different than current year)
		"""
		

		# GET TEAM INFO
		cache_key_team_info = f"team_{team_id}"
		cache_key_team_record = f"team_record_{team_id}"
		cache_key_team_schedule = f"team_schedule_{team_id}"
		cache_key_team_leaders = f"team_leaders_{team_id}"
		cache_key_team_roster = f"team_roster_{team_id}"

		tasks = [
			self._get_cached_async_data(cache_key_team_info, self.api_async.get_team_info(team_id, year), CACHE_TTL),
			self._get_cached_async_data(cache_key_team_record, self.api_async.get_team_record(team_id, year), CACHE_TTL),
			self._get_cached_async_data(cache_key_team_schedule, self.api_async.get_team_schedule(team_id, year), CACHE_TTL),
			self._get_cached_async_data(cache_key_team_leaders, self.api_async.get_team_leaders(team_id, year), CACHE_TTL),
			self._get_cached_async_data(cache_key_team_roster, self.api_async.get_team_roster(team_id, year), CACHE_TTL),
		]

		results_list = await asyncio.gather(*tasks)
		
		for stats in results_list[1]['items']:
			stats['stats'] = transform_stat_lists(stats['stats'])

		results = {
			"team_info" : results_list[0],
			"team_record" : results_list[1],
			"team_schedule" : results_list[2],
			"team_leaders" : results_list[3],
			"team_roster" : results_list[4]
		}
		return results


		team = cache.get(cache_key_team_info)
		if not team:
			team = self.api.get_team_info(team_id)
			cache.set(cache_key_team_info, team, timeout=CACHE_TTL)
		
		"""
		# GET TEAM RECORD
		cache_key_team_schedule = f"team_{team_id}"
		team = cache.get(cache_key_team_schedule)
		if not team:
			team = self.api.get_team_schedule(team_id)
			cache.set(cache_key_team_schedule, team, timeout=CACHE_TTL)
		"""

		return team
	
	def get_standings(self):

		return 1
