var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("./game").listen(http);

let password = ""
let username = ""

app.set("port", 8383);
app.use(express.json());

app.get("/", function(req, res) {
    console.log("hello");
});

app.post("/login", function(req, res){
	var req_user = req.body.username;
	var req_pass = req.body.password;

	console.log("Attempting auth"); 
	console.log("username: " + req_user + " password: " + req_pass);

	if (
		(req_user != username) || 
		(req_pass != password)
	){
		res.status(401).send();
		console.log('Not authorized');
	}else{
		res.status(200).send();
		console.log('Authorized');
	}

});

http.listen(app.get("port"), function(){
    console.log("App started on port %s", app.get("port"));
})
