# gamingzone-cart

Cart microservice for GamingZone platform using NestJS with Clean Architecture.

## Architecture

- **Strategy**: Cart data stored in Redis for speed, persisted to PostgreSQL for recovery
- **Pattern**: Clean Architecture with CQRS
- **Primary Storage**: Redis (in-memory cache)
- **Backup Storage**: PostgreSQL (persistence)

## Tech Stack

- NestJS 10
- Redis (ioredis)
- PostgreSQL + Prisma
- TypeScript
- Docker

## Project Structure

```
src/
├── application/       # Use cases, DTOs, ports
├── domain/           # Entities, value objects, aggregates
├── infrastructure/   # Redis, Prisma, external services
├── presentation/     # Controllers, guards, interceptors
└── shared/          # Config, utils, constants
```

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose

### Installation

```bash
# Install dependencies
npm install

# Start Redis and PostgreSQL
docker-compose up -d

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### Development

```bash
# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod
```

### Environment Variables

Copy `.env.example` to `.env.development` and configure:

```env
NODE_ENV=development
PORT=3000
REDIS_HOST=localhost
REDIS_PORT=6379
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gamingzone_cart"
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## License

MIT
