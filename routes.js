module.exports = function(app,io){
	app.get('/', function(req, res){
		res.render('chat.html');
	});

	app.get('/:id', function(req,res){
		var id = req.params.id;
		res.render('chat.html');
	});
};
