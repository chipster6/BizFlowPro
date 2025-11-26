#!/bin/bash
# Automated PostgreSQL backup script

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Configuration
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-30}
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql.gz"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create backup
echo "Creating backup: $BACKUP_FILE"
docker-compose exec -T postgres pg_dump -U ${POSTGRES_USER:-promanage} ${POSTGRES_DB:-promanage_db} | gzip > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "Backup created successfully"
    
    # Clean old backups
    echo "Cleaning backups older than $RETENTION_DAYS days"
    find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
    
    # List remaining backups
    echo "Current backups:"
    ls -lh "$BACKUP_DIR"/backup_*.sql.gz
else
    echo "Backup failed!"
    exit 1
fi
