Secrets and environment variables

Required environment variables (local development):
- `MYSQL_ROOT_PASSWORD` — MySQL root password (default used for local dev: `locutus` unless overridden).
- `JWT_SECRET` — Secret used to sign JWT access tokens (override the dev default).

CI / GitHub Actions
- Add the following GitHub Secrets to your repository settings:
  - `MYSQL_ROOT_PASSWORD`
  - `JWT_SECRET`

Local development
- To run locally with the same behavior as CI, set environment variables before starting the backend. Example (PowerShell):

```powershell
$env:MYSQL_ROOT_PASSWORD = 'locutus'
$env:JWT_SECRET = 'replace_this_with_a_secure_secret'
./mvnw spring-boot:run
```

Notes
- `application.properties` now reads `spring.datasource.password` from `MYSQL_ROOT_PASSWORD` and `jwt.secret` from `JWT_SECRET`, with safe local defaults to preserve developer experience.
- For production, use a secret manager (Key Vault, AWS Secrets Manager, etc.) and inject secrets into the runtime environment rather than checking them into source control.
