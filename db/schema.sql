DROP DATABASE IF EXISTS employee_life_db;
CREATE DATABASE employee_life_db;

\c employee_life_db;

CREATE TABLE employee_names (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL
);

CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);