#!/bin/bash

set -e

echo "Building Docker image..."

IMAGE_NAME="exoplanet-api"
IMAGE_TAG="latest"

if [ ! -d "Models" ]; then
    echo "Error: Models directory not found!"
    exit 1
fi

MODEL_COUNT=$(ls -1 Models/*.{cbm,pkl} 2>/dev/null | wc -l)
echo "Found $MODEL_COUNT model files"

if [ "$MODEL_COUNT" -lt 6 ]; then
    echo "Warning: Expected 6 model files, found $MODEL_COUNT"
    read -p "Continue? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

docker build -t $IMAGE_NAME:$IMAGE_TAG .

if [ $? -eq 0 ]; then
    echo "Build successful!"
    echo "Run: docker run -p 8000:8000 $IMAGE_NAME:$IMAGE_TAG"
else
    echo "Build failed!"
    exit 1
fi
