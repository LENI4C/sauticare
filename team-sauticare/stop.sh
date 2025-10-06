#!/bin/bash

# SautiCare Stop Script
# This script stops all SautiCare services

echo "🛑 Stopping SautiCare Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to stop service
stop_service() {
    local service_name=$1
    local pid_file="logs/${service_name}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            echo -e "${YELLOW}Stopping $service_name (PID: $pid)...${NC}"
            kill "$pid"
            
            # Wait for graceful shutdown
            local count=0
            while kill -0 "$pid" 2>/dev/null && [ $count -lt 10 ]; do
                sleep 1
                count=$((count + 1))
            done
            
            # Force kill if still running
            if kill -0 "$pid" 2>/dev/null; then
                echo -e "${YELLOW}Force stopping $service_name...${NC}"
                kill -9 "$pid"
            fi
            
            echo -e "${GREEN}✅ $service_name stopped${NC}"
        else
            echo -e "${YELLOW}⚠️  $service_name was not running${NC}"
        fi
        rm -f "$pid_file"
    else
        echo -e "${YELLOW}⚠️  No PID file found for $service_name${NC}"
    fi
}

# Stop all services
echo -e "${BLUE}Stopping services...${NC}"

stop_service "Backend"
stop_service "AI Service"
stop_service "Frontend"

# Also kill any remaining Node.js processes that might be related
echo -e "${BLUE}Cleaning up any remaining processes...${NC}"

# Kill processes by port
for port in 3000 3001 5000; do
    local pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo -e "${YELLOW}Killing process on port $port (PID: $pid)...${NC}"
        kill -9 "$pid" 2>/dev/null
    fi
done

echo -e "${GREEN}🎉 All SautiCare services stopped successfully!${NC}"

# Optional: Clean up log files
read -p "Do you want to clean up log files? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Cleaning up log files...${NC}"
    rm -f logs/*.log
    rm -f logs/*.pid
    echo -e "${GREEN}✅ Log files cleaned up${NC}"
fi

echo -e "${BLUE}To start the application again, run: ./start.sh${NC}"
