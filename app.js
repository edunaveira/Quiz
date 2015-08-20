var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// favicon creado en: http://faviconist.com/
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//Tarea Obligatoria 9
app.use(function(req, res, next){
    var tActual = new Date().getTime();

    if(req.session.hasOwnProperty("user")){
        if(req.session.user.hasOwnProperty("tiempo")){

            var tiempoInactividad = 2 * 60 * 1000; // 2 minutos en milisegundos
            if((req.session.user.tiempo + tiempoInactividad) > tActual) {
                req.session.user.tiempo = tActual;
            }else{
                delete req.session.user;
                var errors = [];
                var quiz;
                res.render('sesionTerminada', {quiz: quiz, errors: errors});
            }

        }

    }

    next();

});

// Helpers dinamicos:
app.use(function(req, res, next){

    // guardar path en session.redir para despues del login
    if (!req.path.match(/\/login|\/logout|\/user/)) {
        req.session.redir = req.path;
    }

    // Hacer visible req.session en las vistas
    res.locals.session = req.session;

    next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: [] 
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
