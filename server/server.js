(function ( mod ) {

	if ( typeof module === "object" && typeof module.exports === "object" )  { // CommonJS, Node
		var express = require('express'),
			bodyParser = require('body-parser');
		module.exports = mod(express,bodyParser);
	}
	else
		throw "This module is only supported on Node.js.";

}(function (express, bodyParser) {


	// CORS middleware
	function enableCrossDomain(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*'); // allow origin from localhost
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		next();
	}

	function Server( port ) {
		this.port = port;
		this.app = express();
	};

	Server.prototype = {

			configure : function () {
				this.app.use(enableCrossDomain);
				this.app.use(bodyParser.json());
				this.app.use(bodyParser.urlencoded({
					extended: true
				}));
				this.app.use(express.static(__dirname + '/../public/'));
				return this;
			},

			start : function () {
				this.app.listen(this.port);
				return this;
			}

	};

	return Server;

}));