var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("./game").listen(http);

app.set("port", 8383);
app.use(express.static("public"));

app.get("/", function(req, res) {
    console.log("hello");
});

http.listen(app.get("port"), function(){
    console.log("App started on port %s", app.get("port"));
})