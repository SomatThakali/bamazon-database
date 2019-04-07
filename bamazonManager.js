const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");
const Table = require("cli-table");

const connection = mysql.createConnection({
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
          addNewProduct();
          break;

        case "exit":
          connection.end();
          break;
      }
    });
}

/**
 * This function will print the table of products
 * @param {obj} products
 */
function printProducts(products) {
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
}

/** This function will select and prints all the product */
function viewProducts() {
  const query = "SELECT * FROM products";
  connection.query(query, function(err, products) {
    if (err) throw err;
    printProducts(products);
    runSearch();
  });
}

/** This function will prints all the product of stock quantity less than 10 */
function viewLowInventory() {
  let query = "SELECT * FROM products WHERE stock_quantity < 10";
  connection.query(query, function(err, products) {
    if (err) throw err;
    printProducts(products);
    runSearch();
  });
}

/** This function will add the quantity of the product */
function addToInventory() {
  var productName = [];
  connection.query("SELECT product_name FROM products", function(
    err,
    products
  ) {
    if (err) throw err;
    products.forEach(product => {
      productName.push(product.product_name);
    });
    // console.log(productName);
    inquirerAfterAdd(productName);
  });
}

/**
 *
 * @param {string[]} choices
 */
function inquirerAfterAdd(choices) {
  inquirer
    .prompt([
      {
        name: "action",
        type: "list",
        message: "Which item would you like to add?",
        choices: choices
      },
      {
        name: "quantity",
        type: "input",
        message: "How many units would you like to add?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      let query = `SELECT * FROM products WHERE product_name="${
        answer.action
      }"`;
      connection.query(query, function(err, res) {
        if (err) throw err;
        addQuantity(answer, res);
      });
    });
}

/** This function will add the new product */
function addNewProduct() {
  inquirer
    .prompt([
      {
        name: "item",
        type: "INPUT",
        message: "Enter the name of the product that you would like to add."
      },
      {
        name: "department",
        type: "list",
        message: "Choose the department you would like to add your product to.",
        choices: [
          "Electronics",
          "Clothing",
          "Books",
          "Appliances",
          "Video games",
          "Software",
          "Collectibles and fine Arts",
          "Baby",
          "Gift"
        ]
      },
      {
        name: "price",
        type: "input",
        message: "Enter the price for this product."
      },
      {
        name: "stock",
        type: "input",
        message: "Enter the Stock Quantity"
      }
    ])
    .then(function(answer) {
      let item = {
        product_name: answer.item,
        department_name: answer.department,
        price: answer.price,
        stock_quantity: answer.stock
      };
      connection.query("INSERT INTO Products SET ?", item, function(err) {
        if (err) throw err;
        console.log(
          ` ${item.stock_quantity} ${item.product_name} added successfully`
        );
        runSearch();
      });
    });
}

/** This function is a helper function which will add the quantity of the selected item */
function addQuantity(answer, respond) {
  let product = respond[0];

  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity:
          parseInt(product.stock_quantity) + parseInt(answer.quantity)
      },
      {
        product_name: answer.action
      }
    ],
    function(error) {
      if (error) throw error;
      let confirmMessage = `\nAdded ${answer.quantity} ${
        answer.action
      }s successfully!\n`;
      console.log(confirmMessage.bold.green);
      runSearch();
    }
  );
}
