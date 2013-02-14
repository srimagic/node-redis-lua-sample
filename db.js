/**
 * @author srimagic
 */

exports.open = function(cb)
{
	try{
		var redis = require("redis"),
        	client = redis.createClient();
        		
	    client.on("error", function (err) {
	        console.log("error connecting to redis " + err);
	        cb(err);
	    });
	
		loadScripts(redis, cb);
		
		cb(null, client);
	}  
	catch(e)
	{
		cb("Connect to redis failed. Exception:  ".concat(e));
	}
}

exports.close = function(db)
{
	db.quit();
} 

function loadScripts(redis, cb)
{
	try{
		require('redis-lua2').attachLua(redis);
	    	var sys = require('sys');
		var exec = require('child_process').exec;
		var child;
	 
	 	//script 1 -- determine xyz
		child = exec("cat " + process.cwd() + "xyz.lua", function (error, stdout, stderr) {
		  if (error) {console.log("redis load scripts failed: " + error); return cb("redis error");}
		  redis.lua('xyz', stdout);
		});
		
	} catch(e) {
		console.log("redis load scripts failed: " + e);	
		cb("redis error");
	}
}

