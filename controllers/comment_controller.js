var models = require('../models/models.js');

//Autoload :id de comentarios
exports.load = function(req, res, next, commentId){
	models.Comment.find({
		where:{
			id: Number(commentId)
		}
	}).then(function(comment){
		if(comment){
			req.comment = comment;
			next();
		}else{
			next(new Error('No existe comentario con Id: ' +  commentId));
		}
	}).catch(function(error){next(error)});
};

//GET
exports.new = function(req, res){
	res.render('comments/new.ejs', {quizid: req.params.quizId, errors: []});
};

//POST
exports.create = function(req, res){
	var comment = models.Comment.build(
	{
		texto: req.body.comment.texto,
		QuizId: req.params.quizId,
		UserId: 2
	});

	comment.validate().then(function(err){
		if(err){
			res.render('comments/new.ejs',
				{
					comment: comment, 
					//quizid: req.params.quizId,
					errors: err.errors
				});
		}else{
			//Si no tenemos errores guardamos el campo en la BD
			comment.save().then(function(){
				res.redirect('/quizes/' + req.params.quizId)
			});
		}
	}).catch(function(error){  });
};

//GET Publicar Comentario
exports.publish = function(req, res){
	req.comment.publicado = true;

	req.comment.save({
		fields: ["publicado"]
	}).then(function(){res.redirect('/quizes/' + req.params.quizId);})
	.catch(function(error){next(error)});
};