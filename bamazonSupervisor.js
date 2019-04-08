var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");
var Table = require("cli-table");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon_DB"
});

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Products Sales by Department",
        "Create New Department",
        "exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View Products Sales by Department":
          viewSales();
          break;

        case "Create New Department":
          createDepartment();
          break;

        case "exit":
          connection.end();
          break;
      }
    });
}

runSearch();
function printDepartments(departments) {
  let table = new Table({
    head: [
      "ID",
      "Department Name",
      "Over Head Costs",
      "Product Sales",
      "Total Profit"
    ],
    colWidths: [5, 30, 35, 15, 20]
  });

  departments.forEach(
    ({
      department_id,
      department_name,
      over_head_cost,
      product_sales,
      profit
    }) => {
      table.push([
        department_id,
        department_name,
        over_head_cost,
        product_sales,
        profit
      ]);
    }
  );
  console.log(table.toString());
}

function viewSales() {
  var query = `SELECT department_id, departments.department_name, over_head_cost, SUM(product_sales) AS product_sales,SUM(product_sales) - over_head_cost AS profit FROM departments INNER JOIN products ON departments.department_name = products.department_name GROUP BY department_id `;

  connection.query(query, function(error, response) {
    if (error) throw error;
    printDepartments(response);
    runSearch();
  });
}

function createDepartment() {
  connection.query("SELECT * FROM departments", function(error, response) {
    if (error) throw error;
    inquirer
      .prompt([
        {
          name: "name",
          message: "Please enter the new department name.",
          /** Check the department name exits or not */
          validate: function(value) {
            var deparmentArray = [];
            response.forEach(department => {
              deparmentArray.push(department.department_name.toLowerCase());
            });
            if (
              deparmentArray.indexOf(value.toLowerCase()) === -1 &&
              isNaN(value) === true
            ) {
              return true;
            }
            return false;
          }
        },
        {
          name: "overhead",
          message: "Input new department overhead costs.",
          validate: function(value) {
            if (isNaN(value) === false && value > 0) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function(newDepartment) {
        connection.query(
          `INSERT INTO departments (department_name, over_head_cost) VALUES ('${
            newDepartment.name
          }', '${newDepartment.overhead}')`,

          function(error, response) {
            if (error) throw error;
            let message = `\nNew department added successfully.\n`;
            console.log(message.green.bold);
            runSearch();
          }
        );
      });
  });
}
