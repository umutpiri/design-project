var socket = io();

socket.on("connect", function() {
	console.log("connected");
});

socket.on("disconnect", function() {
	console.log("disconnected");
});

socket.on("match found", function(matchId){
    console.log("MATCH FOUND");
    console.log(matchId);
})

socket.on("joined queue", function(){
    console.log("joined queue");
})


socket.emit("enter queue");

console.log("client")