const { Pool } = require('pg');
const inquirer = require('inquirer');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'business_db',
    password: 'tmntKA!!9200'
});

pool.connect();

async function promptUser() {
    await inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'Select an option:',
            choices: [  'View all departments', 
                        'View all roles', 
                        'View all employees', 
                        'Add a department', 
                        'Add a role', 
                        'Add an employee', 
                        'Update an employee role']
        }
    ])
    .then(answers => {
        switch (answers.option) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
        }
    });
}
// dont show the index
const viewDepartments = async () => {
    const res = await pool.query('SELECT id, name FROM department');
    console.table(res.rows);
    promptUser();
}

const viewRoles = async () => {
    const res = await pool.query('SELECT id, title, salary FROM role');
    console.table(res.rows);
    promptUser();
}

const viewEmployees = async () => {
    const res = await pool.query('SELECT id, first_name, last_name FROM employee');
    console.table(res.rows);
    promptUser();
}


module.exports = { promptUser };