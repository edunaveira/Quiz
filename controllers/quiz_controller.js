var models = require('../models/models.js');

// Autoload  - factoriza el código si ruta incluye :quizId
exports.load = function( req, res, next, quizId){
	models.Quiz.find(
			{
				where: {id: Number(quizId)},
				include: [{model: models.Comment }]
			}
		).then(
		function(quiz){
			if(quiz){
				req.quiz = quiz;
				next();
			}else{
				next(new Error("No existe quizId=" + quizId));
			}
		}
	).catch(function(error){ next(error); });

	//models.User.find({where: {id: req.session.user.id}}).then(function(user){console.log(user);});
};

//GET /quizes
exports.index = function(req, res){
	models.Quiz.findAll().then(function(quizes){

		//Comprobamos si se ha introducido elemento de busqueda
		if (typeof(req.query.search) == "undefined") {
			res.render('quizes/index.ejs', { quizes: quizes, errors: []});
			console.log(quizes);
		}else{
			//Añadimos los caracteres comodín
			var search = "%" + req.query.search.replace(" ", "%").toLowerCase() + "%";
			//Filtramos las respuestas a mostrar
			models.Quiz.findAll(
				{
					where: ["lower(pregunta) like ?", search], 
					order: '"pregunta" ASC'
				}).then(function(quizes){
					res.render('quizes/index.ejs', { quizes: quizes, errors: []});
			});
		}
		
	});
};

//GET /quizes/:id
exports.show = function(req, res){
	res.render('quizes/show', { quiz: req.quiz , errors: []});
};

//GET /quizes/:id/answer
exports.answer = function(req, res){

	var validacion = validarRespuesta(req.query.respuesta, req.quiz.respuesta);

	res.render('quizes/answer', { 
		quiz: req.quiz,
		respuesta: (validacion ? "Correcto" : "Incorrecto"),
		errors: []
	});

};

//GET /quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build(
		{ pregunta: "Pregunta", respuesta: "Respuesta" }
	);
	res.render('quizes/new', { quiz: quiz, errors: []});
};

//POST /quizes/create
exports.create = function(req, res){
	var quiz = models.Quiz.build( req.body.quiz );

	quiz.validate().then(function(err){
		if(err){
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		}else{
			//Guardamos en la BBDD los campos
			quiz.save( {
				fields: ["pregunta", "respuesta", "tema"]
			}).then(function(){
				res.redirect('/quizes'); //Redireccionamos a la lista de preguntas
			});
		}
	});

};

//GET /quizes/:id/edit
exports.edit = function(req, res){
	var quiz = req.quiz;

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

//PUT /quizes/:id
exports.update = function(req, res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	req.quiz.validate().then(function(err){
		if(err){
			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
		}else{
			req.quiz
			.save({fields: ["pregunta", "respuesta", "tema"]})
			.then(function(){ res.redirect('/quizes'); });
		}
	});
};

//DELETE /quizes/:id
exports.destroy = function(req, res){

	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){
		next(error);
	});
	
};

//Validador de respuestas
function validarRespuesta(respuesta, correcta){

	var patt = new RegExp(correcta, "i");// "/i" Para que sea indiferente si esta en minusculas/mayusculas

	respuesta = respuesta.trim();
	if(respuesta.length !== correcta.length)
		return false;

	var validacion = patt.test(respuesta);

	return validacion;
}
