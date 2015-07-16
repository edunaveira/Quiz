//GET /quizes/question
exports.question  = function(req, res){
	res.render('quizes/question', {pregunta: 'Capital de Italia'});
};

//GET /quizes/answer
exports.answer = function(req, res){

	var respuesta = req.query.respuesta;

    var patt = new RegExp(/roma/i);// "/i" Para que sea indeferente si esta en minusculas/mayusculas
    var validacion = patt.test(respuesta);

	if(validacion){
		res.render('quizes/answer', {respuesta: "Correcto"});
	}else{
		res.render('quizes/answer', {respuesta: "Incorrecto"});
	}
};
