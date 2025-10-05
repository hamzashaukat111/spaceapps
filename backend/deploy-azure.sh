#!/bin/bash

set -e

RESOURCE_GROUP="exoplanet-rg"
LOCATION="eastus"
ACR_NAME="hamzaexoplanetacr1006"
CONTAINER_APP_NAME="exoplanet-api"
CONTAINER_ENV_NAME="exoplanet-env"
IMAGE_NAME="exoplanet-api"
IMAGE_TAG="v1"

echo "Azure Deployment"

if ! command -v az &> /dev/null; then
    echo "Azure CLI not found"
    exit 1
fi

az account show &> /dev/null || az login

echo "Creating resource group..."
az group create \
    --name $RESOURCE_GROUP \
    --location $LOCATION \
    --output table

echo "Creating container registry..."
az acr create \
    --resource-group $RESOURCE_GROUP \
    --name $ACR_NAME \
    --sku Basic \
    --admin-enabled true \
    --output table

echo "Building and pushing image..."
az acr build \
    --registry $ACR_NAME \
    --image $IMAGE_NAME:$IMAGE_TAG \
    --file Dockerfile \
    .

echo "Creating container environment..."
az containerapp env create \
    --name $CONTAINER_ENV_NAME \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --output table

echo "Deploying container app..."
az containerapp create \
    --name $CONTAINER_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --environment $CONTAINER_ENV_NAME \
    --image ${ACR_NAME}.azurecr.io/${IMAGE_NAME}:${IMAGE_TAG} \
    --target-port 8000 \
    --ingress external \
    --registry-server ${ACR_NAME}.azurecr.io \
    --cpu 1 \
    --memory 2Gi \
    --min-replicas 0 \
    --max-replicas 10 \
    --query properties.configuration.ingress.fqdn \
    --output table

APP_URL=$(az containerapp show \
    --name $CONTAINER_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --query properties.configuration.ingress.fqdn \
    --output tsv)

echo "Deployment complete!"
echo "API URL: https://${APP_URL}"
echo "Docs: https://${APP_URL}/docs"
