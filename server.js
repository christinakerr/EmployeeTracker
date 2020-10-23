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
                console.log(answer.selectTask)
                break;
            case "Add role":
                console.log(answer.selectTask)
                break;
            case "Add employee":
                console.log(answer.selectTask)
                break;
            case "View departments":
                console.log(answer.selectTask)
                viewDepartments();
                break;
            case "View roles":
                console.log(answer.selectTask)
                break;
            case "View employees":
                console.log(answer.selectTask)
                break;
            case "Update employee role":
                console.log(answer.selectTask)
                break;
            case "Quit":
                connection.end();
        }
        console.log(answer.selectTask);
    })
}

function viewDepartments(){
    connection.query("SELECT name FROM departments", function(err, results){
        if (err) throw err;
        console.table(results);
    })
}