/**
 * @author srimagic
 */
	var express = require('express');
	var app = express();
	
	process.env.development = true;
	
	//pre-routing
	app.configure(function(){
		app.use(express.favicon());
		app.use(express.static(__dirname));
		app.use(express.bodyParser());
	});
	
	var redis = require('./db');
	redis.open(function(err, db){
			if (err) {console.log("node.js unable to connect to redis");process.exit(1);}
			console.log("successfully opened connection to redis: ");
			process.redis = db;
		});
			
	//logging
	app.configure('development', function(){
		app.use(express.logger());
		app.all('*', function(req, res, next){
			for (x in req) {
				if (x == "query" || x == "body" || x == "headers" ||
					x == "params" || x == "url" || x == "path")
				console.log(x + " is " + JSON.stringify(req[x]));
			}
			next();	
		});
	});
	
	//*************************************
	//static routes
	app.get('/public/*', express.static);
	
	//*************************************
	//app routes
	var path_prefix = "/:code_ver/:config_value/";
		
	app.get(path_prefix + 'usr/', params.validate, params.setUsr, params.login);
	
	app.all('*', function(req, res){
		res.send(403);
	});
	
	process.on('uncaughtException', function(err) {
  		console.log(err);
  		//todo - notify admin
	});
	
	process.on('exit', function() {
  		console.log('node.js process exiting now!!!');
  		redis.close(process.redis);
  		console.log('closed connection to rredis!!!');
 	});
 	
 	process.on('SIGINT', function(){
    	process.exit(1);
	});
		
	app.listen(2000);
