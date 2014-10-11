module.exports = function(app,io){
	app.get('/', function(req, res){
		console.log("Got into the routes!");
		res.render('index');
	});
};
