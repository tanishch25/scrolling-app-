const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres:Pinku1234!123@db.hbyiunubrihdrrlxqcqs.supabase.co:5432/postgres';

async function runMigration() {
  const client = new Client({
    connectionString,
  });

  try {
    await client.connect();
    console.log('Connected to Supabase DB!');

    const schemaPath = path.join('C:\\Users\\tanis\\.gemini\\antigravity\\brain\\cac3d844-54ea-49bf-ac39-de61a58014bb\\schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema...');
    await client.query(schemaSql);
    console.log('Schema migration successful!');

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

runMigration();
