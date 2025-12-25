# 🐳 Docker Deployment Guide

## Quick Start

### Prerequisites

- Docker Desktop installed (https://www.docker.com/products/docker-desktop/)
- `.env.docker` file configured with your credentials

### Basic Commands

```bash
# 1. Configure environment
cp .env.docker.example .env.docker
# Edit .env.docker and fill in your credentials

# 2. Build and start all services
docker-compose up -d

# 3. Check status
docker-compose ps

# 4. View logs
docker-compose logs -f app

# 5. Stop all services
docker-compose down
```

## Detailed Setup

### Step 1: Environment Configuration

1. **Copy the environment template:**
   ```bash
   cp .env.docker .env.docker
   ```

2. **Fill in required values in `.env.docker`:**

   **Required Fields (MUST fill):**
   - `JWT_ACCESS_TOKEN_SECRET` - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `JWT_REFRESH_TOKEN_SECRET` - Generate a different secret
   - `PRIVATE_KEY` - Your Ethereum wallet private key (from MetaMask)
   - `MNEMONIC` - Your 12-word wallet mnemonic
   - `ENCRYPTION_KEY` - 32-character string for AES-256
   - `ENCRYPTION_IV` - 16-character string
   - `CLOUDINARY_*` - Your Cloudinary credentials

   **Database Options:**
   
   The docker-compose includes local MongoDB and Redis instances by default.
   
   - **Use Local (Default):** No changes needed, uses containers
   - **Use MongoDB Atlas:** Update `MONGO_URL` to your Atlas connection string
   - **Use Upstash Redis:** Update `REDIS_HOST`, `REDIS_PORT`, and add `REDIS_PASSWORD`

### Step 2: Build the Application

```bash
# Build Docker image
docker-compose build

# Or build without cache
docker-compose build --no-cache
```

### Step 3: Start Services

```bash
# Start in detached mode (background)
docker-compose up -d

# Or start with logs (foreground)
docker-compose up
```

**Expected output:**
```
Creating network "corechainserver_corechain-network" done
Creating corechainserver-mongo ... done
Creating corechainserver-redis ... done
Creating corechainserver-app   ... done
```

### Step 4: Verify Deployment

```bash
# Check all services are running
docker-compose ps

# Should show:
# NAME                      STATUS        PORTS
# corechainserver-app       Up (healthy)  0.0.0.0:3000->3000/tcp
# corechainserver-mongo     Up (healthy)  0.0.0.0:27017->27017/tcp
# corechainserver-redis     Up (healthy)  0.0.0.0:6379->6379/tcp
```

**Test the application:**
```bash
# Health check
curl http://localhost:3000/health

# Test blockchain endpoint
curl http://localhost:3000/blockchain/employees
```

## Service Management

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f mongo
docker-compose logs -f redis

# Last 100 lines
docker-compose logs --tail=100 app
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart app
```

### Stop Services

```bash
# Stop without removing
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes (deletes data!)
docker-compose down -v
```

## Database Management

### MongoDB

**Connect to MongoDB shell:**
```bash
docker exec -it corechainserver-mongo mongosh -u admin -p admin123 --authenticationDatabase admin
```

**Backup database:**
```bash
docker exec corechainserver-mongo mongodump --uri="mongodb://admin:admin123@localhost:27017/hrm-backend?authSource=admin" --out=/data/backup
docker cp corechainserver-mongo:/data/backup ./backup
```

**Restore database:**
```bash
docker cp ./backup corechainserver-mongo:/data/backup
docker exec corechainserver-mongo mongorestore --uri="mongodb://admin:admin123@localhost:27017/hrm-backend?authSource=admin" /data/backup
```

### Redis

**Connect to Redis CLI:**
```bash
docker exec -it corechainserver-redis redis-cli
```

**Clear cache:**
```bash
docker exec corechainserver-redis redis-cli FLUSHALL
```

## Troubleshooting

### Container Won't Start

**Check logs for errors:**
```bash
docker-compose logs app
```

**Common issues:**

1. **Port already in use:**
   ```
   Error: bind: address already in use
   ```
   Solution: Stop the service using the port or change the port in `docker-compose.yml`

2. **Environment variable missing:**
   ```
   Error: Missing required environment variable
   ```
   Solution: Check `.env.docker` has all required fields filled

3. **MongoDB connection failed:**
   ```
   Error: connect ECONNREFUSED mongo:27017
   ```
   Solution: Wait for MongoDB to be healthy (check with `docker-compose ps`)

### Application Errors

**Check application logs:**
```bash
docker-compose logs -f app
```

**Rebuild container:**
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database Issues

**Reset MongoDB (WARNING: Deletes all data):**
```bash
docker-compose down -v
docker volume rm corechainserver_mongo_data
docker-compose up -d
```

### Performance Issues

**Check resource usage:**
```bash
docker stats
```

**Increase Docker resources:**
- Open Docker Desktop → Settings → Resources
- Increase CPU and Memory limits

## Production Deployment

### Security Best Practices

1. **Never commit `.env.docker` to Git** ✅ Already in .gitignore

2. **Use strong secrets:**
   ```bash
   # Generate strong random secrets
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Use managed databases in production:**
   - MongoDB Atlas for MongoDB
   - Upstash or Redis Cloud for Redis

4. **Use HTTPS:**
   - Deploy behind a reverse proxy (nginx, Traefik)
   - Use SSL certificates (Let's Encrypt)

5. **Limit exposed ports:**
   - Only expose port 3000 (application)
   - Don't expose MongoDB/Redis ports publicly

### Environment-Specific Configurations

**For staging/production:**

Create `docker-compose.override.yml`:
```yaml
version: '3.8'

services:
  app:
    environment:
      NODE_ENV: production
    restart: always
  
  # Optional: Remove local DB if using Atlas/Upstash
  mongo:
    profiles:
      - local-only
  
  redis:
    profiles:
      - local-only
```

## Useful Commands

```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# Execute command in container
docker exec -it corechainserver-app sh

# View container resource usage
docker stats

# Clean up unused Docker resources
docker system prune -a

# View Docker volumes
docker volume ls

# Remove all stopped containers
docker container prune

# View application health
docker inspect corechainserver-app | grep -A 10 Health
```

## Architecture

```
┌─────────────────────────────────────────┐
│         Docker Compose Network          │
│                                         │
│  ┌──────────┐  ┌───────────┐           │
│  │  MongoDB │  │   Redis   │           │
│  │  :27017  │  │   :6379   │           │
│  └─────┬────┘  └─────┬─────┘           │
│        │             │                  │
│        └──────┬──────┘                  │
│               │                         │
│        ┌──────▼──────┐                 │
│        │ CoreChain   │                 │
│        │ Application │                 │
│        │    :3000    │                 │
│        └──────┬──────┘                 │
│               │                         │
└───────────────┼─────────────────────────┘
                │
         ┌──────▼──────┐
         │   Sepolia   │
         │  Testnet    │
         │ (Blockchain)│
         └─────────────┘
```

## Next Steps

1. ✅ Environment configured
2. ✅ Containers running
3. ✅ Application accessible at http://localhost:3000
4. 📝 Update API documentation
5. 🚀 Deploy to production server

## Support

- **Docker Documentation:** https://docs.docker.com/
- **Docker Compose:** https://docs.docker.com/compose/
- **NestJS Docker:** https://docs.nestjs.com/recipes/deployment
