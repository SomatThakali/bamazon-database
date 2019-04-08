const inquirer = require("inquirer");
const colors = require("colors");
const Table = require("cli-table");
const connection = require("./connection");

function displayProducts() {
  const query = "SELECT * FROM products";
  connection.query(query, function(err, products) {
    if (err) throw err;

    let table = new Table({
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

    buyProducts();
  });
}

function buyProducts() {
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
      let query = `SELECT * FROM products WHERE item_id="${answer.item_id}"`;

      connection.query(query, function(err, res) {
        if (err) throw err;
        checkQuantityAndCalculatePrice(answer, res);
      });
    });
}

/**
 * This function will check the quantity and calculate the total price
 * @param {int} answer
 * @param {obj} response
 */
function checkQuantityAndCalculatePrice(answer, response) {
  let product = response[0];
  if (answer.quantity <= product.stock_quantity) {
    connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity:
            parseInt(product.stock_quantity) - parseInt(answer.quantity),
          product_sales:
            parseInt(product.price) * parseInt(answer.quantity) +
            parseInt(product.product_sales)
        },
        {
          item_id: answer.item_id
        }
      ],
      function(error) {
        if (error) throw error;
        let message = [
          `\nPlaced Order successfully!\n`,
          `The total cost is $ ${answer.quantity * product.price}.\n`
        ];
        console.log(message[0].bold.green);
        console.log(message[1].bold.green);
        connection.end();
      }
    );
  } else {
    console.log("Insufficient quantity!");
  }
}

displayProducts();
