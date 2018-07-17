DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NULL,
    price DEC (10,2) NULL,
    stock_quantity INT (10) NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("hose", "garden_equipment", 14, 100), 
("pre-made pizza crust", "grocery", 2, 200), 
("slacks", "clothing", 45, 50), 
("chisel set", "hand_tools", 150, 150), 
("diamond sharpening stone", "hand_tools", 50, 200), 
("shovel", "garden_equipment", 35, 125), 
("puzzle themed book marks", "office", .25, 5000), 
("wizard wand", "toys_and_games", 25, 175), 
("trowel", "garden_equipment", 25, 300), 
("pizza cutter", "grocery_accessories", 15, 250);

SELECT * FROM products;