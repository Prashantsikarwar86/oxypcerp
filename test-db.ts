import 'dotenv/config';
import { Pool } from 'pg';

async function testConnection() {
  console.log('🔌 Attempting to connect to PostgreSQL (default postgres database)...');
  console.log(`Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`Port: ${process.env.DB_PORT || '5432'}`);
  console.log(`User: ${process.env.DB_USER || 'postgres'}`);
  
  let client;
  
  try {
    const pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: 'postgres',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
    });
    
    client = await pool.connect();
    console.log('\n✅ Successfully connected to PostgreSQL!');
    
    const result = await client.query('SELECT NOW()');
    console.log('Current time from database:', result.rows[0].now);
    
    // Check if oxypc_erp database exists
    const dbCheck = await client.query("SELECT 1 FROM pg_database WHERE datname='oxypc_erp'");
    if (dbCheck.rows.length === 0) {
      console.log('\n⚠️  Database "oxypc_erp" does not exist!');
      console.log('Creating database "oxypc_erp"...');
      await client.query('CREATE DATABASE oxypc_erp');
      console.log('✅ Database "oxypc_erp" created successfully!');
    } else {
      console.log('\n✅ Database "oxypc_erp" already exists!');
    }
    
    client.release();
    await pool.end();
    console.log('\n✅ Connection test completed!');
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Make sure PostgreSQL is running on port 5432!');
    } else if (error.code === '28P01') {
      console.error('\n💡 Invalid password! Please double-check your PostgreSQL password!');
    }
    process.exit(1);
  }
}

testConnection();
