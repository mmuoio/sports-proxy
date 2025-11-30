from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests, asyncio
from django.conf import settings
from django.core.cache import cache
from stats.services.teams_serv import TeamService
from stats.services.standings_serv import StandingsService


CACHE_TIL = 60 * 60 # 1 hour

@api_view(['GET'])
def get_all_teams(request):
    cached_data = cache.get("all_teams")
    if cached_data:
        return Response(cached_data)
    
    team_service = TeamService()
    try:
        teams = team_service.get_all_teams()
        cache.set('all_teams', teams, timeout=CACHE_TIL)
        return Response(teams)
    except requests.RequestException as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def get_team(request, team_id):
	cache_key = f"team_{team_id}"
	cached_data = cache.get(cache_key)
	if cached_data:
		return Response(cached_data)

	team_service = TeamService()
	try:
		team = team_service.get_team_info(team_id=team_id)
		cache.set(cache_key, team, timeout=CACHE_TIL)
		return Response(team)
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
		cache.set('standings', standings, timeout=CACHE_TIL)
		return Response(standings)
	except requests.RequestException as e:
		return Response({"error": str(e)}, status=500)
	