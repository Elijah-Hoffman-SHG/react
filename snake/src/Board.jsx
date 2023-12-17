import {useState, useRef} from "react"
import './Board.css';
import TitleScreen from "./titlescreen";
import { useEffect } from "react";
import { randomIntFromInterval } from "./lib/utils";
import Dispbox from "./nav";
import io from 'socket.io-client'
import LoadingScreen from "./LoadingScreen";
const socket = io.connect("http://192.168.0.225:5174")



class Snake{
  constructor(list, cells, color, direction, portalStatus){
    this.list = list;
    this.cells = new Set(cells);
    this.color = color;
    this.direction = direction;
    this.portalStatus = portalStatus;

}
}

const Direction={
    UP:'UP',
    RIGHT:'RIGHT',
    DOWN:'DOWN',
    LEFT:'LEFT'
}

const deathMessages = [
"You're snake food now!",
"Slithered into oblivion!",
"You've hiss-torically failed!",
"Sssssssorry, game over!",
"You've been coiled out!",
"Snake? Snake?! Snaaaaake!",
"You've been sssssssnuffed out!",
"You've bitten the dust!",
"You're one with the grass now!",
"You've been rattled and rolled!",
"You've been sssssssunk!",
"You've been hiss-terically defeated!",
"You've been sssssssilenced!",
"You've been ssssssswept away!",
"You've been sssssssnuffed!",
]







const BOARD_SIZE = 15;

const Board = () =>{
  const [gameStatus, setGameStatus] = useState("titleScreen");
  const [score, setScore] = useState(0);
  const [gameboard, setBoard] = useState(createBoard(BOARD_SIZE));
 
  const [gamespeed, setGameSpeed] = useState(150)
  const [direction, setDirection] = useState(Direction.RIGHT) ;
  const directionRef = useRef(direction.RIGHT);
  // Initialize state with default values
  const [snakes, setSnakes] = useState([]);
  const [snakeCells, setSnakeCells] = useState(new Set([]));
  const [foodCell, setFoodCell] = useState(null);
  const [teleportationCell, setTeleportationCell] =useState(0);
  const[title, setTitle] = useState("Welcome to Elite Snake");
 
  const [isLoading, setIsLoading] = useState(true);
  const [hasDied, setHasDied] = useState(false);
 
  const [foodShouldReverseDirection, setFoodShouldReverseDirection] = useState(false);
  const [foodShouldTeleport, setFoodShouldTeleport] = useState(false);
  const [color, setColor] = useState('#1C82BF'); // Default colr is a blueish color green
  
 
  let playerSnake;
  let playerID;
  
  socket.on('snakeID', (id, callback)=>{
    //ISSUE is here.. we arent getting anything I guess
    playerID = id;
    
    callback(`we got the playerID {${playerID}}`)
   
  })

  const handleStart = (color) => {
    if(!isLoading){
    socket.emit('start');
    socket.emit('changeColor', color );
    if(color){
    setColor(color);
    }
    
    setGameStatus("playing");
    }
   
  };
  
 

  socket.on('updatePlayers', (backendplayers, totalSnakeCells) => {
    
    let newSnakeCells = {};
    totalSnakeCells.forEach((cellData) => {
        newSnakeCells[cellData.cell] = cellData.color;
    });

    for(const id in backendplayers){
      const backendPlayer = backendplayers[id];

      if(!snakes[id]){
        // Create a new Snake if it doesn't exist yet
        const cells = Array.isArray(backendPlayer.cells) ? backendPlayer.cells : [];
        snakes[id] = new Snake(backendPlayer.list, cells, backendPlayer.color, backendPlayer.direction, backendPlayer.portalStatus);
      }
    }
  
    for(const id in snakes){
      if(!backendplayers[id]){
        // Delete the Snake if it doesn't exist in the backendplayers
        delete snakes[id];
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

    let newSnakeCells = {};
    data.totalSnakeCells.forEach((cellData) => {
        newSnakeCells[cellData.cell] = cellData.color;
    });
    setSnakeCells(newSnakeCells);
    

    setFoodCell(data.foodCell);
    setFoodShouldReverseDirection(data.foodShouldReverseDirection);  
    if(data.snakes[playerID]){
      playerSnake = data.snakes[playerID];
      directionRef.current = playerSnake.direction;
      if(playerSnake.score){
        setScore(playerSnake.score);
      }
      
    }
    
    setTeleportationCell(data.teleportationCell);
    setFoodShouldTeleport(data.foodShouldTeleport);
    
    //renderGame(); // Render the game with the new state
});
socket.on('snake-death', (color) => {
    
    
    setTitle(deathMessages[randomIntFromInterval(0, deathMessages.length - 1)]);
    setScore(0);
    setGameStatus('titleScreen');
})
  

    

  socket.on('snakeReversed', (id) => {
    snakes[id].direction = getOppositeDirection(snakes[id].direction);
  });
  
  useEffect(() => {
    const handleKeydown = (e) => {
      const newDirection = getDirectionFromKey(e.key);
      const OppositeDirection = getOppositeDirection(directionRef.current);

      if (newDirection && newDirection !== OppositeDirection) {
        setDirection(newDirection);
        directionRef.current = newDirection;
        socket.emit('changeDirection', { id: playerID, direction: newDirection });
      }
    };
  
    // Attach the handleKeydown function to the keydown event
    window.addEventListener('keydown', handleKeydown);
  
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [playerID, socket, setDirection, directionRef]);// Remove direction from the dependency array

 // useInterval(() => {
  //  moveSnake();
 //}, gamespeed);
 if(isLoading){
  return<LoadingScreen/>
}

return (
    <>
           
<div className="game-container">
{gameStatus === "titleScreen" && <TitleScreen setGameStatus={setGameStatus} title={title} handleStart={handleStart} inputcolor={color} />}

    
    <>

      
      
    
      
      <div className = 'boardbox'>
      {gameStatus === "playing" && <Dispbox color = {color} score = {score}/>}
    
      
      <div className="board">
      
      {score < 90 && (
          <>
                {gameboard.map((row, rowIdx) => (
                    <div key={rowIdx} className="row">
                        {row.map((cellValue, cellIdx) => {
                            const cellColor = getCellColor(
                                cellValue,
                                foodCell,
                                teleportationCell,
                                foodShouldReverseDirection,
                                foodShouldTeleport,
                                snakeCells,
                                
                            );
                            
                            return <div key={cellIdx} className="cell" style={{backgroundColor: cellColor}}></div>;;
                        })}
                    </div>
                ))}
                
            </>
        )}
        </div>
        </div>
        </>
        
        </div>
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




const getOppositeDirection = direction => {
    if (direction === Direction.UP) return Direction.DOWN;
    if (direction === Direction.RIGHT) return Direction.LEFT;
    if (direction === Direction.DOWN) return Direction.UP;
    if (direction === Direction.LEFT) return Direction.RIGHT;
  };
  
  const getCellColor = (
    cellValue,
    foodCell,
    teleportationCell,
    foodShouldReverseDirection,
    foodShouldTeleport,
    snakeCells,
  ) => {
    if (cellValue === teleportationCell) {
      return 'rgb(79,193,233)';
    }
    
    if (cellValue === foodCell) {
      if (foodShouldReverseDirection) {
        return 'rgb(255, 186, 84)';
      }
      if (foodShouldTeleport) {
        return 'rgb(252,110,81)';
      }
      return 'rgb(237, 85, 101)';
    }
    
    if (cellValue in snakeCells) {
      return snakeCells[cellValue];
    }
  
    return 'rgb(50,49,51)'; // replace with your default color
  };
   export default Board