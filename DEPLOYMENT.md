# Deployment Guide

This guide covers deploying Praetbot (Discord bot + Next.js web interface) to various cloud platforms.

## Overview

Praetbot consists of two components:

- **Discord Bot**: Runs continuously and connects to Discord
- **Web Interface**: Built with Next.js, handles the web dashboard and API routes

Both components share the same deployment and can run together on most platforms.

## Table of Contents

- [Deployment Guide](#deployment-guide)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [AWS Deployment](#aws-deployment)
    - [AWS Elastic Beanstalk](#aws-elastic-beanstalk)
    - [AWS EC2](#aws-ec2)
    - [AWS Lambda with API Gateway](#aws-lambda-with-api-gateway)
  - [Azure Deployment](#azure-deployment)
    - [Azure App Service](#azure-app-service)
    - [Azure Container Instances](#azure-container-instances)
  - [Google Cloud Platform](#google-cloud-platform)
    - [Google Cloud Run](#google-cloud-run)
    - [Google Compute Engine](#google-compute-engine)
  - [Vercel Deployment](#vercel-deployment)
  - [Heroku Deployment](#heroku-deployment)
  - [Digital Ocean](#digital-ocean)
    - [Using App Platform](#using-app-platform)
    - [Using Droplet (VPS)](#using-droplet-vps)
  - [Railway](#railway)
  - [Render](#render)
  - [Docker Deployment](#docker-deployment)
    - [Create Dockerfile](#create-dockerfile)
    - [Create `.dockerignore`](#create-dockerignore)
    - [Build and run locally](#build-and-run-locally)
    - [Docker Compose](#docker-compose)
  - [MongoDB Setup](#mongodb-setup)
    - [MongoDB Atlas (Recommended)](#mongodb-atlas-recommended)
    - [Self-hosted MongoDB](#self-hosted-mongodb)
  - [Post-Deployment Checklist](#post-deployment-checklist)
  - [Troubleshooting](#troubleshooting)
    - [Bot not coming online](#bot-not-coming-online)
    - [Database connection errors](#database-connection-errors)
    - [Commands not working](#commands-not-working)
    - [High memory usage](#high-memory-usage)
  - [Monitoring and Maintenance](#monitoring-and-maintenance)
    - [Recommended Tools](#recommended-tools)
    - [Backup Strategy](#backup-strategy)
    - [Updates](#updates)
  - [Support](#support)
  - [Community](#community)
  - [License](#license)

## Prerequisites

Before deploying, ensure you have:

1. **Discord Bot Token**
   - Create a bot at [Discord Developer Portal](https://discord.com/developers/applications)
   - Enable required intents: Guilds, Guild Messages, Message Content, Guild Members
   - Copy the bot token

2. **MongoDB Database**
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
   - Or self-hosted MongoDB instance
   - Get connection string

3. **OpenWeatherMap API Key** (optional, for weather command)
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Get API key

## Environment Variables

All deployments require these environment variables:

```env
BOT_API_KEY=your_discord_bot_token
MONGODB_URI=your_mongodb_connection_string
# OR use individual MongoDB credentials (not needed if MONGODB_URI is provided):
# MONGO_USER=your_mongodb_username
# MONGO_PASSWORD=your_mongodb_password
# MONGO_SERVER=your_mongodb_host:port/database
WEATHER_KEY=your_openweathermap_api_key
NODE_ENV=production
PORT=3000
```

**Note**: You can either provide `MONGODB_URI` (recommended) OR the individual `MONGO_USER`, `MONGO_PASSWORD`, and `MONGO_SERVER` variables, but not both.

---

## AWS Deployment

### AWS Elastic Beanstalk

**Best for**: Easy deployment with auto-scaling

1. **Install AWS CLI and EB CLI**

   ```bash
   pip install awsebcli
   ```

2. **Initialize Elastic Beanstalk**

   ```bash
   eb init -p node.js-20 praetbot
   ```

3. **Create `.ebextensions/nodecommand.config`**

   ```yaml
   option_settings:
     aws:elasticbeanstalk:container:nodejs:
       NodeCommand: 'npm start'
   ```

4. **Set environment variables**

   ```bash
   eb setenv BOT_API_KEY=your_token \
     MONGODB_URI=your_connection_string \
     WEATHER_KEY=key \
     NODE_ENV=production
   ```

5. **Create and deploy**

   ```bash
   eb create praetbot-env
   eb deploy
   ```

6. **View logs**
   ```bash
   eb logs
   ```

### AWS EC2

**Best for**: Full control over server

1. **Launch EC2 Instance**
   - Choose Ubuntu 22.04 LTS
   - Instance type: t2.micro (free tier) or larger
   - Configure security group: Allow SSH (22), HTTP (80), HTTPS (443)

2. **Connect to instance**

   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Node.js 20**

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Clone and setup**

   ```bash
   git clone https://github.com/maniator/praetbot.git
   cd praetbot
   npm install
   ```

5. **Create `.env` file**

   ```bash
   nano .env
   # Add your environment variables
   ```

6. **Install PM2 for process management**

   ```bash
   sudo npm install -g pm2
   pm2 start npm --name "praetbot" -- start
   pm2 save
   pm2 startup
   ```

7. **Setup auto-restart on reboot**
   ```bash
   sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
   ```

### AWS Lambda with API Gateway

**Best for**: Serverless, pay-per-use

⚠️ **Note**: Discord bots work best with persistent connections. Lambda is better suited for the web interface part.

> Express entrypoint (`eApp`) was removed. There is no standalone HTTP server in this repo today—
> the bot runs from `app.ts`, and the web UI is the Next.js app under `web/`. If you need a
> serverless handler, export the Next.js app or add a dedicated Express entrypoint first.

---

## Azure Deployment

### Azure App Service

**Best for**: Managed platform with easy scaling

1. **Install Azure CLI**

   ```bash
   # macOS
   brew install azure-cli

   # Windows
   # Download from https://aka.ms/installazurecliwindows
   ```

2. **Login to Azure**

   ```bash
   az login
   ```

3. **Create resource group**

   ```bash
   az group create --name praetbot-rg --location eastus
   ```

4. **Create App Service plan**

   ```bash
   az appservice plan create \
     --name praetbot-plan \
     --resource-group praetbot-rg \
     --sku B1 \
     --is-linux
   ```

5. **Create web app**

   ```bash
   az webapp create \
     --resource-group praetbot-rg \
     --plan praetbot-plan \
     --name praetbot-app \
     --runtime "NODE:20-lts"
   ```

6. **Configure environment variables**

   ```bash
   az webapp config appsettings set \
     --resource-group praetbot-rg \
     --name praetbot-app \
     --settings \
       BOT_API_KEY=your_token \
       MONGODB_URI=your_connection_string \
       WEATHER_KEY=key \
       NODE_ENV=production
   ```

7. **Deploy from GitHub**

   ```bash
   az webapp deployment source config \
     --name praetbot-app \
     --resource-group praetbot-rg \
     --repo-url https://github.com/maniator/praetbot \
     --branch main \
     --manual-integration
   ```

8. **View logs**
   ```bash
   az webapp log tail --name praetbot-app --resource-group praetbot-rg
   ```

### Azure Container Instances

**Best for**: Running containers without managing VMs

1. **Create Dockerfile** (see Docker section below)

2. **Build and push to Azure Container Registry**

   ```bash
   az acr create --resource-group praetbot-rg --name praetbotacr --sku Basic
   az acr build --registry praetbotacr --image praetbot:latest .
   ```

3. **Deploy container**
   ```bash
   az container create \
     --resource-group praetbot-rg \
     --name praetbot-container \
     --image praetbotacr.azurecr.io/praetbot:latest \
     --dns-name-label praetbot \
     --ports 3000 \
     --environment-variables \
       BOT_API_KEY=your_token \
       MONGODB_URI=your_connection_string \
       WEATHER_KEY=key
   ```

---

## Google Cloud Platform

### Google Cloud Run

**Best for**: Fully managed serverless containers

1. **Install gcloud CLI**

   ```bash
   # macOS
   brew install google-cloud-sdk

   # Or download from https://cloud.google.com/sdk/docs/install
   ```

2. **Initialize and login**

   ```bash
   gcloud init
   gcloud auth login
   ```

3. **Create Dockerfile** (see Docker section)

4. **Build and deploy**

   ```bash
   gcloud run deploy praetbot \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars BOT_API_KEY=your_token,MONGODB_URI=your_connection_string,WEATHER_KEY=key
   ```

5. **View logs**
   ```bash
   gcloud run logs read --service praetbot
   ```

### Google Compute Engine

**Best for**: Full VM control

1. **Create VM instance**

   ```bash
   gcloud compute instances create praetbot-vm \
     --image-family=ubuntu-2204-lts \
     --image-project=ubuntu-os-cloud \
     --machine-type=e2-micro \
     --zone=us-central1-a
   ```

2. **SSH into instance**

   ```bash
   gcloud compute ssh praetbot-vm --zone=us-central1-a
   ```

3. **Follow EC2 setup steps** (Install Node.js, clone repo, setup PM2)

---

## Vercel Deployment

**Best for**: Serverless web interface hosting

⚠️ **Note**: The Discord bot requires continuous runtime. For Vercel deployment:

1. **Deploy web interface to Vercel** (Next.js app in `/web` directory)
2. **Deploy bot separately** to a platform supporting long-running processes (AWS EC2, Railway, Render, etc.)

**Deploying Web Interface:**

1. **Install Vercel CLI** (optional, can use GitHub integration)

   ```bash
   npm install -g vercel
   ```

2. **Connect GitHub Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Vercel will auto-detect the Next.js app in the `/web` directory

3. **Configure Environment Variables**

   In Vercel Dashboard → Project Settings → Environment Variables, add:

   ```
   MONGODB_URI=your_connection_string
   WEATHER_KEY=your_openweathermap_api_key
   ```

4. **Deploy**

   ```bash
   # Via Vercel CLI
   vercel --prod

   # Or automatically when you push to main branch (if GitHub integration enabled)
   git push origin main
   ```

5. **For the Discord Bot**

   Deploy `app.ts` separately to a platform that supports continuous processes:
   - **Railway**: `npm install -g @railway/cli && railway up`
   - **Render**: Connect GitHub, set build command to `npm install && npm run build:bot`
   - **AWS EC2/Heroku**: Follow their respective deployment guides

**Note**: The `vercel.json` in the root is automatically configured to deploy the Next.js app. Environment variables should be set in the Vercel dashboard, not in config files.

---

## Heroku Deployment

**Best for**: Simple deployment with Git push

1. **Install Heroku CLI**

   ```bash
   # macOS
   brew install heroku/brew/heroku

   # Or download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login and create app**

   ```bash
   heroku login
   heroku create praetbot-app
   ```

3. **Set environment variables**

   ```bash
   heroku config:set BOT_API_KEY=your_token
   heroku config:set MONGODB_URI=your_connection_string
   heroku config:set WEATHER_KEY=key
   ```

4. **Ensure Procfile exists** (already included in repo)

   ```
   web: npm start
   ```

5. **Deploy**

   ```bash
   git push heroku main
   ```

6. **View logs**
   ```bash
   heroku logs --tail
   ```

---

## Digital Ocean

**Best for**: Developer-friendly VPS with good pricing

### Using App Platform

1. **Create account** at [Digital Ocean](https://www.digitalocean.com/)

2. **Click "Create" → "Apps"**

3. **Connect GitHub repository**

4. **Configure app**
   - Name: praetbot
   - Region: Choose closest to your users
   - Branch: main
   - Build Command: `npm install`
   - Run Command: `npm start`

5. **Add environment variables** in the "Environment Variables" section

6. **Click "Create Resources"**

### Using Droplet (VPS)

1. **Create Droplet**
   - Choose Ubuntu 22.04
   - Size: Basic (1GB RAM minimum)
   - Add SSH key

2. **SSH into droplet**

   ```bash
   ssh root@your_droplet_ip
   ```

3. **Follow EC2 setup steps** (Install Node.js, clone repo, PM2)

---

## Railway

**Best for**: Modern deployment platform with great DX

1. **Visit [Railway.app](https://railway.app/)**

2. **Click "New Project" → "Deploy from GitHub repo"**

3. **Select praetbot repository**

4. **Add environment variables**
   - Go to Variables tab
   - Add all required environment variables

5. **Deploy automatically happens on push**

6. **View logs** in the Railway dashboard

---

## Render

**Best for**: Free tier for hobby projects

1. **Visit [Render.com](https://render.com/)**

2. **Click "New +" → "Web Service"**

3. **Connect GitHub repository**

4. **Configure service**
   - Name: praetbot
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

5. **Add environment variables** in "Environment" section

6. **Click "Create Web Service"**

---

## Docker Deployment

**Best for**: Consistent deployment across any platform

### Create Dockerfile

```dockerfile
FROM node:20-alpine

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start the bot
CMD ["npm", "start"]
```

### Create `.dockerignore`

```
node_modules
npm-debug.log
dist
.env
.git
.gitignore
README.md
coverage
.vitest
```

### Build and run locally

```bash
# Build image
docker build -t praetbot .

# Run container
docker run -d \
  --name praetbot \
  -p 3000:3000 \
  -e BOT_API_KEY=your_token \
  -e MONGO_USER=user \
  -e MONGO_PASSWORD=pass \
  -e MONGO_SERVER=host:port/db \
  -e WEATHER_KEY=key \
  praetbot
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  bot:
    build: .
    ports:
      - '3000:3000'
    environment:
      - BOT_API_KEY=${BOT_API_KEY}
      - MONGODB_URI=${MONGODB_URI}
      - WEATHER_KEY=${WEATHER_KEY}
      - NODE_ENV=production
    restart: unless-stopped
    depends_on:
      - mongodb

  mongodb:
    image: mongo:6
    ports:
      - '27017:27017'
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USER}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

volumes:
  mongodb_data:
```

Run with:

```bash
docker-compose up -d
```

---

## MongoDB Setup

### MongoDB Atlas (Recommended)

1. **Create free account** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. **Create cluster**
   - Choose free tier (M0)
   - Select region closest to your deployment

3. **Create database user**
   - Go to Database Access
   - Add user with password

4. **Whitelist IP addresses**
   - Go to Network Access
   - Add IP: `0.0.0.0/0` (allow from anywhere) or specific IPs

5. **Get connection string**
   - Click "Connect" on cluster
   - Choose "Connect your application"
   - Copy connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database`

### Self-hosted MongoDB

```bash
# Install MongoDB
sudo apt-get install -y mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Connection string format
mongodb://localhost:27017/praetbot
```

---

## Post-Deployment Checklist

- [ ] Bot appears online in Discord server
- [ ] Test basic commands (`!!help`, `!!listCommands`)
- [ ] Test cookie system (`@user ++`)
- [ ] Test custom commands (`!!addCommand test return "Hello"`)
- [ ] Test weather command (`!!weather London`)
- [ ] Check MongoDB connection and data persistence
- [ ] Verify web interface at your deployment URL
- [ ] Set up monitoring/logging
- [ ] Configure automatic backups for database
- [ ] Set up SSL/HTTPS if needed
- [ ] Monitor resource usage and scale if needed

---

## Troubleshooting

### Bot not coming online

- Check `BOT_API_KEY` is correct
- Verify bot has required Discord intents enabled
- Check logs for connection errors

### Database connection errors

- Verify MongoDB connection string format
- Check username/password are correct
- Ensure IP whitelist includes your deployment IP
- Test connection with MongoDB Compass

### Commands not working

- Check bot has "Message Content" intent enabled
- Verify bot has permissions in Discord server
- Check logs for error messages

### High memory usage

- Increase instance size
- Enable connection pooling for MongoDB
- Monitor for memory leaks with `pm2 monit`

---

## Monitoring and Maintenance

### Recommended Tools

- **Uptime monitoring**: [UptimeRobot](https://uptimerobot.com/), [Pingdom](https://www.pingdom.com/)
- **Error tracking**: [Sentry](https://sentry.io/)
- **Log management**: [Papertrail](https://www.papertrail.com/), [Loggly](https://www.loggly.com/)
- **Performance**: [New Relic](https://newrelic.com/), [DataDog](https://www.datadoghq.com/)

### Backup Strategy

1. **MongoDB backups**

   ```bash
   # Automated backups with mongodump
   mongodump --uri="mongodb://user:pass@host:port/db" --out=/backups/$(date +%Y%m%d)
   ```

2. **Code backups**
   - Keep repository up to date
   - Tag releases

### Updates

```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Rebuild
npm run build

# Restart service
pm2 restart praetbot
```

---

## Support

For deployment issues:

- Check [GitHub Issues](https://github.com/maniator/praetbot/issues)
- Review platform-specific documentation
- Join our Discord community (coming soon)

---

## Community

Join our Discord server (coming soon) to:

- Get help with setup and deployment
- Share your custom commands and configurations
- Report bugs and request features
- Connect with other Praetbot users and contributors
- Get notified about updates and new features

## License

This deployment guide is part of Praetbot, licensed under the MIT License.
