#!/usr/bin/env bash
# scripts/backup-postgres.sh
# Automated PostgreSQL Daily Backup & Rotation Script for Nihongo Nakama

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/nihongo_nakama}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/nihongo_db_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=14

mkdir -p "${BACKUP_DIR}"

echo "[INFO] Starting database backup at $(date)..."

# Perform backup with gzip compression
docker exec -t nihongo_postgres pg_dump -U nihongo_user nihongo_nakama_db | gzip > "${BACKUP_FILE}"

echo "[INFO] Backup successfully written to ${BACKUP_FILE} ($(du -h "${BACKUP_FILE}" | cut -f1))"

# Rotate backups older than retention window
echo "[INFO] Cleaning backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -type f -name "nihongo_db_*.sql.gz" -mtime +${RETENTION_DAYS} -delete

echo "[INFO] Backup and retention cycle completed."
