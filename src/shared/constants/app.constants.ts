export const APP_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },
  CACHE: {
    DEFAULT_TTL: 300, // 5 minutes in seconds
    USER_TTL: 600, // 10 minutes
  },
  QUEUE: {
    EMAIL: 'email-queue',
    NOTIFICATION: 'notification-queue',
  },
} as const;
