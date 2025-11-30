from django.urls import path
from .views import get_all_teams, get_team, get_standings  # or search_teams if using that first

urlpatterns = [
    path('teams/', get_all_teams),  # GET /api/teams/
	path('teams/<int:team_id>/', get_team),
	path('standings/', get_standings)
]
