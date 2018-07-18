var inquirer = require('inquirer');
var mysql = require('mysql');


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
    console.log("connected as id " + connection.threadId);
    // run the start function after the connection is made to prompt the user
    displayItems();
});

function displayItems() {
    connection.query(
        "SELECT * FROM products", function (err, res) {
            if (err) throw err;
            // console.log(res);
            res.forEach(item => {
                console.log(`${item.item_id}. ${item.product_name}...$${item.price}`);
            })
            itemPrompt();
        }
    )
}

function itemPrompt() {
    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "Enter the ID of the item you'd like to purchase."
        },
        {
            name: "quantity",
            type: "input",
            message: "Enter the number of units you'd like to purchase."
        }
    ]).then(answers => {
        console.log(answers);
    });

    connection.end();
}

