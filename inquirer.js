const { Pool } = require("pg");
const inquirer = require("inquirer");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "business_db",
  password: "tmntKA!!9200",
});

pool.connect();
// main menu
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
    // switch statement to handle the different options
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
// 
const viewDepartments = async () => {
  const res = await pool.query("SELECT id, name FROM department");
  console.table(res.rows);
  promptUser();
};

const viewRoles = async () => {
    const res = await pool.query(
        `SELECT
            role.id,
            role.title,
            department.name AS department,
            role.salary
        FROM role
        LEFT JOIN department ON role.department_id = department.id`
    );
    console.table(res.rows);
    promptUser();
}

const viewEmployees = async () => {
    const res = await pool.query(
      `SELECT 
        employee.id, 
        employee.first_name, 
        employee.last_name, 
        role.title, 
        department.name AS department, 
        role.salary, 
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
      FROM employee 
      LEFT JOIN role ON employee.role_id = role.id 
      LEFT JOIN department ON role.department_id = department.id 
      LEFT JOIN employee manager ON employee.manager_id = manager.id`
    );
    console.table(res.rows);
    promptUser();
};

// add department
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

// add role
const addRole = async () => {
  // get departments  
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

// add employee
const addEmployee = async () => {
  // get roles  
  const roles = await pool.query('SELECT id, title FROM role');
    const roleChoices = [];
    roles.rows.forEach(role => {
        roleChoices.push({
            name: role.title,
            value: role.id
        });
    });
    // get managers
    const managers = await pool.query('SELECT id, first_name, last_name FROM employee');
    const managerChoices = [];
    managers.rows.forEach(manager => {
        managerChoices.push({
            name: `${manager.first_name} ${manager.last_name}`,
            value: manager.id
        });
    });
    // add option for no manager
    managerChoices.push({ name: 'None', value: null });

    await inquirer
        .prompt([
        {
            type: "input",
            name: "first_name",
            message: "Enter the employee's first name:",
        },
        {
            type: "input",
            name: "last_name",
            message: "Enter the employee's last name:",
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the role for the employee:',
            choices: roleChoices
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Select the manager for the employee:',
            choices: managerChoices
        }
        ])
        .then(async (answers) => {
        await pool.query(
            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
            [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]
        );
        promptUser();
        });
};

// update employee role
const updateEmployeeRole = async () => {
  // get employees  
  const employees = await pool.query('SELECT id, first_name, last_name FROM employee');
    const employeeChoices = [];
    employees.rows.forEach(employee => {
        employeeChoices.push({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        });
    });
    // get roles
    const roles = await pool.query('SELECT id, title FROM role');
    const roleChoices = [];
    roles.rows.forEach(role => {
        roleChoices.push({
            name: role.title,
            value: role.id
        });
    });

    await inquirer
        .prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Select the employee to update:',
            choices: employeeChoices
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the new role for the employee:',
            choices: roleChoices
        }
        ])
        .then(async (answers) => {
        await pool.query(
            "UPDATE employee SET role_id = $1 WHERE id = $2",
            [answers.role_id, answers.employee_id]
        );
        promptUser();
        });
};

module.exports = { promptUser };
