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

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    console.log("Welcome to bamazon, where we deliver fresh micro-greens and sprouts right to your door! Here's what we have today!");
    mainMenu()

  }) 
  
  function mainMenu() {
    //query db to get product and ID for user
    connection.query("SELECT product_name, item_id FROM products", function(err, results) {
        if (err) throw err;
        //displays results
        for (var i = 0; i<results.length; i++){
            console.log("ID: " + results[i].item_id + " - " + results[i].product_name );
        }
        inquirer
        .prompt([
            {
                message: "What is the ID of the item that you'd like to purchase?",
                type: "input",
                name: "selectedId"
            }
        ]).then(function(answer){
            console.log(answer.selectedId)
        })
    });
};