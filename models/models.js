var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);

//Importar la definición de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz; //exportamos la definición de la tabla

sequelize.sync().success(function() {
	//success: ejecuta el manejador una vez creada la tabla
	Quiz.count().success(function (count){

		if(count === 0){ //se inicializa la tabla si esta vacia
			Quiz.create({
				pregunta: "Capital de Italia",
				respuesta: 'Roma'
			}).success(function(){
				console.log("Añadido primer registro a la BBDD")
			});
			Quiz.create({
				pregunta: "Capital de España",
				respuesta: 'Madrid'
			}).success(function(){
				console.log("Añadido segundo registro a la BBDD")
			});

		};
	});
});