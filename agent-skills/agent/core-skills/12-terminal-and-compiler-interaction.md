# Terminal and Compiler Interaction

An AI engineering agent must be able to interact with the development environment
through the terminal in a safe, repeatable, and observable way.

This capability includes:

* executing build commands
* installing dependencies
* running migrations
* launching development servers
* reading compiler and runtime errors
* interpreting test results
* verifying successful execution

The terminal is the primary interface for validating that code changes actually work.

## Core Responsibilities

The agent must be able to:

1. Execute build commands
2. Execute test commands
3. Launch development servers
4. Detect compiler failures
5. Parse stack traces and error logs
6. Identify failing modules or files
7. Apply fixes and rerun builds

The agent must not assume code works until the build process confirms it.

## Common Commands

Examples include:

### Backend

mvn clean install
mvn spring-boot:run



### Frontend



npm install
npm run build
npm start
ng serve



### Database



flyway migrate



### Container systems



docker build
docker compose up





The exact commands depend on the project stack defined in `/agent/project-spec/`.



\## Error Handling



When errors occur, the agent must:



1\. Capture the error output

2\. Identify the root cause

3\. Modify the relevant files

4\. Re-run the command



If multiple attempts fail, the agent must escalate uncertainty

according to the self-critique skill.



\## Safety Rules



The agent must never:



\- execute destructive commands without confirmation

\- delete system directories

\- expose credentials in logs

\- alter unrelated project files



\## Validation Rule



No implementation step is considered complete until:



\- the build succeeds

\- the application starts

\- the relevant feature can run



Terminal verification is mandatory before moving to the next task.



