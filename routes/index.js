var express = require('express');
var router = express.Router();

var quizController = 	require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var userController = require('../controllers/user_controller');
var statisticsController = require('../controllers/statistics_controller');
//var visitController = require('../controllers/visit_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load);
router.param('commentId', commentController.load); 
router.param('userId', userController.load);  

// Definición de rutas de sesión
router.get('/login', sessionController.new);
router.post('/login', sessionController.create);
router.get('/logout', sessionController.destroy);

//statistics
router.get('/quizes/statistics', statisticsController.show);
//Definición de rutas de /quizes
router.get('/quizes', 						quizController.index);
router.get('/quizes/:quizId(\\d+)', 		quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', 	quizController.answer);
//Se necesita autorización acceder a este contenido
router.get('/quizes/new',					sessionController.loginRequired, quizController.new);
router.post('/quizes/create',				sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',	sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',			sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',		sessionController.loginRequired, quizController.destroy);
//Comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', 	commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', 		commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, commentController.publish);

// Definición de rutas de Usuarios
router.get('/user',  userController.new);     // formulario sign un
router.post('/user',  userController.create);     // registrar usuario
router.get('/user/:userId(\\d+)/edit',  sessionController.loginRequired, userController.ownershipRequired, userController.edit);     // editar información de cuenta
router.put('/user/:userId(\\d+)',  sessionController.loginRequired, userController.ownershipRequired, userController.update);     // actualizar información de cuenta
router.delete('/user/:userId(\\d+)',  sessionController.loginRequired, userController.ownershipRequired, userController.destroy);     // borrar cuenta
router.get('/user/:userId(\\d+)/quizes',  quizController.index);     // ver las preguntas de un usuario



// Entrada para información sobre el autor
//TODO: Crear controlador propio para ello
router.get('/author', function(req, res) {
	var errors = [];
	var quiz;
  	res.render('author', {quiz: quiz, errors: errors});
});

module.exports = router;
