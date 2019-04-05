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

function displayProducts() {
  var query = "SELECT * FROM products";
  connection.query(query, function(err, products) {
    if (err) throw err;

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

    productSearch();
  });
}

function productSearch() {
  inquirer
    .prompt([
      {
        name: "item_id",
        type: "input",
        message: "Enter the ID of the product you would like to buy?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "quantity",
        type: "input",
        message: "How many units would you like to buy?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      var query = `SELECT * FROM products WHERE item_id="${answer.item_id}"`;

      connection.query(query, function(err, res) {
        if (err) throw err;
        checkQuantityAndCalculatePrice(answer, res);
      });
    });
}

/**
 * This function will check the quantity and calculate the total price
 * @param {int} answer
 * @param {obj} respond
 */
function checkQuantityAndCalculatePrice(answer, respond) {
  var product = respond[0];
  if (answer.quantity <= product.stock_quantity) {
    connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity: product.stock_quantity - answer.quantity
        },
        {
          item_id: answer.item_id
        }
      ],
      function(error) {
        if (error) throw error;
        console.log("Placed Order successfully!");
        console.log(`The total cost is $ ${answer.quantity * product.price}.`);
        connection.end();
      }
    );
  } else {
    console.log("Insufficient quantity!");
  }
}
displayProducts();
