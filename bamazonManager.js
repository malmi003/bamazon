var inquirer = require('inquirer');
var mysql = require('mysql');

//create path to connect to DB
var connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bamazon_DB'
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;

    //run function after connection is made, lists menu options
    listMenuOptions();
});

function listMenuOptions() {
    //prompt user for desired function
    inquirer.prompt(
        {
            name: "menuOptions",
            type: "list",
            message: "\nPlease select from the following options:",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ).then(answer => {
        //switch statement, takes selected option and runs corresponding function
        switch (answer.menuOptions) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowInv();
                break;
            case "Add to Inventory":
                AddToInv();
                break;
            case "Add New Product":
                AddNewProduct();
                break;
        }
    });
};

//if select `View Products for Sale`, the app lists every available item
function viewProducts() {
    //query DB
    connection.query("SELECT * from products", function (err, res) {
        if (err) throw err;

        // res returns array, below consoles each product available for purchase 
        res.forEach(item => {
            console.log(`ID: ${item.item_id}, Item: ${item.product_name}, Price: ${item.price}, Quantity: ${item.stock_quantity}`);
        });
        //return to menu or close DB connection
        returnToMenuPrompt();
    });
};

//if select `View Low Inventory`, lists all items with an inventory count lower than five.
function viewLowInv() {
    // query DB
    connection.query("SELECT * FROM products where stock_quantity < 5", function (err, res) {
        if (err) throw err;

        // res returns array, below consoles each product w/ inv less than 5
        res.forEach(item => {
            console.log(`ID: ${item.item_id}, Item: ${item.product_name}, Price: ${item.price}, Quantity: ${item.stock_quantity}`);
        });
        //return to menu or close DB connection
        returnToMenuPrompt();
    });
};

//If select `Add to Inventory`, displays prompt to "add more" of any item currently in the store
function AddToInv() {
    //asks which item you'd like to change inv and by how much
    inquirer.prompt([
        {
            name: "invId",
            type: "input",
            message: "Enter the ID number of the item you'd like to update."

        },
        {
            name: "quantAdj",
            type: "input",
            message: "Enter the quantity you'd like to add."
        }
    ]).then(answers => {
        // query DB for the item that matches the requested ID
        connection.query(
            "SELECT * FROM products WHERE item_id = " + answers.invId, function (err, res) {
                if (err) throw err;

                //then updates that products inv
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: parseFloat(res[0].stock_quantity) + parseFloat(answers.quantAdj)
                        },
                        {
                            item_id: answers.invId
                        }
                    ],
                    function (err) {
                        if (err) throw err;
                    }
                );
            });
        //return to menu or close DB connection
        returnToMenuPrompt();
    });
};

//If selects `Add New Product`, allows the manager to add a completely new product to the store
function AddNewProduct() {
    //asks for the info necessary to add the item
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Enter name of the new item:"
        },
        {
            name: "price",
            type: "input",
            message: "Enter the price of the new item (omit $ sign):"
        },
        {
            name: "quantity",
            type: "input",
            message: "Enter starting stock quantity of the new item:"
        },
    ]).then(answers => {
        //adds item to DB
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: answers.name,
                price: answers.price,
                stock_quantity: answers.quantity,
            },
            //consoles item was successfully added
            function (err, res) {
                if (err) throw err;
                console.log("Your item was successfully added. \n")
                //return to menu or close DB connection
                returnToMenuPrompt();
            }
        );
    });
};
//function to return to main menu or close connection
function returnToMenuPrompt() {
    //prompts the user to return to menu
    inquirer.prompt({
        name: "return to menu",
        type: "confirm",
        message: "Return to main menu?"
    }).then(answer => {
        //if yes, list menu options
        if (answer["return to menu"]) {
            listMenuOptions();

            //if no, close DB connection
        } else connection.end();
    });
};