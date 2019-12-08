var socketio = require("socket.io");

var players = [];


module.exports.listen = function(app) {
    io = socketio.listen(app);
    
    io.on("connection", function(socket){
        console.log("connected");
        players.push({name: "test", socket: socket});

        socket.on("disconnect", function(){
            console.log("disconnected");
        });
    });
}