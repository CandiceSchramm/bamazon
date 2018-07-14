var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});


//we're gonna store the row in here
var chosenItem;
var ozRequested;
var ozAfterOrder;




connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    console.log("Welcome to bamazon, where we deliver fresh micro-greens and sprouts right to your door! Here's what we have today!");
    mainMenu()

})


function mainMenu() {
    //query db to get product and ID for user
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        //displays results
        for (var i = 0; i < results.length; i++) {
            console.log("ID: " + results[i].item_id + " - " + results[i].product_name);
        }
        inquirer
            .prompt([
                {
                    message: "What is the ID of the item that you'd like to purchase?",
                    type: "input",
                    name: "selectedId"
                }
            ]).then(function (answer) {
                //loop through DB and find the row where the id matches user input
                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_id == answer.selectedId) {
                        //when it matches store it!
                        chosenItem = results[i];
                    }
                }
                placeOrder()
            });
    });
};

function placeOrder() {
    inquirer
        .prompt([
            {
                message: "How many oz would you like to purchase?",
                type: "input",
                name: "ozRequested"
            }
        ]).then(function (answer) {
            ozRequested = answer.ozRequested;
            checkInventory();
        })
}

function checkInventory() {
    connection.query("SELECT ounces_in_stock FROM products WHERE item_id=?", [chosenItem.item_id], function (err, results) {
        if (err) throw err;
        //if we don't have enought in stock, tell user we don't have enough
        if (results[0].ounces_in_stock < ozRequested) {
            console.log("I'm sorry we only have " + results[0].ounces_in_stock + " ounces left in stock!");
        }
        //else fulfill order
        else {
            ozAfterOrder = (results[0].ounces_in_stock - ozRequested);
            fulfillOrder();
        }
    });
};

function fulfillOrder() {
    connection.query("UPDATE products SET ? WHERE ?", [{ounces_in_stock:ozAfterOrder},{item_id:chosenItem.item_id}], function (err, results) {
        if (err) throw err;
        console.log("Thank you for your order!");
    });
}