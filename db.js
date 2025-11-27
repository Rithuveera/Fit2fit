import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === 'production';

// Database connection configuration
const connectionConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false
};

if (!process.env.DATABASE_URL) {
    console.warn('⚠️  DATABASE_URL environment variable is not set. Please set it to connect to PostgreSQL.');
}

const pool = new Pool(connectionConfig);

// Helper to query the database
export const query = (text, params) => pool.query(text, params);

// Helper to get a client (for transactions)
export const getClient = () => pool.connect();

export default {
    query,
    getClient,
    pool
};
