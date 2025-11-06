# Docker Setup for Task Manager

This document provides instructions for running the Task Manager application using Docker.

## Prerequisites

- Docker and Docker Compose installed on your system
- Git (to clone the repository)

## Quick Start

### Development Environment

1. **Start the development environment:**
   ```bash
   npm run docker:dev
   ```

2. **Access the application:**
   - Open http://localhost:3000 in your browser
   - The app will automatically reload on code changes

3. **Stop the development environment:**
   ```bash
   npm run docker:dev:down
   ```

### Production Environment

1. **Set up environment variables:**
   ```bash
   cp .env.docker .env
   # Edit .env and set a secure JWT_SECRET
   ```

2. **Start the production environment:**
   ```bash
   npm run docker:prod
   ```

3. **Access the application:**
   - Open http://localhost:3000 in your browser

4. **Stop the production environment:**
   ```bash
   npm run docker:prod:down
   ```

## Available Docker Commands

| Command | Description |
|---------|-------------|
| `npm run docker:dev` | Start development environment with hot reload |
| `npm run docker:dev:down` | Stop development environment |
| `npm run docker:prod` | Start production environment (detached) |
| `npm run docker:prod:down` | Stop production environment |
| `npm run docker:logs` | View container logs |
| `npm run docker:clean` | Clean up containers and volumes |

## Docker Configuration

### Files Overview

- **`Dockerfile`**: Multi-stage production build
- **`Dockerfile.dev`**: Development environment with hot reload
- **`docker-compose.yml`**: Development configuration
- **`docker-compose.prod.yml`**: Production configuration
- **`.dockerignore`**: Files to exclude from Docker build
- **`.env.docker`**: Docker environment variables template

### Production Build Optimization

The production Dockerfile uses multi-stage builds for optimal image size:

1. **Base stage**: Sets up Node.js environment
2. **Deps stage**: Installs dependencies
3. **Builder stage**: Builds the application
4. **Runner stage**: Minimal runtime image

### Data Persistence

- SQLite database is persisted in Docker volumes at `./prisma/dev.db`
- Database survives container restarts
- Use `npm run docker:clean` to remove all data

## Health Check

The production setup includes a health check endpoint:
- **Endpoint**: `/api/health`
- **Purpose**: Monitor application health
- **Check interval**: Every 30 seconds

## Environment Variables

### Required Variables

- `DATABASE_URL`: SQLite database path
- `JWT_SECRET`: Secret for JWT token signing

### Development Variables

- `NODE_ENV`: Set to `development`
- `DATABASE_URL`: `file:./prisma/dev.db`

### Production Variables

- `NODE_ENV`: Set to `production`
- `DATABASE_URL`: `file:./prisma/dev.db`
- `JWT_SECRET`: Must be a secure, random string

## Security Considerations

1. **JWT Secret**: Always use a secure, random JWT secret in production
2. **Database**: SQLite is file-based, ensure proper file permissions
3. **Network**: By default, only exposes port 3000

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure port 3000 is not in use
2. **Permission issues**: Ensure Docker has proper file permissions
3. **Build failures**: Check that all dependencies are in package.json

### Debug Commands

```bash
# View container logs
npm run docker:logs

# Check container status
docker-compose ps

# Access container shell
docker-compose exec app sh
```

### Reset Environment

To completely reset the Docker environment:

```bash
npm run docker:clean
```

This will:
- Stop all containers
- Remove all volumes (including database)
- Clean up unused Docker resources

## Architecture Notes

The Docker setup maintains the Clean Architecture principles:

- **Domain Layer**: Pure business logic
- **Data Layer**: Database access via Prisma
- **Presentation Layer**: Next.js frontend and API routes

The containerization doesn't affect the architectural separation of concerns.