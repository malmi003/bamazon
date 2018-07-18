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
    displayItems();
});

function displayItems() {
    //query each item in DB
    connection.query(
        "SELECT * FROM products", function (err, res) {
            if (err) throw err;

            //display each item in database in a list
            res.forEach(item => {
                console.log(`${item.item_id}. ${item.product_name}...$${item.price} (${item.stock_quantity} in inv)`);
            })
            itemPrompt();
        }
    );
};

function itemPrompt() {
    //prompt the user for item/quantity they'd like to purchase
    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "Enter the item number you'd like to purchase."
        },
        {
            name: "quantity",
            type: "input",
            message: "Enter the quantity of units you'd like to purchase."
        }

        //once they've responded...
    ]).then(answers => {

        //find the item in the DB that matches the id provided
        connection.query(
            "SELECT * FROM products WHERE item_id = " + answers.id, function (err, res) {
                if (err) throw err;

                //if there is enough inventory to cover purchase...
                if (res[0].stock_quantity >= answers.quantity) {
                    //update database by the number ordered
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: res[0].stock_quantity - answers.quantity
                            },
                            {
                                item_id: answers.id
                            }

                        ],
                        function (err) {
                            if (err) throw err;
                        }
                    )
                    //once database has been adjusted, alert user that order is successfully placed, display total
                    console.log("Thank you for your order. Your total comes to $" + answers.quantity * res[0].price + ". \nTo place another order, press the up-arrow followed by the Enter key.");

                    //end connection to DB
                    connection.end();

                } else {
                    //if there is not enough inventory, alert the user
                    console.log("\n\nInsufficient quantity available. Please try again.\n");

                    //and start over
                    displayItems();
                };
            }
        );
    });
};


