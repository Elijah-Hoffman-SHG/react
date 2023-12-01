const express = require('express');
const app = express();
const http = require("http");
const {Server} = require('socket.io');
const cors = require("cors");
const createBoard = BOARD_SIZE =>{
    let counter =1;
    const board = [];
    for(let row = 0; row < BOARD_SIZE; row++){
        const currentRow = []
        for (let col = 0; col < BOARD_SIZE; col++){
            currentRow.push(counter++);
        }
        board.push(currentRow);
    }
    return board;
}

app.use(cors());
const getStartingSnakeLLValue = board => {
    
    const rowSize = board.length;
    const colSize = board[0].length;
    const startingRow = Math.round(rowSize / 3);
    const startingCol = Math.round(colSize / 3);
    const startingCell = board[startingRow][startingCol];
    
    return {
      row: startingRow,
      col: startingCol,
      cell: startingCell,
      
    };
  };
  class LinkedListNode{
    constructor(value){
        this.value = value;
        this.next = null;
    }
}

class SinglyLinkedList{
    constructor(value){
        const node = new LinkedListNode(value);
        this.head = node;
        this.tail = node;

    }
}
class Snake{
  constructor(list, cells, color){
    this.list = list;
    this.cells = cells;
    this.color = color;

}
}
const server = http.createServer(app)

//variable for sockeIO
const io = new Server(server, {
    cors:{
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        

    },
    pingInterval: 2000,
    pingTimeout: 5000
});
const snakes = {
   
}
const board = createBoard(15)

//this will run when user starts server
io.on("connection", (socket) =>{
    
    snakes[socket.id]= {
        list: new SinglyLinkedList(getStartingSnakeLLValue(board)),
        cells: new Set([5]),
        color: "green",


    }
  
    

 

    socket.emit("snakeID", socket.id, (response) =>{
        console.log(response)
        
    })
    //broadcasted to everyone
    io.emit('updatePlayers', snakes)
    

    socket.on("disconnect", (reason)=>{
        console.log(reason)
        delete snakes[socket.id]
        io.emit('updatePlayers', snakes)
    })
    console.log(snakes)
    

//broadcasting sends to everybody, while we just want to send to a room so nah
    //gets the send message event, sends out the receive message
  
})

server.listen(5174, () =>{
    console.log("SERVER IS RUNNING")
})