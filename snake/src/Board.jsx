import {useState} from "react"
import './Board.css';
import TitleScreen from "./titlescreen";
import { useEffect } from "react";

import {randomIntFromInterval, useInterval, reverseLinkedList} from "../src/lib/utils"
import BlockDescription from "./Blockdescription";

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
const Direction={
    UP:'UP',
    RIGHT:'RIGHT',
    DOWN:'DOWN',
    LEFT:'LEFT'
}
const PROBABILITY_OF_DIRECTION_REVERSAL_FOOD = 0;
const PROBABILITY_OF_TELPORTATION_FOOD = 1;
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







const BOARD_SIZE = 15;

const Board = () =>{
    const [gameStatus, setGameStatus] = useState("titleScreen");
    const [score, setScore] = useState(0);
    const [board, setBoard] = useState(createBoard(BOARD_SIZE));
    const [snake, setSnake] = useState(
      new SinglyLinkedList(getStartingSnakeLLValue(board)),
    );
    const [fakesnake, setfakeSnake] = useState(
        null,
      );
    const [fakesnakeCells, setfakeSnakeCells] = useState(
        new Set(),
      );
    const [snakeCells, setSnakeCells] = useState(
      new Set([snake.head.value.cell]),
    );
    const [passedPortal, setPassedPortal]= useState(false);
    const [touchedPortal, setTouchedPortal] = useState(false);
    const [nextPortal, setNextPortal] = useState(false);

    // Naively set the starting food cell 5 cells away from the starting snake cell.
    const [foodCell, setFoodCell] = useState(snake.head.value.cell + 5);
    const [teleportationCell, setTeleportationCell] =useState(0);
    const [direction, setDirection] = useState(Direction.RIGHT) ;
    const [foodShouldReverseDirection, setFoodShouldReverseDirection] = useState(
      false,
    );
    const [foodShouldTeleport, setFoodShouldTeleport] = useState(
        false,
      );



/*
useEffect(()=>{
    window.addEventListener('keydown', e => {
        handleKeydown(e);
      });
    }, []);


    useInterval(() => {
        moveSnake();
      }, 150);
*/
useEffect(() => {
    // Check the score and update the game status
    if (score >= 90) {
        setGameStatus("megan");
    }
}, [score]);
useEffect(() => {
    const handleKeydown = (e) => {
      const newDirection = getDirectionFromKey(e.key);
      const OppositeDirection = getOppositeDirection(newDirection)
      if (newDirection && OppositeDirection != direction) {
        setDirection(newDirection);
      }
    };
  
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [direction]);

 // useInterval(() => {
   // moveSnake();
 //}, 150);

    
 /* 
const handleKeydown = e => {
    
    const newDirection = getDirectionFromKey(e.key);
    const isValidDirection = newDirection !== '';
    if(!isValidDirection) return;
    
  setDirection(newDirection);
};
*/



const moveSnake = ()=> {

let currentHeadCoords;
console.log({nextPortal}, {touchedPortal}, {passedPortal})
console.log({snakeCells})

currentHeadCoords ={
    row: snake.head.value.row,
    col: snake.head.value.col,
};
let temp = snake.tail




//console.log(currentHeadCoords)

let nextHeadCoords = getCoordsInDirection(currentHeadCoords, direction);


if (isOutOfBounds(nextHeadCoords, board)) {
    handleGameOver();
    return;
  }

  


const nextHeadCell = board[nextHeadCoords.row][nextHeadCoords.col];
  if (snakeCells.has(nextHeadCell)) {
    
    handleGameOver();
    return;
  }
  if(teleportationCell != 0){
    if(nextHeadCell ===teleportationCell){
        setNextPortal(true)
       
      let RC = getRC(foodCell)
      
      nextHeadCoords = {row: RC.row, col: RC.col}
        
      
  
    }
    if(nextHeadCell === foodCell){
      let RC = getRC(teleportationCell)
        setNextPortal(true)
      nextHeadCoords = {row: RC.row, col: RC.col}
       
  }
    }

    if(nextPortal){
        setTouchedPortal(false)
        while (temp!=null && temp.next != null){
            console.log(temp.next.value.cell, teleportationCell)
            if(temp.next.value.cell ===teleportationCell){
                setTouchedPortal(true)
            }
            temp = temp.next
        }
        if(!touchedPortal){
            setPassedPortal(true)
            setNextPortal(false)
        }
        
        }
 




const newHead = new LinkedListNode(
    {
        row: nextHeadCoords.row,
        col: nextHeadCoords.col,
        cell: nextHeadCell,
    }
);

let newSnakeCells = new Set(snakeCells);

if(teleportationCell == 0){
const currentHead = snake.head;


snake.head = newHead;
currentHead.next = newHead;


newSnakeCells.delete(snake.tail.value.cell);
newSnakeCells.add(nextHeadCell);

snake.tail = snake.tail.next;
if (snake.tail === null) snake.tail = snake.head;
}

else{
const currentHead = snake.head;
snake.head = newHead;
if(currentHead.next){
deletethisshiz = currentHead.next.cell}

currentHead.next = newHead;


newSnakeCells.delete(snake.tail.value.cell);
newSnakeCells.add(nextHeadCell);

snake.tail = snake.tail.next;
if (snake.tail === null) snake.tail = snake.head;
}
//fake logic

///end


const foodConsumed = nextHeadCell === foodCell;
if (foodConsumed) {
    
    
  growSnake(newSnakeCells);
  if (foodShouldReverseDirection) reverseSnake();
 if (foodShouldTeleport){
   
 }
    //let snakeLength = snakeCells.size;
   // newSnakeCells = teleportHead(getRC(teleportationCell));
   // addtoSnake(snakeLength)
//}
  handleFoodConsumption(newSnakeCells);
}
const teleportfoodConsumed = nextHeadCell === teleportationCell || passedPortal;
if (teleportfoodConsumed) {

    
  growSnake(newSnakeCells);
 
  if(touchedPortal){
    if(passedPortal){
  handleFoodConsumption(newSnakeCells);
  setTouchedPortal(false)
  setPassedPortal(false)
    }
}

  //let snakeLength = snakeCells.size;
  //newSnakeCells = teleportHead(getRC(foodCell));
  //addtoSnake(snakeLength)
  //handleTeleportConsumption(snake);
}


setSnakeCells(newSnakeCells);
};


const growSnake = newSnakeCells => {
    const growthNodeCoords = getGrowthNodeCoords(snake.tail, direction);
   
    if (isOutOfBounds(growthNodeCoords, board)) {
      // Snake is positioned such that it can't grodw; dosn't do anything.
      return;
    }
    const newTailCell = board[growthNodeCoords.row][growthNodeCoords.col]
    const newTail = new LinkedListNode({
        
        row: growthNodeCoords.row,
        col: growthNodeCoords.col,
        cell: newTailCell,

    })
    const currentTail = snake.tail
  
    snake.tail = newTail
    snake.tail.next = currentTail
    newSnakeCells.add(newTailCell)



}

const reverseSnake = () => {
    const tailNextNodeDirection = getNextNodeDirection(snake.tail, direction);
    const newDirection = getOppositeDirection(tailNextNodeDirection);
    setDirection(newDirection);
reverseLinkedList(snake.tail);
    const snakeHead = snake.head;
    snake.head = snake.tail;
    snake.tail = snakeHead;
}

const teleportHead = (cell) => {
    const snakeLength = snakeCells.size;
   
    const newHead= new LinkedListNode({
        
        row: cell.row,
        col: cell.col,
        cell: cell.val,

    })
    const newSnakeCells = new Set([cell.val]);
    setSnakeCells(newSnakeCells)
  
    snake.head= newHead
    snake.tail = newHead
    
    return newSnakeCells
   
}
const addtoSnake = length => {
    let newSnakeCells = new Set(snakeCells)
    for (let i = 0; i < length; i ++){
        growSnake(newSnakeCells)
    }
    setSnakeCells(newSnakeCells)
}

const handleFoodConsumption = () =>{
    
const maxCellVal = BOARD_SIZE*BOARD_SIZE;
let nextFoodCell;
while(true){
    nextFoodCell=randomIntFromInterval(1, maxCellVal);
    if(snakeCells.has(nextFoodCell) || foodCell === nextFoodCell) continue
    break
}

const nextFoodShouldReverseDirection =
Math.random() < PROBABILITY_OF_DIRECTION_REVERSAL_FOOD;

const nextFoodShouldTeleport =
Math.random() < PROBABILITY_OF_TELPORTATION_FOOD;





setTeleportationCell(0)
if(nextFoodShouldTeleport){
    let secondFoodCell;
    while(true){
        secondFoodCell=randomIntFromInterval(1, maxCellVal);
        if(snakeCells.has(secondFoodCell) || teleportationCell === secondFoodCell) continue
        break
    }
    setFoodShouldTeleport(nextFoodShouldTeleport);
    setTeleportationCell(secondFoodCell)
}



setFoodCell(nextFoodCell);

setFoodShouldReverseDirection(nextFoodShouldReverseDirection);

setScore(score + 1);

}
const handleTeleportConsumption = (originalsnake) =>{
    const maxCellVal = BOARD_SIZE*BOARD_SIZE;
    let nextFoodCell;
    while(true){
        nextFoodCell=randomIntFromInterval(1, maxCellVal);
        if(snakeCells.has(nextFoodCell) || foodCell === nextFoodCell) continue
        break
    }

    
    const nextFoodShouldReverseDirection =
    Math.random() < PROBABILITY_OF_DIRECTION_REVERSAL_FOOD;
    
    const nextFoodShouldTeleport =
    Math.random() < PROBABILITY_OF_TELPORTATION_FOOD;
    
   
    
  
  

   setfakeSnake(originalsnake)
   animateFakeSnake()
   //fakesnake.head = fs.head
   //let fakesnakevalues = new Set(originalSnakeCells)
   //fakesnake.tail=snake.tail
   //setfakeSnakeCells(fakesnakevalues)
   
  
   //Teleport the cell for the real one, add the fake one... 
   setTeleportationCell(0)
   if(nextFoodShouldTeleport){
       let secondFoodCell;
       while(true){
           secondFoodCell=randomIntFromInterval(1, maxCellVal);
           if(snakeCells.has(secondFoodCell) || teleportationCell === secondFoodCell) continue
           break
       }
       setFoodShouldTeleport(nextFoodShouldTeleport);
       setTeleportationCell(secondFoodCell)
   }
    setFoodCell(nextFoodCell);
    setFoodShouldReverseDirection(nextFoodShouldReverseDirection);
    
    setScore(score + 1);
    


    
    
}




const handleGameOver = () => {
    setScore(0);
    const snakeLLStartingValue = getStartingSnakeLLValue(board);    
    setSnake(new SinglyLinkedList(snakeLLStartingValue))
    setSnakeCells(new Set([snakeLLStartingValue.cell])),
    
    setFoodCell(snakeLLStartingValue.cell + 5);
    setTeleportationCell(0);
    setFoodShouldTeleport(false);
    setDirection(Direction.RIGHT);
   

}

return (
    <>
    <button onClick = {()=> moveSnake()}>Move snake 1</button>
    {gameStatus === "titleScreen" && <TitleScreen setGameStatus={setGameStatus} />}

    {gameStatus === "playing" && (
    <>
        
      <h1>Score: {score}</h1>
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
                                fakesnakeCells,
                            );
                            
                            return <div key={cellIdx} className={className}>{cellValue}</div>;
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
const isOutOfBounds = (coords, board) => {
    const {row, col} = coords;
    if(row < 0 || col < 0) return true;
    if(row>= board.length || row >= board[0].length) return true;


    return false;
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
  
  const getCellClassName = (
    cellValue,
    foodCell,
    teleportationCell,
    foodShouldReverseDirection,
    foodShouldTeleport,
    snakeCells,
    fakesnakeCells,
  ) => {
    let className = 'cell';
    if (cellValue === foodCell) {
      if (foodShouldReverseDirection) {
        className = 'cell cell-purple';
      }
      if(foodShouldTeleport){
        className = 'cell cell-orange';
      }
       else {
        className = 'cell cell-red';
      }
    }
    if (cellValue === teleportationCell){
        className = 'cell cell-blue'
    }
    else if (snakeCells.has(cellValue)) className = 'cell cell-green';
 

  
    return className;
  };
  const getRC = (Number) => {
    let row = Math.floor(Number /BOARD_SIZE)
    let col = Math.floor(Number % BOARD_SIZE) -1
    let val = Number
    return {row, col, val}
  }
  export default Board