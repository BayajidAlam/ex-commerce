#!/bin/bash

# Simple MongoDB backup script
# Usage: ./backup.sh

DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="backup_${DATE}"

echo "Creating MongoDB backup..."

# Create backup using docker exec
docker exec ex-commerce-mongodb mongodump --authenticationDatabase admin \
  -u ${MONGO_ROOT_USERNAME:-admin} \
  -p ${MONGO_ROOT_PASSWORD:-securepassword123} \
  --db ${MONGO_DB_NAME:-ex_commerce} \
  --out /backups/${BACKUP_NAME}

# Compress the backup
docker exec ex-commerce-mongodb tar -czf /backups/${BACKUP_NAME}.tar.gz -C /backups ${BACKUP_NAME}
docker exec ex-commerce-mongodb rm -rf /backups/${BACKUP_NAME}

echo "Backup completed: ${BACKUP_NAME}.tar.gz"
