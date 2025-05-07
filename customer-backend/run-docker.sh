#!/bin/bash

docker build -t customer-backend -f docker/Dockerfile .
docker run -p 3001:3001 --name customer-backend --network="host" customer-backend
