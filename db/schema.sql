DROP DATABASE IF EXISTS employee_career_db;
CREATE DATABASE employee_career_db;

\c employee_career_db;

CREATE TABLE departments (
  department_id SERIAL PRIMARY KEY,
  department_name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT, FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL
);

CREATE TABLE employee_data (
  employee_id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  manager_id INT,
  role_id INT, FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE SET NULL
);
