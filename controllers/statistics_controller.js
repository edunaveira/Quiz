//Controlador de estadisticas
var models = require('../models/models.js');

exports.show = function(req, res){
var estadisticas = new Object();
	
	models.Quiz.count().then(function(c) {
		estadisticas.numPreguntas = c;
		models.Comment.count().then(function(c){
			estadisticas.numComentarios = c;
			estadisticas.medComentarios = (estadisticas.numComentarios /estadisticas.numPreguntas).toFixed(2);

			models.Comment.findAll().then(function(c){
				estadisticas.siComentarios = 0;

				var ids = [];

				for(var i=0; i < c.length;i++){
					console.log("id:"+c[i].QuizId);
					if(!inArray(c[i].QuizId, ids)){
						ids.push(c[i].QuizId);
					}
				}

				estadisticas.siComentarios = ids.length;
				estadisticas.noComentarios = estadisticas.numPreguntas - estadisticas.siComentarios;
				
				//Finalmente recorremos la tabla de visitantes
				models.Visit.findAll().then(function(c){
					var visitas = 0;
					var unicos = [];

					for(var i=0; i < c.length; i++){
						visitas++;
						if(!inArray(c[i].ip, unicos)){
							unicos.push(c[i].ip);
						}
					}

					estadisticas.visitantes = unicos.length;
					estadisticas.visitas = visitas;


					res.render('quizes/statistics.ejs', { estadisticas: estadisticas, errors: []});
				});

			});
		});
	});

};
	
function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

function getIP(req){
	return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}
