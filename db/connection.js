const { Pool } = require(`pg`);

const pool = new Pool({
  host: `localhost`,
  user: `postgres`,
  password: `Joth2Roan7`,
  database: `employee_career_db`,
  port: 5432,
});

module.exports = pool;
