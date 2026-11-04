/**
 * Initialize Turso database with schema
 * Run with: npx ts-node scripts/init-turso.ts
 */

import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";

const tursoUrl = process.env.TURSO_CONNECTION_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl || !tursoToken) {
  console.error("❌ Missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN");
  process.exit(1);
}

const db = createClient({
  url: tursoUrl,
  authToken: tursoToken,
});

async function initDatabase() {
  try {
    console.log("🔄 Connecting to Turso...");

    // Read schema file
    const schemaPath = path.join(process.cwd(), "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf-8");

    // Split into individual statements
    const statements = schema
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith("--"));

    console.log(`🔄 Running ${statements.length} SQL statements...`);

    for (const statement of statements) {
      try {
        await db.execute(statement);
        console.log(`✅ ${statement.substring(0, 50)}...`);
      } catch (error) {
        console.error(`❌ Failed: ${statement.substring(0, 50)}...`);
        console.error(error);
      }
    }

    console.log("✅ Database initialized successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
    process.exit(1);
  }
}

initDatabase();
