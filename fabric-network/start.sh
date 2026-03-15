#!/bin/bash

# Bring down network first
docker-compose down -v --remove-orphans

# Start the network
docker-compose up -d

echo "Waiting for the network to start..."
sleep 5

docker ps
