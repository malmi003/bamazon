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

    //run function after connection is made
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
        // console.log(answer);

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
    })
}

//   * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.
function viewProducts() {
    connection.query("SELECT * from products", function (err, res) {
        if (err) throw err;

        // console.log(res);
        res.forEach(item => {
            console.log(`ID: ${item.item_id}, Item: ${item.product_name}, Price: ${item.price}, Quantity: ${item.stock_quantity}`)
        })
        returnToMenuPrompt();
    })
};

//   * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.
function viewLowInv() {
    connection.query("SELECT * FROM products where stock_quantity < 5", function (err, res) {
        if (err) throw err;

        // console.log(res);
        res.forEach(item => {
            console.log(`ID: ${item.item_id}, Item: ${item.product_name}, Price: ${item.price}, Quantity: ${item.stock_quantity}`);
        })

        returnToMenuPrompt();
    })
};

//   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.
function AddToInv() {
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
        console.log(answers);

        connection.query(
            "SELECT * FROM products WHERE item_id = " + answers.invId, function (err, res) {
                if (err) throw err;

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
                )
            })

        returnToMenuPrompt();
    });
};

//   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
function AddNewProduct() {
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
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: answers.name,
                price: answers.price,
                stock_quantity: answers.quantity,
            },
            function (err, res) {
                if (err) throw err;
                console.log("Your item was successfully added. \n")

                returnToMenuPrompt(); 
            }
        )
    })
};

function returnToMenuPrompt() {
    inquirer.prompt({
        name: "return to menu",
        type: "confirm",
        message: "Return to main menu?"
    }).then(answer => {
        // console.log(answer);
        if (answer["return to menu"]) {
            listMenuOptions();
        } else connection.end();
    })
};