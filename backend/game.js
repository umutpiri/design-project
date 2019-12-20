var socketio = require("socket.io");

var players = {};
var queue = []


module.exports.listen = function(app) {
    io = socketio.listen(app);
    
    io.on("connection", (socket) => {
        console.log("connected");
        console.log("haydaa")
        //players.push({name: "test", socket: socket});
        players[socket.id] = {name: "test", socket: socket}
        console.log(players)

        socket.on("disconnect", () => {
            console.log("disconnected");
        });

        socket.on("enter queue", () => {
            enterQueue(socket);
        })
    });
}

function enterQueue(socket){
    var player = players[socket.id]
    if (queue.indexOf(player) === -1) {
		queue.push(player);
		socket.emit("joined queue");
		if (queue.length >= 2) {
            player1 = queue.shift()
            player2 = queue.shift()
		}
	}

}
