import { defineConfig } from "drizzle-kit";

// Build connection config from individual env vars to avoid URL encoding issues
const getDbCredentials = () => {
  // Prefer individual env vars (safer for special characters in passwords)
  if (process.env.PGHOST && process.env.PGUSER && process.env.PGPASSWORD && process.env.PGDATABASE) {
    return {
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT || '5432'),
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      ssl: false
    };
  }
  
  // Fall back to DATABASE_URL
  if (!process.env.DATABASE_URL) {
    throw new Error("Either DATABASE_URL or PGHOST/PGUSER/PGPASSWORD/PGDATABASE must be set");
  }
  
  return {
    url: process.env.DATABASE_URL,
  };
};

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: getDbCredentials(),
});
