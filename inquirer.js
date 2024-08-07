const { Pool } = require("pg");
const inquirer = require("inquirer");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "business_db",
  password: "tmntKA!!9200",
});

pool.connect();

async function promptUser() {
  await inquirer
    .prompt([
      {
        type: "list",
        name: "option",
        message: "Select an option:",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.option) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
      }
    });
}
// dont show the index
const viewDepartments = async () => {
  const res = await pool.query("SELECT id, name FROM department");
  console.table(res.rows);
  promptUser();
};

const viewRoles = async () => {
  const res = await pool.query(
    "SELECT role.id, title, salary, department.name AS department FROM role JOIN department ON role.department_id = department.id"
  );
  console.table(res.rows);
  promptUser();
};

const viewEmployees = async () => {
  const res = await pool.query(
    "SELECT employee.id, first_name, last_name, title, department.name AS department, salary, manager_id FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id"
  );
  console.table(res.rows);
  promptUser();
};

const addDepartment = async () => {
  await inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name of the department:",
      },
    ])
    .then(async (answers) => {
      await pool.query("INSERT INTO department (name) VALUES ($1)", [
        answers.name,
      ]);
      promptUser();
    });
};

const addRole = async () => {
    const departments = await pool.query('SELECT id, name FROM department');
    const departmentChoices = [];
    departments.rows.forEach(department => {
        departmentChoices.push({
            name: department.name,
            value: department.id
        });
    });
    await inquirer
        .prompt([
        {
            type: "input",
            name: "title",
            message: "Enter the title of the role:",
        },
        {
            type: "input",
            name: "salary",
            message: "Enter the salary of the role:",
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'Select the department for the role:',
            choices: departmentChoices
        },
        ])
        .then(async (answers) => {
        await pool.query(
            "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)",
            [answers.title, answers.salary, answers.department_id]
        );
        promptUser();
        });
    };

module.exports = { promptUser };
