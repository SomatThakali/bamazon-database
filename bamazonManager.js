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

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View Products for Sale":
          viewProducts();
          break;

        case "View Low Inventory":
          viewLowInventory();
          break;

        case "Add to Inventory":
          addToInventory();
          break;

        case "Add New Product":
          //   addNewProduct();
          break;

        case "exit":
          connection.end();
          break;
      }
    });
}

function printProducts(products) {
  var table = new Table({
    head: ["ID", "Product Name", "Department", "Price", "Stock quantity"],
    colWidths: [5, 30, 30, 15, 25]
  });

  products.forEach(
    ({ item_id, product_name, department_name, price, stock_quantity }) => {
      table.push([
        item_id,
        product_name,
        department_name,
        price,
        stock_quantity
      ]);
    }
  );
  console.log(table.toString());
}

function viewProducts() {
  var query = "SELECT * FROM products";
  connection.query(query, function(err, products) {
    if (err) throw err;
    printProducts(products);
    runSearch();
  });
}

function viewLowInventory() {
  var query = "SELECT * FROM products WHERE stock_quantity < 10";
  connection.query(query, function(err, products) {
    if (err) throw err;
    printProducts(products);
    runSearch();
  });
}

// function addToInventory() {
//   inquirer
//     .prompt({
//       name: "inventory",
//       type: "input",
//       message: "Which item would you like to add?",
//       choices: [
//         "ipad",
//         "View Low Inventory",
//         "Add to Inventory",
//         "Add New Product",
//         "exit"
//       ]
//     })
//     .then(function(answer) {});
// }
