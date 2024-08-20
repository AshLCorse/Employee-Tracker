const { Pool } = require(`pg`);

const pool = new Pool({
  host: `localhost`,
  user: `postgres`,
  password: `Joth2Roan7`,
  database: `employee_life_db`,
  port: 3001,
});

module.exports = pool;
