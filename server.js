const mysql = require("mysql");
const inquirer = require("inquirer");
const { start } = require("repl");

const PORT = 3306;

const connection = mysql.createConnection({
    host: "localhost",
    port: PORT,
    user: "root",
    password: "dbpassword",
    database: "employeeDB"
});

connection.connect(function(err){
    if (err) throw err;
    console.log("Listening on port " + PORT)
})