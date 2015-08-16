// Formulario de Login
exports.new = function(req, res){
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {errors: errors});
};

// Login (POST)
exports.create = function(req, res){

	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user){
//Si se produce un error lo devolvemos
		if(error){
			req.session.errors = [{"message": "Se ha producido un error: " + error }];
			res.redirect("/login");
			return;
		}

		//Crear req.session.user y guardamos los campos id y username
		//La sesión se define por la existencia de: req.session.user
		req.session.user = {id: user.id, username: user.username};

		res.redirect(req.session.redir.toString());//Redirección a path anterior a login
	});
};

//Logout
exports.destroy = function(req, res){
	delete req.session.user;
	res.redirect(req.session.redir.toString());//Redirección a path anterior a login
};
