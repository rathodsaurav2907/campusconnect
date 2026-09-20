# CampusConnect

A student-management platform for profiles, resources, notes, and events. The Docker environment provides Node.js and MongoDB.

## Start

1. Copy `.env.example` to `.env`.
2. Add the API project under `api/` (Node 22, Express, MongoDB driver or Mongoose).
3. Run `docker compose up --build`.

API: `http://localhost:4002`. Add the React app in `web/` when ready.

## Suggested milestones

- JWT authentication and student/admin roles
- profiles, notes, events, and resources CRUD
- REST API documentation and responsive React interface
