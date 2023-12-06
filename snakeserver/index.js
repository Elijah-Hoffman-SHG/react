const express = require('express');
const app = express();
const http = require("http");
const {Server} = require('socket.io');
const cors = require("cors");
let gameStatus = "titleScreen";
let score = 0;


let gameSpeed = 150;
let direction;

// Initialize state with default values
const PROBABILITY_OF_DIRECTION_REVERSAL_FOOD = 0;
const PROBABILITY_OF_TELPORTATION_FOOD = 0;




let SnakeCells = new Set([]);
let foodCell = 23;
let teleportationCell = 0;

let passedPortal = false;
let touchedPortal = false;
let NextTeleportationCell = null;
let nextPortal = false;

let foodShouldReverseDirection = false;
let foodShouldTeleport = false;
const Direction={
    UP:'UP',
    RIGHT:'RIGHT',
    DOWN:'DOWN',
    LEFT:'LEFT'
}

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
  constructor(list, cells, color, direction){
    this.list = list;
    this.cells = cells;
    this.color = color;
    this.direction = direction;

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
let totalSnakeCells = new Set();
const BOARD_SIZE = 15;
const board = createBoard(BOARD_SIZE)

//this will run when user starts server
io.on("connection", (socket) =>{
    let awesome = getStartingSnakeLLValue(board)
    snakes[socket.id]= {
        list: new SinglyLinkedList(awesome),
        cells: Array.from(new Set([awesome.cell])),
        color: "green",
        direction: Direction.RIGHT,

    }
    snakes[socket.id].cells.forEach(cell => totalSnakeCells.add(cell));
  
    

 

    socket.emit("snakeID", socket.id, (response) =>{
        console.log(response)
        
    })
    //broadcasted to everyone
    io.emit('updatePlayers', snakes, Array.from(totalSnakeCells))
    
    socket.on('changeDirection', (data) => {
        const { id, direction } = data;
    
        if (snakes[id]) {
          // Update the direction of the snake with the given id
          snakes[id].direction = direction;
        }
        
      
      });

      socket.on('updateSnake', (data) => {
        const { snake, id, tSnakeCells } = data;
      

        if (snakes[id]) {
        
          snakes[id].list = snake.list;
          snakes[id].cells = snake.cells;
          snakes[id].direction = snake.direction;
        } else {
          console.log('No snake with id:', id);
        }
        totalSnakeCells = new Set(tSnakeCells);
        io.emit('updatePlayers', snakes, tSnakeCells, foodCell);
      });

    socket.on("disconnect", (reason)=>{
        console.log(reason);

        // Get the cells of the disconnected snake
        handleSnakeDeath(socket.id);
        io.emit('updateGameState', {snakes: snakes, totalSnakeCells: Array.from(SnakeCells), foodCell: foodCell});
        
    })

    
    let isMoving = false;

//broadcasting sends to everybody, while we just want to send to a room so nah
    //gets the send message event, sends out the receive message
  
})

setInterval(() => {
    moveSnakes();
    io.emit('updateGameState', {snakes: snakes, totalSnakeCells: Array.from(SnakeCells), foodCell: foodCell});
}, 1000);


server.listen(5174, () =>{
    console.log("SERVER IS RUNNING")
})

const moveSnakes = () => {
    Object.entries(snakes).forEach(([socketId, snake]) => {
      const currentHeadCoords = {
        row: snake.list.head.value.row,
        col: snake.list.head.value.col,
      };
  
      let nextHeadCoords = getCoordsInDirection(currentHeadCoords, snake.direction);
  
      if (isOutOfBounds(nextHeadCoords, board)) {
        handleSnakeDeath(socketId);
        return;
      }
  
      const nextHeadCell = board[nextHeadCoords.row][nextHeadCoords.col];
  
      if (SnakeCells.has(nextHeadCell)) {
        handleSnakeDeath(socketId);
        return;
      }

      // Preserved commented-out code
    /*
    if(teleportationCell != 0){
      if(nextHeadCell ===teleportationCell){
        setNextPortal(true)
        setNextTeleportationCell(teleportationCell)
        let RC = getRC(foodCell)
        
        nextHeadCoords = {row: RC.row, col: RC.col}
      }
      if(nextHeadCell === foodCell){
        let RC = getRC(teleportationCell)
        setNextPortal(true)
        setNextTeleportationCell(foodCell)
  
        nextHeadCoords = {row: RC.row, col: RC.col}
      }
    }

    if(nextPortal){
      handleGoingThroughTeleport(NextTeleportationCell);            
    }
    */

  
      const newHead = new LinkedListNode({
        row: nextHeadCoords.row,
        col: nextHeadCoords.col,
        cell: nextHeadCell,
      });
  
      let newSnakeCells = new Set(snake.cells);
      let newTotalSnakeCells = new Set(SnakeCells);
  
      const currentHead = snake.list.head;
      snake.list.head = newHead;
      currentHead.next = newHead;
  
      newSnakeCells.delete(snake.list.tail.value.cell);
      newSnakeCells.add(nextHeadCell);
  
      newTotalSnakeCells.delete(snake.list.tail.value.cell);
      newTotalSnakeCells.add(nextHeadCell);
  
      snake.list.tail = snake.list.tail.next;
      if (snake.list.tail === null) snake.list.tail = snake.list.head;
      
            /*

        if(passedPortal){
        handleFoodConsumption(newSnakeCells);
        setTouchedPortal(false)
        setPassedPortal(false)
        setNextPortal(false)
            }

        */

      const foodConsumed = nextHeadCell === foodCell;
      if (foodConsumed) {
        growSnake(newSnakeCells, snake);
        if (!foodShouldTeleport) {
          if (foodShouldReverseDirection) reverseSnake();
          handleFoodConsumption(newSnakeCells);
        }
      }
  
      const teleportfoodConsumed = nextHeadCell === teleportationCell;
      if (teleportfoodConsumed) {
        growSnake(newSnakeCells, snake);
      }
  
      SnakeCells = newTotalSnakeCells;
      snake.cells = newSnakeCells;
      snakes[socketId].cells = new Set([newSnakeCells]);
      snakes[socketId].list = snake.list;
    });
  };
  
  const growSnake = (newSnakeCells, snake) => {
    const growthNodeCoords = getGrowthNodeCoords(snake.list.tail, snake.direction);
  
    if (isOutOfBounds(growthNodeCoords, board)) {
      return;
    }
  
    const newTailCell = board[growthNodeCoords.row][growthNodeCoords.col];
    const newTail = new LinkedListNode({
      row: growthNodeCoords.row,
      col: growthNodeCoords.col,
      cell: newTailCell,
    });
  
    const currentTail = snake.list.tail;
    snake.list.tail = newTail;
    snake.list.tail.next = currentTail;
    newSnakeCells.add(newTailCell);
  };
    const reverseSnake = () => {
        const tailNextNodeDirection = getNextNodeDirection(snake.tail, direction);
        const newDirection = getOppositeDirection(tailNextNodeDirection);
        setDirection(newDirection);
        reverseLinkedList(snake.tail);
        const snakeHead = snake.head;
        snake.head = snake.tail;
        snake.tail = snakeHead;
    }
    
    
    
    
    const handleFoodConsumption = () =>{ 
    const maxCellVal = BOARD_SIZE*BOARD_SIZE;
    let nextFoodCell;
    while(true){
        nextFoodCell=randomIntFromInterval(1, maxCellVal);
        if(SnakeCells.has(nextFoodCell) || foodCell === nextFoodCell) continue
        break
    }
    const nextFoodShouldReverseDirection =
    Math.random() < PROBABILITY_OF_DIRECTION_REVERSAL_FOOD;
    const nextFoodShouldTeleport =
    Math.random() < PROBABILITY_OF_TELPORTATION_FOOD;
    TeleportationCell = 0
    FoodShouldReverseDirection = false
    FoodShouldTeleport =false
    if(nextFoodShouldTeleport){
        let secondFoodCell;
        while(true){
            secondFoodCell=randomIntFromInterval(1, maxCellVal);
            if(SnakeCells.has(secondFoodCell) || teleportationCell === secondFoodCell || secondFoodCell === nextFoodCell) continue
            break
        }
        FoodShouldTeleport = nextFoodShouldTeleport;
        TeleportationCell = secondFoodCell;
    }
    else{
      FoodShouldReverseDirection = nextFoodShouldReverseDirection;
    }
    
    
    foodCell = nextFoodCell;
    
    
    
    Score =score + 1;
    
    }
    
    
    
    
    const handleGameOver = () => {
     
        //const snakeLLStartingValue = getStartingSnakeLLValue(board);    
        //setSnakes(new SinglyLinkedList(snakeLLStartingValue))
        //setSnakeCells(new Set([snakeLLStartingValue.cell])),
        
        setFoodCell(snakeLLStartingValue.cell + 5);
        setTeleportationCell(0);
        setFoodShouldTeleport(false);
        setFoodShouldReverseDirection(false);
        //setDirection(Direction.RIGHT);
        setNextTeleportationCell(null);
        setTouchedPortal(false)
        setPassedPortal(false)
        setNextPortal(false)
       
    
    }
    const handleSnakeDeath = (id) => { 
         // Get the cells of the dead snake
        const deadSnakeCells = snakes[id].cells;

        // Remove each cell of the dead snake from SnakeCells
        deadSnakeCells.forEach(cell => SnakeCells.delete(cell));
        let temp = snakes[id].list.tail
        while(temp!= null){
            SnakeCells.delete(temp.value.cell);
            temp = temp.next
        }
        
        
        snakes[id].list = new SinglyLinkedList(getStartingSnakeLLValue(board));
        snakes[id].cells = new Set([snakes[id].list.head.value.cell]);
        snakes[id].direction = Direction.RIGHT;

        
        
    }
    
    const handleGoingThroughTeleport = (cell) =>{
      if(!touchedPortal){
      let temp = snake.tail
      while (temp!=null && temp.next != null){
    
        if(temp.next.value.cell ===cell){
            //if it ever equals it, dont handle food consumption.
            setTouchedPortal(true)
            
            break;
    
        }
        temp = temp.next
    }
    }
    
    if(touchedPortal){
     //if we touched the portal previously, and no cells from tail to head equal the cell, then we are all goo
     let temp = snake.tail
     let tempbool = false
     while(temp!= null){
      if(temp.value.cell === cell){
        
        //If this is true for whole ll, set the other ting
        tempbool = true
      }
      
      temp = temp.next
     }
     if(!tempbool) {
      setPassedPortal(true)
     }
    
    }
    }
  
    
    const getCoordsInDirection = (currentHeadCoords, direction) =>{
        switch (direction) {
            case Direction.UP:
                return {
                    row: currentHeadCoords.row - 1,
                    col: currentHeadCoords.col
                };
            case Direction.RIGHT:
                return {
                    row: currentHeadCoords.row,
                    col: currentHeadCoords.col + 1
                };
            case Direction.DOWN:
                return {
                    row: currentHeadCoords.row + 1,
                    col: currentHeadCoords.col
                };
            case Direction.LEFT:
                return {
                    row: currentHeadCoords.row,
                    col: currentHeadCoords.col - 1
                };
        }
    }
    function isOutOfBounds(coords, board) {
        const { row, col } = coords;
        const boardSize = board.length; // Assuming the board is a square
      
        return row < 0 || col < 0 || row >= boardSize || col >= boardSize;
      }
 
    
    
    const getNextNodeDirection = (node, currentDirection) => {
        if (node.next === null) return currentDirection;
        const {row: currentRow, col: currentCol} = node.value;
        const {row: nextRow, col: nextCol} = node.next.value;
        if (nextRow === currentRow && nextCol === currentCol +1) return Direction.RIGHT
        if (nextRow === currentRow && nextCol === currentCol -1) return Direction.LEFT
        if (nextCol === currentCol && nextRow === currentRow +1) return Direction.DOWN
        if (nextCol === currentCol && nextRow === currentRow -1) return Direction.UP  
        return currentDirection
    
    }
    const getGrowthNodeCoords = (snakeTail, currentDirection) => {
        
        const tailNextNodeDirection = getNextNodeDirection(
            snakeTail,
            currentDirection,
          );
        
        const growthDirection = getOppositeDirection(tailNextNodeDirection);
        const currentTailCoords = {
            row: snakeTail.value.row,
            col: snakeTail.value.col,
    
        };
        const growthNodeCoords = getCoordsInDirection(
            currentTailCoords,
            growthDirection,
        )
    
        return growthNodeCoords
      
    }
    const getOppositeDirection = direction => {
        if (direction === Direction.UP) return Direction.DOWN;
        if (direction === Direction.RIGHT) return Direction.LEFT;
        if (direction === Direction.DOWN) return Direction.UP;
        if (direction === Direction.LEFT) return Direction.RIGHT;
      };

      const getRC = (Number) => {
        let row = Math.floor(Number /BOARD_SIZE)
        let col = Math.floor(Number % BOARD_SIZE) -1
        let val = Number
        return {row, col, val}
      }
    const randomIntFromInterval = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1) + min);
    };
