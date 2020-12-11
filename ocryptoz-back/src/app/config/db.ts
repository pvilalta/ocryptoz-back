import { Pool } from 'pg';

const db = new Pool({
    database: process.env.PGDATABASE
});

export default db