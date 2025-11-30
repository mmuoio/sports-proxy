#this will call rapidapi for all team related endpoints. Post-processing is done in utils

import httpx
from django.conf import settings

class RapidApiClient:
	def __init__(self):
		self.base_url = settings.SPORTS_API_BASE
		self.headers = {
			"X-RapidAPI-Key": settings.SPORTS_API_KEY,
        	"X-RapidAPI-Host": settings.SPORTS_API_HOST
		}
	
	def _get(self, endpoint: str, params=None):
		url = f"{self.base_url}{endpoint}"

		with httpx.Client(timeout=10) as client:
			response = client.get(url, headers=self.headers, params=params)
			response.raise_for_status()
			return response.json()
	
	def list_teams(self):
		return self._get("/nfl-team-listing/v1/data")
	
	def get_team_info(self, team_id: str):
		return self._get("/nfl-team-info", params={"id": team_id})
	
class AsyncRapidApiClient:
    def __init__(self):
        self.base_url = settings.SPORTS_API_BASE
        self.headers = {
            "X-RapidAPI-Key": settings.SPORTS_API_KEY,
            "X-RapidAPI-Host": settings.SPORTS_API_HOST,
        }

    async def _get(self, endpoint: str, params=None):
        url = f"{self.base_url}{endpoint}"

        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            return response.json()

    async def get_team_record(self, team_id, year):
        return await self._get(
            "/nfl-team-rcord",
            params={"id": team_id, "year": year},
        )
