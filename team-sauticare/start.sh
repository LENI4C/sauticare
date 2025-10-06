#!/bin/bash

# SautiCare Startup Script
# This script starts all services for the SautiCare application

echo "🚀 Starting SautiCare Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ and try again.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed. Please install npm and try again.${NC}"
    exit 1
fi

if ! command_exists mongod; then
    echo -e "${YELLOW}⚠️  MongoDB is not installed or not in PATH. Please ensure MongoDB is running.${NC}"
fi

echo -e "${GREEN}✅ Prerequisites check completed${NC}"

# Check if ports are available
echo -e "${BLUE}Checking port availability...${NC}"

if port_in_use 5000; then
    echo -e "${YELLOW}⚠️  Port 5000 is in use. Backend may not start properly.${NC}"
fi

if port_in_use 3000; then
    echo -e "${YELLOW}⚠️  Port 3000 is in use. Frontend may not start properly.${NC}"
fi

if port_in_use 3001; then
    echo -e "${YELLOW}⚠️  Port 3001 is in use. AI service may not start properly.${NC}"
fi

echo -e "${GREEN}✅ Port check completed${NC}"

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"

# Backend dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install backend dependencies${NC}"
        exit 1
    fi
fi
cd ..

# AI dependencies
echo -e "${YELLOW}Installing AI service dependencies...${NC}"
cd ai
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install AI service dependencies${NC}"
        exit 1
    fi
fi
cd ..

# Frontend dependencies
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
        exit 1
    fi
fi
cd ..

echo -e "${GREEN}✅ Dependencies installed successfully${NC}"

# Check for environment files
echo -e "${BLUE}Checking environment configuration...${NC}"

if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  Backend .env file not found. Creating from template...${NC}"
    cp backend/env.example backend/.env
    echo -e "${YELLOW}Please edit backend/.env with your configuration${NC}"
fi

if [ ! -f "ai/.env" ]; then
    echo -e "${YELLOW}⚠️  AI service .env file not found. Creating from template...${NC}"
    cp ai/env.example ai/.env 2>/dev/null || echo "OPENAI_API_KEY=your-openai-api-key" > ai/.env
    echo -e "${YELLOW}Please edit ai/.env with your API keys${NC}"
fi

if [ ! -f "frontend/.env.local" ]; then
    echo -e "${YELLOW}⚠️  Frontend .env.local file not found. Creating...${NC}"
    echo "BACKEND_URL=http://localhost:5000" > frontend/.env.local
fi

echo -e "${GREEN}✅ Environment configuration checked${NC}"

# Create logs directory
mkdir -p logs

# Start services
echo -e "${BLUE}Starting services...${NC}"

# Function to start service in background
start_service() {
    local service_name=$1
    local service_dir=$2
    local start_command=$3
    local log_file=$4
    
    echo -e "${YELLOW}Starting $service_name...${NC}"
    cd $service_dir
    nohup $start_command > ../logs/$log_file 2>&1 &
    local pid=$!
    echo $pid > ../logs/${service_name}.pid
    cd ..
    echo -e "${GREEN}✅ $service_name started (PID: $pid)${NC}"
}

# Start Backend
start_service "Backend" "backend" "npm run dev" "backend.log"

# Start AI Service
start_service "AI Service" "ai" "npm run dev" "ai.log"

# Start Frontend
start_service "Frontend" "frontend" "npm run dev" "frontend.log"

# Wait a moment for services to start
sleep 5

# Check if services are running
echo -e "${BLUE}Checking service status...${NC}"

# Check Backend
if curl -s http://localhost:5000/health > /dev/null; then
    echo -e "${GREEN}✅ Backend is running on http://localhost:5000${NC}"
else
    echo -e "${RED}❌ Backend failed to start${NC}"
fi

# Check Frontend
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Frontend is running on http://localhost:3000${NC}"
else
    echo -e "${RED}❌ Frontend failed to start${NC}"
fi

echo -e "${GREEN}🎉 SautiCare application started successfully!${NC}"
echo -e "${BLUE}Access the application at: http://localhost:3000${NC}"
echo -e "${BLUE}Backend API: http://localhost:5000${NC}"
echo -e "${BLUE}Health Check: http://localhost:5000/health${NC}"

echo -e "${YELLOW}To stop all services, run: ./stop.sh${NC}"
echo -e "${YELLOW}To view logs, check the logs/ directory${NC}"

# Keep script running
echo -e "${BLUE}Press Ctrl+C to stop all services${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Stopping all services...${NC}"
    
    # Stop services using PID files
    for service in Backend "AI Service" Frontend; do
        if [ -f "logs/${service}.pid" ]; then
            pid=$(cat logs/${service}.pid)
            if kill -0 $pid 2>/dev/null; then
                kill $pid
                echo -e "${GREEN}✅ $service stopped${NC}"
            fi
            rm -f logs/${service}.pid
        fi
    done
    
    echo -e "${GREEN}All services stopped${NC}"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
while true; do
    sleep 1
done
