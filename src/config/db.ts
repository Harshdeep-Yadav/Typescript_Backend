import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

// Creating a connection pool for MySQL database connection
const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection
dbPool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Database connection established successfully.');
    connection.release(); // release the connection
  }
});

export default dbPool;
