const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres.welwnhzptdgcgqhpurpp:Abc_gian2026@aws-1-us-east-2.pooler.supabase.com:5432/postgres",

  ssl: {
    rejectUnauthorized: false,
  },
});

const dbWrapper = {
  query: async function (text, params) {
    return pool.query(text, params);
  },

  getConnection: async function () {
    return await pool.connect();
  },
};

module.exports = dbWrapper;
