from django.urls import path
from .views import get_all_teams, get_team, get_standings, get_team_data  # or search_teams if using that first

urlpatterns = [
    path('teams/', get_all_teams),  # GET /api/teams/
	path('teams/<int:team_id>/', get_team),
	path('teams/data/<int:team_id>/', get_team_data),
	path('standings/', get_standings)
]
