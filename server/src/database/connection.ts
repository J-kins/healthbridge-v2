import mysql from 'mysql2/promise';
import pg from 'pg';
import 'dotenv/config';

const DB_TYPE = process.env.DB_TYPE || 'mysql';

// MySQL Connection Pool
let mysqlPool: mysql.Pool | null = null;

// PostgreSQL Client
let pgClient: pg.Client | null = null;

async function getMysqlConnection(): Promise<mysql.Connection> {
  if (!mysqlPool) {
    mysqlPool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DB || 'healthbridge',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return mysqlPool.getConnection();
}

async function getPostgresConnection(): Promise<pg.Client> {
  if (!pgClient) {
    pgClient = new pg.Client({
      host: process.env.POSTGRES_HOST || 'localhost',
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'healthbridge',
      port: parseInt(process.env.POSTGRES_PORT || '5432')
    });
    await pgClient.connect();
  }
  return pgClient;
}

export async function query(sql: string, values?: any[]): Promise<any> {
  if (DB_TYPE === 'postgres') {
    const client = await getPostgresConnection();
    const result = await client.query(sql, values);
    return result.rows;
  } else {
    const conn = await getMysqlConnection();
    try {
      const [rows] = await conn.execute(sql, values);
      return rows;
    } finally {
      conn.release();
    }
  }
}

export async function queryOne(sql: string, values?: any[]): Promise<any> {
  const rows = await query(sql, values);
  return rows && rows.length > 0 ? rows[0] : null;
}

export async function execute(sql: string, values?: any[]): Promise<any> {
  return query(sql, values);
}

export async function closeConnections(): Promise<void> {
  if (mysqlPool) {
    await mysqlPool.end();
    mysqlPool = null;
  }
  if (pgClient) {
    await pgClient.end();
    pgClient = null;
  }
}
