var models = require('../models/models.js');

//GET /quizes/question
exports.question  = function(req, res){
	models.Quiz.findAll().then(function (quiz){
		res.render('quizes/question', 
			{ pregunta: quiz[0].pregunta})
	});
};

//GET /quizes:id
exports.show = function(req, res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show', { quiz: quiz });
	});
};

//GET /quizes
exports.index = function(req, res){
	models.Quiz.findAll().then(function(quizes){
		res.render('quizes/index.ejs', { quizes: quizes });
	});
};

//GET /quizes:id/answer
exports.answer = function(req, res){

	models.Quiz.find(req.params.quizId).then(function(quiz){

		var validacion = validarRespuesta(req.query.respuesta, quiz.respuesta);

		if(validacion){
			res.render('quizes/answer', {
				respuesta: "Correcto",
				quiz: quiz
			});
		}else{
			res.render('quizes/answer', {
				respuesta: "Incorrecto",
				quiz: quiz
			});
		}
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
