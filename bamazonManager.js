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
        console.log(answer);

        switch(answer) {
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
    
    //will likely need to move
    connection.end();
}

//   * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.
function viewProducts() {
    
};

//   * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.
function viewLowInv() {

};

//   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.
function AddToInv() {

};

//   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
function AddNewProduct() {

};