/**
 * Turso database client
 * Connects to LibSQL database at turso.tech
 */

import { createClient } from "@libsql/client";

// Get credentials from environment
const tursoUrl = process.env.TURSO_CONNECTION_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl || !tursoToken) {
  throw new Error(
    "Missing Turso credentials. Set TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN in .env"
  );
}

export const db = createClient({
  url: tursoUrl,
  authToken: tursoToken,
});

// Type helpers
export type ExecuteResult = Awaited<ReturnType<typeof db.execute>>;
export type Row = ExecuteResult["rows"][number];
