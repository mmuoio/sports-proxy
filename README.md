# Sports Proxy — Django backend

API used: <name> (base: https://...)
Purpose: proxy external sports API, normalize & cache results for frontend.

MVP endpoints:

-   GET /api/search-teams/?q=
-   GET /api/teams/{external_id}/
-   GET /api/teams/{external_id}/roster/
-   GET /api/players/{external_id}/stats/?range=last10
-   GET /api/games/{external_id}/boxscore/

Caching: Redis, TTLs planned per endpoint
