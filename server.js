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
        switch (answer.selectTask){
            case "Add department":
                addDepartment();
                break;
            case "Add role":

                break;
            case "Add employee":

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

                break;
            case "Quit":
                connection.end();
        };
    })
}


// VIEW FUNCTIONS -------------------------------------------------------------
function viewDepartments(){
    connection.query("SELECT name FROM departments", function(err, results){
        if (err) throw err;
        console.table(results);
        start();
    })
};

function viewRoles(){
    connection.query("SELECT title, salary, department_id FROM roles", function(err, results){
        if (err) throw err;
        console.table(results);
        start();
    })
};

function viewEmployees(){
    connection.query("SELECT employees.id, first_name, last_name, title, salary FROM employees INNER JOIN roles ON employees.role_id=roles.id", function(err, results){
        if (err) throw err;
        console.table(results);
        start();
    })
};

// ADD FUNCTIONS --------------------------------------------------------------

async function addDepartment(){
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