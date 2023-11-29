const express = require('express');
const app = express();
const http = require("http");
const {Server} = require('socket.io');
const cors = require("cors");


app.use(cors());

const server = http.createServer(app)

//variable for sockeIO
const io = new Server(server, {
    cors:{
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],

    },
});

//this will run when user starts server
io.on("connection", (socket) =>{
    console.log(`User connected: ${socket.id}`)
    
    socket.on("join_room", (data)=>{
        socket.join(data);
    })

//broadcasting sends to everybody, while we just want to send to a room so nah
    //gets the send message event, sends out the receive message
    socket.on("send_message", (data) =>{
        socket.to(data.room).emit("receive_message", data);
    })
})

server.listen(5174, () =>{
    console.log("SERVER IS RUNNING")
})