var socketio = require("socket.io");
const uuidv1 = require("uuid/v1");

var players = {};
var queue = [];
var matches = [];

var matchNo = 1;
module.exports.listen = function(app, sessionMiddleware) {
    io = socketio.listen(app).use(function(socket, next) {
        // Wrap the express middleware
        sessionMiddleware(socket.request, {}, next);
    });
    io.on("connection", socket => {
        console.log("connected");
        //console.log(socket.request.session.passport);
        var name = "";
        if (!socket.request.session.passport) name = "test";
        else name = socket.request.session.passport.user;
        //socket.disconnect();
        //players.push({name: "test", socket: socket});
        players[socket.id] = { name: name, socket: socket, matchId: null };
        //console.log(players[socket.id]);

        socket.on("disconnect", () => {
            console.log("disconnected");
            exitQueue(socket);
        });

        socket.on("enter queue", () => {
            enterQueue(socket);
        });
    });
};

function enterQueue(socket) {
    if (queue.indexOf(socket) === -1) {
        console.log(socket.id);
        queue.push(socket);
        socket.emit("joined queue");
        if (queue.length >= 2) {
            createMatch(queue.shift(), queue.shift());
        }
    }
}

function exitQueue(socket) {
    index = queue.indexOf(socket);
    if (index !== -1) queue.splice(index, 1);
}

function createMatch(player1, player2) {
    var matchId = uuidv1();
    console.log(matchId);
    player1.join(matchId);
    player2.join(matchId);
    players[player1.id]["matchId"] = matchId;
    players[player2.id]["matchId"] = matchId;
    match = {
        id: matchId,
        players: [
            { socket: player1.id, hand: [], deck: [], score: [[], [], []] },
            { socket: player2.id, hand: [], deck: [], score: [[], [], []] }
        ]
    };
    var matchP1 = {
        id: matchId,
        hand: [
            { type: "earth", color: "red", power: 3 },
            { type: "fire", color: "purple", power: 1 },
            { type: "earth", color: "blue", power: 1 }
        ],
        deck: [
            { type: "earth", color: "red", power: 3 },
            { type: "fire", color: "purple", power: 1 },
            { type: "water", color: "blue", power: 1 },
            { type: "earth", color: "purple", power: 3 },
            { type: "fire", color: "yellow", power: 2 },
            { type: "earth", color: "green", power: 1 }
        ],
        opponent: 5,
        opponentCard: null
    };
    io.to(matchId).emit("match found", matchP1);
}
