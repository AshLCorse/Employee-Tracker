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
  db.query(`SELECT * FROM departments`, (err, { rows }) => {
    let departments = rows.map(({ department_id, department_name }) => ({
      name: department_name,
      value: department_id,
    }));
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
        name: "department_id",
        message: "Enter the Department the Role to add belongs to:",
        choices: departments,
      },
    ]).then((res) => {
      console.log(res);
      db.query(
        `INSERT INTO roles (role_name, salary, department_id) VALUES ($1, $2, $3)`,
        [res.role_name, res.salary, res.department_id]
      )
        .then(() => {
          console.log(
            "Successfully added role:",
            res.role_name,
            "With salary:",
            res.salary,
            "to department:",
            res.department_id
          );
          init();
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
}

function addEmployee() {
  let roles = [0];
  let managers = [0];
  db.query("SELECT * FROM roles", (err, { rows }) => {
    roles = rows.map(({ role_id, role_name }) => ({
      name: role_name,
      value: role_id,
    }));
  });
  db.query("SELECT * FROM employee_data", (err, { rows }) => {
    rows.forEach((element) => {
      if (element.role_id == 1) {
        managers = rows.map(({ employee_name, employee_id }) => ({
          name: employee_name,
          value: employee_id,
        }));
      }
    });
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
        name: "manager",
        message: "Choose the Manager of the Employee you are adding:",
        choices: managers, // Populate this with all managers
      },
    ])
      .then((res) => {
        console.log(res);
        db.query(
          `INSERT INTO employee_data (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`,
          [res.first_name, res.last_name, res.role_name, res.manager]
        ).then(() => {
          console.log(
            "Successfully added employee:",
            res.first_name,
            res.last_name,
            "With role:",
            res.role_name,
            "and Manager:",
            res.manager
          );
          init();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

function updateEmployeeRole() {
  let employees = [];
  let roles = [];
  db.query("SELECT * FROM employee_data", (err, { rows }) => {
    employees = rows.map(({ employee_id, employee_name }) => ({
      name: employee_name,
      value: employee_id,
    }));
  });
  db.query("SELECT * FROM roles", (err, { rows }) => {
    roles = rows.map(({ role_id, role_name }) => ({
      name: role_name,
      value: role_id,
    }));
    prompt([
      {
        type: "list",
        name: "employee_Id",
        message: "Enter the Id of the Employee to update:",
        choices: employees, // Populate this with all employee ids
      },
      {
        type: "list",
        name: "role_name",
        message:
          "Enter the name of the new Role this Employee has achieved to update:",
        choices: roles, // Populate this with all role names
      },
    ]).then((res) => {
      console.log(res);
      db.query(`UPDATE employee_data SET role_id = $2 WHERE employee_id = $1`, [
        res.employee_id,
        res.role_name,
      ]);
      console.log(
        "Successfully updated Employee:",
        res.employee_name,
        "To role:",
        res.role_name
      );
    });
  });
  init();
}
