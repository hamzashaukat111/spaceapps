# Exoplanet Classification API

Production ML API for exoplanet classification using CatBoost + TabNet ensemble.

## Quick Start

```bash
# Build image
./build.sh

# Run container
./run-local.sh

# Test API
curl http://localhost:8000/health
```

## API Documentation

Visit http://localhost:8000/docs for interactive API documentation.

## Endpoints

- `GET /` - Health check
- `GET /health` - Detailed health status
- `GET /info` - Model information
- `POST /predict` - Single prediction
- `POST /predict/batch` - Batch predictions

## Example Request

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d @example_request.json
```

## Docker Commands

```bash
# Build
docker build -t exoplanet-api .

# Run
docker run -p 8000:8000 exoplanet-api

# Or use docker-compose
docker-compose up
```

## Azure Deployment

```bash
./deploy-azure.sh
```

## Files

- `app.py` - FastAPI application
- `requirements.txt` - Dependencies
- `Dockerfile` - Container configuration
- `docker-compose.yml` - Docker Compose setup
- `build.sh` - Build script
- `run-local.sh` - Run script
- `deploy-azure.sh` - Azure deployment
- `Models/` - Trained models (6 files)
- `example_request.json` - Sample request
