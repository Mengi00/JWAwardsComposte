import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Build connection config from individual env vars to avoid URL encoding issues
const getPoolConfig = () => {
  // Prefer individual env vars (safer for special characters in passwords)
  if (process.env.PGHOST && process.env.PGUSER && process.env.PGPASSWORD && process.env.PGDATABASE) {
    return {
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT || '5432'),
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      // Only use SSL for external databases (not local Docker postgres)
      ssl: process.env.PGHOST !== 'postgres' && process.env.PGHOST !== 'localhost' && process.env.PGHOST !== '127.0.0.1'
        ? { rejectUnauthorized: false }
        : false
    };
  }
  
  // Fall back to DATABASE_URL
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "Either DATABASE_URL or PGHOST/PGUSER/PGPASSWORD/PGDATABASE must be set",
    );
  }
  
  return {
    connectionString: process.env.DATABASE_URL,
    // Only use SSL for external databases
    ssl: process.env.PGHOST !== 'postgres' && process.env.PGHOST !== 'localhost' && process.env.PGHOST !== '127.0.0.1'
      ? { rejectUnauthorized: false }
      : false
  };
};

export const pool = new Pool(getPoolConfig());

export const db = drizzle(pool, { schema });
