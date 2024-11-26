import mysql, { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbPool: Pool = mysql.createPool({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
const testDatabaseConnection = async (): Promise<void> => {
  try {
    const connection = await dbPool.getConnection();
    console.log("Connected to the Database 🎊");
    connection.release();
  } catch (error) {
    console.error("Error connecting to the MySQL2 database:", error);
  }
};

testDatabaseConnection();

/**
 * A generic query function for MySQL2.
 * @param query - SQL query string
 * @param params - Parameters for the query
 * @returns Results of the query
 */
export const dbQuery = async <
  T extends RowDataPacket[] | RowDataPacket[][] | ResultSetHeader
>(
  query: string,
  params: any[] = []
): Promise<T> => {
  try {
    const [results] = await dbPool.query<T>(query, params);
    return results;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

export default dbQuery;
