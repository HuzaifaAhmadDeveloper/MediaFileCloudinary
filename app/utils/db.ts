import { Pool } from "pg";

const portNumber = process.env.PORT_NUMBER ? parseInt(process.env.PORT_NUMBER, 10) : 5432; // Default to port 5432 if undefined

export const pool = new Pool({
  user: process.env.USER_NAME,
  host: process.env.HOST_NAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: portNumber
});

export default async function dbConnect() {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    console.log("Connected to database.", result.rows);
  } catch (error: any) {
    console.error("Error in Connection/Query execution", error.stack);
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Optional: Close the pool when the application exits
process.on('exit', () => {
  pool.end(() => {
    console.log('Pool has ended');
  });
});
