import {useState, useRef} from "react"
import './Board.css';
import TitleScreen from "./titlescreen";
import { useEffect } from "react";

import {randomIntFromInterval, useInterval, reverseLinkedList} from "../src/lib/utils"
import BlockDescription from "./Blockdescription";
import io from 'socket.io-client'
const socket = io.connect("http://localhost:5174")


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
    this.cells = new Set(cells);
    this.color = color;
    this.direction = direction;

}
}

const Direction={
    UP:'UP',
    RIGHT:'RIGHT',
    DOWN:'DOWN',
    LEFT:'LEFT'
}








const BOARD_SIZE = 15;

const Board = () =>{
  const [gameStatus, setGameStatus] = useState("titleScreen");
  const [score, setScore] = useState(0);
  const [board, setBoard] = useState(createBoard(BOARD_SIZE));

  const [gamespeed, setGameSpeed] = useState(150)
  const [direction, setDirection] = useState(Direction.RIGHT) ;
  const directionRef = useRef(direction.RIGHT);
  // Initialize state with default values
  const [snakes, setSnakes] = useState([]);
  const [snakeCells, setSnakeCells] = useState(new Set([]));
  const [foodCell, setFoodCell] = useState(null);
  const [teleportationCell, setTeleportationCell] =useState(0);

  const [passedPortal, setPassedPortal]= useState(false);
  const [touchedPortal, setTouchedPortal] = useState(false);
  const [NextTeleportationCell, setNextTeleportationCell] = useState(null);
  const [nextPortal, setNextPortal] = useState(false);


 
  const [foodShouldReverseDirection, setFoodShouldReverseDirection] = useState(false);
  const [foodShouldTeleport, setFoodShouldTeleport] = useState(false);

  
 
  let playerSnake;
  let playerID;
  let startingList;
  let startingCell;
  socket.on('snakeID', (id, callback)=>{
    //ISSUE is here.. we arent getting anything I guess
    playerID = id;
    
    callback("we got the playerID")
   
  })

  const handleStart = () => {
    socket.emit('start');
  };

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  
    // Cleanup function to clear the timeout if the component unmounts before the 5 seconds are up
    return () => clearTimeout(timer);
  }, []); // Empty dependency array so this effect runs once on mount
  socket.on('updatePlayers', (backendplayers, totalSnakeCells) => {
    
    let newSnakeCells = new Set(snakeCells)
    totalSnakeCells.forEach((cell)=>{newSnakeCells.add(cell)})

    for(const id in backendplayers){
      const backendPlayer = backendplayers[id]

      if(!snakes[id]){
        
        // Create a new Snake if it doesn't exist yet
        snakes[id] = new Snake(backendPlayer.list, backendPlayer.cells, backendPlayer.color, backendPlayer.direction)
        
    

      }
    }
  
    for(const id in snakes){
      if(!backendplayers[id]){
        // Delete the Snake if it doesn't exist in the backendplayers
        delete snakes[id]

      }

    }
    

  
    // Make sure the playerSnake is updated correctly
    
    //console.log('Updated playerSnake:', playerSnake);
  
    // Make sure the startingCell and startingList are updated correctly
    //startingCell = playerSnake.list.head.value.cell;
  // startingList = playerSnake.list;
    //console.log('Updated startingCell and startingList:', startingCell, startingList);
    setIsLoading(false);
  
  
  });
  socket.on('updateGameState', (data) => {
    setSnakes(data.snakes);
    setSnakeCells(new Set(data.totalSnakeCells));
    setFoodCell(data.foodCell);  
    //renderGame(); // Render the game with the new state
  });

  socket.on('handleGameOver', (data) => {
    setDirection(direction.RIGHT);
    directionRef.current = direction.RIGHT; // Add this line
  });
  
  useEffect(() => {
    const handleKeydown = (e) => {
      const newDirection = getDirectionFromKey(e.key);
      const OppositeDirection = getOppositeDirection(directionRef.current); // Use directionRef.current
      console.log(directionRef.current, newDirection, OppositeDirection); // Use directionRef.current
      if (newDirection && newDirection !== OppositeDirection) {
        // Send the new direction to the server
        setDirection(newDirection);
        directionRef.current = newDirection; // Add this line
        socket.emit('changeDirection', { id: playerID, direction: newDirection });
      }
    };
  
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [playerID]); // Remove direction from the dependency array

 // useInterval(() => {
  //  moveSnake();
 //}, gamespeed);
 if(isLoading){
  return<div>Loading...</div>
}

return (
    <>

    {gameStatus === "titleScreen" && <TitleScreen setGameStatus={setGameStatus} />}

    {gameStatus === "playing" && (
    <>
      <h1>Score: {score}</h1>
      <button onClick={handleStart}>Start</button>
      <div className = 'boardbox'>
      <BlockDescription/>
      <div className="board">
      {score < 90 && (
          <>
                {board.map((row, rowIdx) => (
                    <div key={rowIdx} className="row">
                        {row.map((cellValue, cellIdx) => {
                            const className = getCellClassName(
                                cellValue,
                                foodCell,
                                teleportationCell,
                                foodShouldReverseDirection,
                                foodShouldTeleport,
                                snakeCells,
                                
                            );
                            
                            return <div key={cellIdx} className={className}></div>;
                        })}
                    </div>
                ))}
                
            </>
        )}
        </div>
        </div>
        </>
        )}
    </>
  );

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
const getDirectionFromKey = (key) =>{
   
    switch (key) {
        case 'w':
            return Direction.UP;
        case 's':
            return Direction.DOWN;
        case 'a':
            return Direction.LEFT;
        case 'd':
            return Direction.RIGHT;
        default:
            return ''; 
    }
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

const getOppositeDirection = direction => {
    if (direction === Direction.UP) return Direction.DOWN;
    if (direction === Direction.RIGHT) return Direction.LEFT;
    if (direction === Direction.DOWN) return Direction.UP;
    if (direction === Direction.LEFT) return Direction.RIGHT;
  };
  
  const getCellClassName = (
    cellValue,
    foodCell,
    teleportationCell,
    foodShouldReverseDirection,
    foodShouldTeleport,
    snakeCells,
  ) => {
    if (cellValue === teleportationCell) {
      return 'cell cell-blue';
    }
    
    if (cellValue === foodCell) {
      if (foodShouldReverseDirection) {
        return 'cell cell-purple';
      }
      if (foodShouldTeleport) {
        return 'cell cell-orange';
      }
      return 'cell cell-red';
    }
    
    if (snakeCells.has(cellValue)) {
      return 'cell cell-green';
    }
  
    return 'cell';
  };
   export default Board