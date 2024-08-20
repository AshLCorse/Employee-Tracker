const { prompt } = require("inquirer");
const db = require("./db/connection");

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database!");
});

init();

function init() {
  prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: ["View All Employees", "View All Roles", "QUIT"], // Include all choices for the CLI
    },
  ]).then((res) => {
    console.log(res);
    if (res.choice === "View All Employees") {
      viewAllEmployees();
    } else if (res.choice === "View All Roles") {
      viewAllRoles();
    }
  });
}

// Create each function to run the SQL queries for each CLI choice
function viewAllEmployees() {
  // SQL Query and display employee data
  console.log(`test`);
  db.query(`SELECT * FROM employee_names`, (err, { rows }) => {
    if (err) throw err;
    console.table(rows);
    init();
  });
}

function viewAllRoles() {
  // SQL Query and display role data
}
