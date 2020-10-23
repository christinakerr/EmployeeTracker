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
    inquirer
        .prompt([{
            name: "selectTask",
            type: "list",
            message: "What would you like to do?",
            choices: ["Add department", "Add role", "Add employee", "View departments", "View roles", "View employees", "Update employee role", "Quit"]
        }]).then(function(answer){
            console.log(answer.selectTask);
        })
}