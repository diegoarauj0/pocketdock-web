export const LOCK_CONSTANT = {
  SQL: {
    TRY_ACQUIRE: "SELECT pg_try_advisory_lock(hashtextextended($1, 0)) AS acquired",
    RELEASE: "SELECT pg_advisory_unlock(hashtextextended($1, 0)) AS released",
  },
} as const;
