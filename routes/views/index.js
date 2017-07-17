var keystone = require('keystone');
//stripe integration
const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;

var stripe = require('stripe')(keySecret);
exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	view.on('post', { "action": "charge" }, function (next) {
		console.log(JSON.stringify(req.body));
		var token = req.body.stripeToken; // Using Express

		// Create a Customer:
		stripe.customers.create({
			email: "rgb92911.0.3@gmail.com",
			source: token,
		}).then(function (customer) {
			// YOUR CODE: Save the customer ID and other info in a database for later.
			console.log("customer created--"+customer.id);
			return stripe.charges.create({
				amount: 2500,
				currency: "usd",
				customer: customer.id,
			});
		}).then(function (charge) {
			// Use and save the charge info.
			console.log(charge);
			 res.send(charge);
		});

		//next()
	});
	// Render the view
	view.render('index');
};
