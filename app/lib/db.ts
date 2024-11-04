// app/lib/db.ts
import mysql from 'mysql2/promise';

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
  throw new Error('Database configuration not found');
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verify connection
pool.getConnection()
  .then(connection => {
    // console.log('Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Failed to connect to the database:', err);
  });

export default pool;