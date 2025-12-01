from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests, asyncio
from django.conf import settings
from django.core.cache import cache
from stats.services.teams_serv import TeamService
from stats.services.standings_serv import StandingsService


CACHE_TTL = 60 * 60 * 8 # 1 hour

@api_view(['GET'])
def get_all_teams(request):
    team_service = TeamService()
    try:
        teams = team_service.get_all_teams()
        return Response(teams)
    except requests.RequestException as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def get_team(request, team_id):
	team_service = TeamService()
	try:
		team = team_service.get_team_info(team_id=team_id)
		return Response(team)
	except requests.RequestException as e:
		return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def get_team_data(request, team_id):
	team_service = TeamService()
	try:
		#team = team_service.get_team_data(team_id=team_id)
		cache_key = f"team_data_{team_id}"
		cached_data = cache.get(cache_key)
		if cached_data:
			return Response(cached_data)
		concurrent_data = asyncio.run(team_service.get_team_data(team_id))
		response_data = {
            #"detail": team,
            #"division_info": division_info,
            "stats": concurrent_data # This is now the resolved dict, not a coroutine
        }
		cache.set(cache_key, response_data)
		return Response(response_data)
	except requests.RequestException as e:
		return Response({"error": str(e)}, status=500)
      
@api_view(['GET'])
def get_standings(request):
	cached_data = cache.get('standings')
	if cached_data:
		return Response(cached_data)

	standings_service = StandingsService()
	try:
		standings = asyncio.run(standings_service.build_standings())
		cache.set('standings', standings, timeout=CACHE_TTL)
		return Response(standings)
	except requests.RequestException as e:
		return Response({"error": str(e)}, status=500)
	