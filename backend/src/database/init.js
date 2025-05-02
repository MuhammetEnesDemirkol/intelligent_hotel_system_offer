const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, "schema.sql");
    const schemaSQL = fs.readFileSync(schemaPath, "utf8");

    await client.query("BEGIN");
    await client.query(schemaSQL);
    await client.query("COMMIT");

    console.log("Database initialized successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error initializing database:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the initialization
initializeDatabase()
  .then(() => {
    console.log("Database initialization completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Database initialization failed:", error);
    process.exit(1);
  });
