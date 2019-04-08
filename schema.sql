ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
flush privileges;
ALTER USER 'root'@'localhost' IDENTIFIED BY '';

DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100)  NOT NULL,
  department_name VARCHAR(100)  NOT NULL,
  price DECIMAL(10, 4) NOT NULL,
  stock_quantity INT NOT NULL,
  product_sales DECIMAL(10, 4)  DEFAULT 0
  PRIMARY KEY (item_id)
);


SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iPhone", "Electronics", 900, 250);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iPad", "Electronics", 1000, 200);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Nike Hoodies", "Clothing", 120, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Milkman, A novel", "Books", 10.76, 9);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("LG microwave", "Appliances", 88.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Call Duty", "Video Games", 120, 2500);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Turbo Tax", "Software", 48.99, 250);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("The Five Presidents", "Collectibles and fine Arts", 200000, 1);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pampers", "Baby", 70.98, 210);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("bamazaon gift card", "Gift", 100, 2501);


CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100)  NOT NULL,
  over_head_cost DECIMAL(10, 4) NOT NULL,
  PRIMARY KEY (item_id)
);

SELECT department_id, departments.department_name, over_head_cost, SUM(product_sales) AS product_sales, SUM(product_sales) - over_head_cost AS total_profit
FROM departments
INNER JOIN products
ON departments.department_name = products.department_name
GROUP BY department_id;