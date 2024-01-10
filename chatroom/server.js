const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname+"/public")));


io.on("connection", function(socket){
    socket.on('newuser', function(username){
        socket.username = username;
        socket.broadcast.emit("update", username + " joined the conversation");
        if(socket.client.conn.server.clientsCount == 1){
            socket.broadcast.emit("update", socket.client.conn.server.clientsCount + " user currently connected" );
            socket.emit("update", socket.client.conn.server.clientsCount + " user currently connected" );
        }
        else{
        socket.broadcast.emit("update", socket.client.conn.server.clientsCount + " users currently connected" );
        socket.emit("update", socket.client.conn.server.clientsCount + " users currently connected" );
        }

    })
    socket.on('exituser', function(username){
        socket.broadcast.emit("update", username + " left the conversation");
        if(socket.client.conn.server.clientsCount == 1){
            socket.broadcast.emit("update", socket.client.conn.server.clientsCount + " user currently connected" );
        }
        else{
        socket.broadcast.emit("update", socket.client.conn.server.clientsCount + " users currently connected" );
        }
    })
    socket.on('chat', function(message){
        socket.broadcast.emit("chat", message);
    })
    socket.on('disconnect', function(username){
        socket.broadcast.emit("update", socket.username + " left the conversation");
        if(socket.client.conn.server.clientsCount == 1){
            socket.broadcast.emit("update", socket.client.conn.server.clientsCount + " user currently connected" );
        }
        else{
        socket.broadcast.emit("update", socket.client.conn.server.clientsCount + " users currently connected" );
        }
    })
})


server.listen(5000);
