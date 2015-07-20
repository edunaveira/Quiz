var models = require('../models/models.js');

// Autoload  - factoriza el código si ruta incluye :quizId
exports.load = function( req, res, next, quizId){
	models.Quiz.find(quizId).then(
		function(quiz){
			if(quiz){
				req.quiz = quiz;
				next();
			}else{
				next(new Error("No existe quizId=" + quizId));
			}
		}
	).catch(function(error){ next(error); });
};

//GET /quizes
exports.index = function(req, res){
	models.Quiz.findAll().then(function(quizes){
		res.render('quizes/index.ejs', { quizes: quizes });
	});
};

//GET /quizes/:id
exports.show = function(req, res){
	res.render('quizes/show', { quiz: req.quiz });
};

//GET /quizes/:id/answer
exports.answer = function(req, res){

	var validacion = validarRespuesta(req.query.respuesta, req.quiz.respuesta);

	res.render('quizes/answer', { 
		quiz: req.quiz,
		respuesta: (validacion ? "Correcto" : "Incorrecto")
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
