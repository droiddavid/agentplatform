Local development with Docker (backend + MySQL)

Requirements:
- Docker Desktop or Docker Engine installed and running
- (Optional) `docker-compose` or `docker compose` available

Start the dev stack:

```powershell
# Windows PowerShell example
$env:MYSQL_ROOT_PASSWORD = 'locutus'
$env:JWT_SECRET = 'replace_this_in_prod'
docker compose -f docker-compose.dev.yml up --build
```

This will:
- Start a MySQL 8.0 container with a named volume for persistence
- Build the backend image and start it on port 8083

Notes:
- `application.properties` reads `spring.datasource.password` from `MYSQL_ROOT_PASSWORD` and `jwt.secret` from `JWT_SECRET`.
- For frontend development you can continue using `npm start` in `frontend/agentplatform` and point the API to `http://localhost:8083`.
