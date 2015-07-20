var models = require('../models/models.js');

//GET /quizes/question
exports.question  = function(req, res){
	models.Quiz.findAll().success(function (quiz){
		res.render('quizes/question', 
			{ pregunta: quiz[0].pregunta})
	});
};

//GET /quizes/answer
exports.answer = function(req, res){
/* TODO: seguir utilizando expresiones regulares???
	var respuesta = req.query.respuesta;

    var patt = new RegExp(/roma/i);// "/i" Para que sea indeferente si esta en minusculas/mayusculas
    var validacion = patt.test(respuesta);

	if(validacion){
		res.render('quizes/answer', {respuesta: "Correcto"});
	}else{
		res.render('quizes/answer', {respuesta: "Incorrecto"});
	}
*/

	models.Quiz.findAll().success(function(quiz){

		if(req.query.respuesta === quiz[0].respuesta){
			res.render('quizes/answer', {respuesta: "Correcto"});
		}else{
			res.render('quizes/answer', {respuesta: "Incorrecto"});
		}
	});

};
