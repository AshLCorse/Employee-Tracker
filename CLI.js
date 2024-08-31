const { prompt } = require("inquirer");
const db = require("./db/connection");

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database!");
  init();
});

function init() {
  prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        "View all Departments",
        "View all Roles",
        "View all Employees",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update an Employee's Role",
        "QUIT",
      ], // Include all choices for the CLI
    },
  ]).then((res) => {
    console.log(res);
    if (res.choice === "View all Departments") {
      viewAllDepartments();
    } else if (res.choice === "View all Roles") {
      viewAllRoles();
    } else if (res.choice === "View all Employees") {
      viewAllEmployees();
    } else if (res.choice === "Add a Department") {
      addDepartment();
    } else if (res.choice === "Add a Role") {
      addRole();
    } else if (res.choice === "Add an Employee") {
      addEmployee();
    } else if (res.choice === "Update an Employee's Role") {
      updateEmployeeRole();
    } else {
      console.log("Goodbye!");
      db.end();
    }
  });
}

// Create each function to run the SQL queries for each CLI choice
function viewAllDepartments() {
  // SQL Query and display role data
  db.query(`SELECT * FROM departments`, (err, { rows }) => {
    if (err) throw err;
    console.table(rows);
    init();
  });
}

function viewAllEmployees() {
  // SQL Query and display employee data
  db.query(`SELECT * FROM employee_data`, (err, { rows }) => {
    if (err) throw err;
    console.table(rows);
    init();
  });
}

function viewAllRoles() {
  // SQL Query and display role data
  db.query(`SELECT * FROM roles`, (err, { rows }) => {
    if (err) throw err;
    console.table(rows);
    init();
  });
}

function addDepartment() {
  prompt([
    {
      type: "input",
      name: "department_name",
      message: "Enter the name of the Department to add:",
    },
  ]).then((res) => {
    console.log(res);
    db.query(
      `INSERT INTO departments (department_name) VALUES ($1)`,
      [res.department_name],
      console.log("Successfully added department:", res.department_name),
      (err) => {
        console.log(err);
      }
    );
    init();
  });
}

function addRole() {
  const departments = [];
  db.query(`SELECT department_name FROM departments`, (err, { rows }) => {
    departments += rows;
  });
  prompt([
    {
      type: "input",
      name: "role_name",
      message: "Enter the name of the Role to add:",
    },
    {
      type: "input",
      name: "salary",
      message: "Enter the salary of the Role to add:",
    },
    {
      type: "list",
      name: "department_name",
      message: "Enter the Department the Role to add belongs to:",
      choices: departments,
    },
  ]).then((res) => {
    console.log(res);
    db.query(
      `INSERT INTO roles (role_name) VALUES ($1)`,
      [res.role_name],
      `INSERT INTO roles (salary) VALUES ($1)`,
      [res.salary],
      `INSERT INTO roles (department_name) VALUES ($1)`,
      [res.department_name],
      console.log(
        "Successfully added role:",
        res.role_name,
        "With salary:",
        res.salary,
        "to department:",
        res.department_name
      ),
      (err) => {
        console.log(err);
      }
    );
    init();
  });
}

function addEmployee() {
  const roles = [];
  db.query("SELECT role_name FROM roles", (err, { rows }) => {
    roles += rows;
  });
  const manager_id = [];
  db.query(
    "SELECT id FROM employee_data WHERE role_id = 1",
    (err, { rows }) => {
      manager_id += rows;
    }
  );
  prompt([
    {
      type: "input",
      name: "first_name",
      message: "Enter the first name of the Employee to add:",
    },
    {
      type: "input",
      name: "last_name",
      message: "Enter the last name of the Employee to add:",
    },
    {
      type: "list",
      name: "role_name",
      message: "Enter the Role of the Employee to add:",
      choices: roles, // Populate this with all role names
    },
    {
      type: "list",
      name: "manager_Id",
      message:
        "Enter the Id of the Manager of the Employee to add (leave blank for none):",
      choices: manager_id, // Populate this with all manager ids
    },
  ]).then((res) => {
    console.log(res);
    db.query(
      `INSERT INTO employee_data (first_name) VALUES ($1)`,
      [res.first_name],
      `INSERT INTO employee_data (last_name) VALUES ($1)`,
      [res.last_name],
      `INSERT INTO employee_data (role) VALUES ($1)`,
      [res.role_name],
      `INSERT INTO employee_data (manager_Id) VALUES ($1)`,
      [res.manager_Id],
      console.log(
        "Successfully added employee:",
        res.first_name,
        res.last_name,
        "With role:",
        res.role_name,
        "And manager Id:",
        res.manager_Id
      ),
      (err) => {
        console.log(err);
      }
    );
    init();
  });
}

function updateEmployeeRole() {
  const employee_id = [];
  db.query("SELECT employee_id FROM employee_data", (err, { rows }) => {
    employee_id += rows;
  });
  const role_name = [];
  db.query("SELECT role_name FROM roles", (err, { rows }) => {
    role_name += rows;
  });
  const manager_Id = [];
  db.query(
    "SELECT employee_id FROM employee_data WHERE role_id = 1",
    (err, { rows }) => {
      manager_Id += rows;
    }
  );
  prompt([
    {
      type: "list",
      name: "employee_Id",
      message: "Enter the Id of the Employee to update:",
      choices: employee_id, // Populate this with all employee ids
    },
    {
      type: "list",
      name: "role_name",
      message:
        "Enter the name of the new Role this Employee has achieved to update:",
      choices: role_name, // Populate this with all role names
    },
    {
      type: "list",
      name: "manager_Id",
      message:
        "Enter the Employee's new manager's Id to update (leave blank for none):",
      choices: manager_Id, // Populate this with all manager ids
    },
  ]).then((res) => {
    console.log(res);
    db.query(
      `UPDATE employee_data SET role = $1, manager_id = $2 WHERE employee_id = $3`,
      [res.employee_id, res.role_name, res.manager_Id],
      console.log(
        "Successfully updated employee with Id:",
        res.employee_id,
        "To role:",
        res.role_name,
        "And manager Id:",
        res.manager_Id
      ),
      (err) => {
        console.log(err);
      }
    );
    init();
  });
}
