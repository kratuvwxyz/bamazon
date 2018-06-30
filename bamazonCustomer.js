
var lineDiv = "\n===================================================================================================\n"

var inquirer = require('inquirer');

var mysql = require('mysql');

// MySQL connection
var connection = mysql.createConnection({
	host: 'localhost',
	port: 8889,

	// username
	user: 'root',

	// password
	password: 'root',
	database: 'bamazon'
});

function totalInventory() {

	connection.query('SELECT * FROM products', function(err, data) {

		if (err) throw err;
		console.log('\n\n');
		console.log('Please select Product from Item ID #: ');
		console.log(lineDiv);

		var strOut = '';
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Item ID: ' + data[i].item_id + '  ||  ';
			strOut += 'Product Name: ' + data[i].product_name + '  ||  ';
			strOut += 'Department: ' + data[i].department_name + '  ||  ';
			strOut += 'Price: $' + data[i].price + '\n';

			console.log(strOut);
		}

	  	console.log(lineDiv);

	  	customerPurchase();
	})
}

function customerPurchase() {

	inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'Enter Item ID: # of the product that you would like to buy.',
			filter: Number
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'how many units of the product that you would like to buy?',
			filter: Number
		}
	]).then(function(input) {
		var item = input.item_id;
		
		var quantity = input.quantity;

		connection.query("SELECT * FROM products WHERE ?", {item_id: item}, function(err, data) {
			if (err) throw err;

			if (data.length === 0) {
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
				totalInventory();

			} else {
				var productData = data[0];

				if (quantity <= productData.stock_quantity) {
										
					var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;
					connection.query(updateQueryStr, function(err, data) {
						if (err) throw err;

						console.log('Your oder has been placed! Your total is $' + productData.price * quantity);
						console.log('Thank you!');
						console.log(lineDiv);

						// End the database connection
						connection.end();
					})
				} else {
					console.log('Insufficient quantity!');
					console.log(lineDiv);

					totalInventory();
				}
			}
		})
	})
}


function runBamazon() {

totalInventory();

}

runBamazon();