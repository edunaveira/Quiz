//visit_controller.js
var models = require('../models/models.js');


exports.logIP = function(req, res){
	//Guardamos la dirección del usuario y la url
console.log("loooooooooooooooogIP");

	var ipRemota = getIP(req);

	models.Visit.build(
	{
		ip: ipRemota,
		url: req.path
	}).save().catch(function(error) {
	  console.log("EROOOOOOOOR en logIP");
	});
};

function getIP(req){
	return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}