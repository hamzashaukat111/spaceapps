#!/bin/bash

docker stop exoplanet-api 2>/dev/null
docker rm exoplanet-api 2>/dev/null

echo "Starting container..."
docker run -d \
    --name exoplanet-api \
    -p 8000:8000 \
    exoplanet-api:latest

echo "Container started!"
echo "Logs:"
sleep 2
docker logs -f exoplanet-api
