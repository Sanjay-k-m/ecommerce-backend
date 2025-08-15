# Project Scripts Guide

This file explains the main commands used in this project for Prisma, Docker, and development tasks.

---

## Prisma Commands

### SQL Databases (PostgreSQL/MySQL)

- `npm run sql:migrate:init` → Run the first migration
- `npm run sql:migrate:dev` → Apply schema changes (development)
- `npm run sql:migrate:deploy` → Apply migrations in production
- `npm run sql:studio` → Open Prisma Studio for SQL database
- `npm run sql:generate` → Regenerate Prisma Client
- `npm run sql:reset` → Drop and recreate DB (dev only)

### MongoDB

- `npm run mongo:generate` → Regenerate Prisma Client
- `npm run mongo:push` → Push schema changes to MongoDB
- `npm run mongo:studio` → Open Prisma Studio for MongoDB

---

## Docker Commands

### Build & Run

- `docker build -t backend .` → Build Docker image for backend
- `docker compose up --build` → Build and start all services defined in `docker-compose.yml`
- `docker compose up` → Start services (without rebuilding)
- `docker compose down` → Stop and remove containers
- `docker compose stop` → Stop containers without removing them
- `docker compose restart` → Restart containers

### Run commands inside container

- `docker compose exec backend sh` → Open shell inside backend container
- `docker compose exec backend npx prisma migrate deploy` → Run migrations inside container
- `docker compose exec backend pnpm run start:dev` → Start backend in dev mode inside container

### Volumes

- `-v <host-path>:<container-path>` → Mount a host folder into the container  
  Example:
  ```bash
  docker run -v $(pwd):/usr/src/app -it node:20 sh
  ```
