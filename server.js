const mysql = require("mysql");
const inquirer = require("inquirer");

const PORT = 3306;

const connection = mysql.createConnection({
    host: "localhost",
    port: PORT,
    user: "root",
    password: "dbpassword",
    database: "employeeDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Listening on port " + PORT)
    start();
})

function start() {
    inquirer.prompt([{
        name: "selectTask",
        type: "list",
        message: "What would you like to do?",
        choices: ["Add department", "Add role", "Add employee", "View departments", "View roles", "View employees", "Update employee role", "Quit"]
    }]).then(function (answer) {
        switch (answer.selectTask) {
            case "Add department":
                addDepartment();
                break;
            case "Add role":
                addRole();
                break;
            case "Add employee":
                addEmployee();
                break;
            case "View departments":
                viewDepartments();
                break;
            case "View roles":
                viewRoles();
                break;
            case "View employees":
                viewEmployees();
                break;
            case "Update employee role":
                updateEmployeeRole();
                break;
            case "Quit":
                connection.end();
        };
    })
}


// VIEW FUNCTIONS -------------------------------------------------------------
function viewDepartments() {
    connection.query("SELECT name FROM departments", function (err, results) {
        if (err) throw err;
        console.table(results);
        start();
    })
};

function viewRoles() {
    connection.query("SELECT title, salary, department_id FROM roles", function (err, results) {
        if (err) throw err;
        console.table(results);
        start();
    })
};

function viewEmployees() {
    connection.query("SELECT employees.id, first_name, last_name, title, salary FROM employees INNER JOIN roles ON employees.role_id=roles.id", function (err, results) {
        if (err) throw err;
        console.table(results);
        start();
    })
};

// ADD FUNCTIONS --------------------------------------------------------------

async function addDepartment() {                   // ADD DEPARTMENT
    const department = await inquirer.prompt([
        {
            name: "departmentName",
            type: "input",
            message: "Department name: "
        }
    ])
    connection.query("INSERT INTO departments (name) VALUES (?)", [department.departmentName], (err, data) => {
        if (err) throw err;
        viewDepartments();
    })
}

async function addRole() {                               // ADD ROLE
    const departments = await new Promise(resolve => {
        connection.query("SELECT * FROM departments", (err, data) => {
            if (err) throw err;
            resolve(data);
        })
    })
    let departmentNames = [];
    departments.forEach(element => {
        departmentNames.push(element.name);
    })
    const newRole = await inquirer.prompt([
        {
            name: "roleTitle",
            type: "input",
            message: "Role title: "
        },
        {
            name: "roleSalary",
            type: "input",
            message: "Role salary: "
        },
        {
            name: "roleDepartment",
            type: "list",
            message: "Role department: ",
            choices: departmentNames
        },
    ])
    const index = departmentNames.indexOf(newRole.roleDepartment);
    connection.query("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)", [newRole.roleTitle, newRole.roleSalary, departments[index].id], (err, data) => {
        if (err) throw err;
        viewRoles();
    })
}

async function addEmployee() {                         // ADD EMPLOYEE
    const roles = await new Promise(resolve => {
        connection.query("SELECT * FROM roles", (err, data) => {
            if (err) throw err;
            resolve(data);
        })
    })
    const managers = await new Promise(resolve => {
        connection.query("SELECT * FROM employees", (err, data) => {
            if (err) throw err;
            resolve(data);
        })
    })
    let roleNames = [];
    let employeeNames = [];
    roles.forEach(element => {
        roleNames.push(element.title);
    });
    managers.forEach(element => {
        employeeNames.push(element.first_name + " " + element.last_name);
    });
    employeeNames.push("N/A");
    console.log(roleNames, employeeNames);
    const newEmployee = await inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "First Name: "
        },
        {
            name: "lastName",
            type: "input",
            message: "Last Name: "
        },
        {
            name: "role",
            type: "list",
            message: "Role: ",
            choices: roleNames
        },
        {
            name: "manager",
            type: "list",
            message: "Manager: ",
            choices: employeeNames
        },
    ])
    const roleIndex = roleNames.indexOf(newEmployee.role);
    const managerIndex = employeeNames.indexOf(newEmployee.manager);

    let manager;

    if (newEmployee.manager === "N/A"){
        manager = null;
    } else {
        manager = managers[managerIndex].id;
    };

    connection.query("INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [newEmployee.firstName, newEmployee.lastName, roles[roleIndex].id, manager], (err, data) => {
        if (err) throw err;
        viewEmployees();
    })
}

// UPDATE FUNCTIONS --------------------------------------------------------------

async function updateEmployeeRole(){
    const employees = await new Promise(resolve => {
        connection.query("SELECT * FROM employees", function (err, results) {
        if (err) throw err;
        resolve(results);
        })
    })
    let employeeNames = [];
    employees.forEach(element => {
        employeeNames.push(element.first_name + " " + element.last_name);
    });
    const roles = await new Promise(resolve => {
        connection.query("SELECT * FROM roles", function (err, results) {
        if (err) throw err;
        resolve(results);
        })
    })
    let roleNames = [];
    roles.forEach(element => {
        roleNames.push(element.title);
    });


    const employeeUpdate = await inquirer.prompt([
        {
            name: "employee",
            type: "list",
            message: "Employee to update: ",
            choices: employeeNames
        },
        {
            name: "role",
            type: "list",
            message: "New role: ",
            choices: roleNames
        }
    ])
    const roleIndex = roleNames.indexOf(employeeUpdate.role);
    const employeeIndex = employeeNames.indexOf(employeeUpdate.employee);

    connection.query("UPDATE employees SET role_id = ? WHERE id = ?", [roleNames[roleIndex].id, employeeNames[employeeIndex].id], (err, data) => {
        if (err) throw err;
        viewEmployees();
    })
}