export const APP_CONFIG = {
  DB_NAME: 'database.sqlite',
  ENCRYPTION_ALGORITHM: 'AES-256-GCM',
  LOG_RETENTION_DAYS: 90,
  ROLES: {
    ADMIN: 'Admin',
    STAFF: 'Staff',
    AUDITOR: 'Auditor'
  },
  PERMISSIONS: {
    ADMIN: 'all',
    STAFF: 'customers,vehicles,services',
    AUDITOR: 'logs'
  }
};
