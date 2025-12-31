#!/bin/bash
cd /home/kavia/workspace/code-generation/ice-cream-store-showcase-194887-194896/ice_cream_store_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

