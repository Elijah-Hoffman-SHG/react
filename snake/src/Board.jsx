import {useState, useRef} from "react"

import { useEffect } from "react";

const Board = ({gameboard, snakeCells, foodCell, teleportationCell, foodShouldReverseDirection, foodShouldTeleport}) => {
  const [gameboard2, setBoard2] = useState(gameboard);
  const [snakeCells2, setSnakeCells2] = useState(snakeCells);
  const [foodCell2, setFoodCell2] = useState(foodCell);
  const [teleportationCell2, setTeleportationCell2] =useState(teleportationCell);
  const [foodShouldReverseDirection2, setFoodShouldReverseDirection2] = useState(foodShouldReverseDirection);
  const [foodShouldTeleport2, setFoodShouldTeleport2] = useState(foodShouldTeleport);
  useEffect(() => {
    setBoard2(gameboard);
    setSnakeCells2(snakeCells);
    setFoodCell2(foodCell);
    setTeleportationCell2(teleportationCell);
    setFoodShouldReverseDirection2(foodShouldReverseDirection);
    setFoodShouldTeleport2(foodShouldTeleport);
  }, [gameboard, snakeCells, foodCell, teleportationCell, foodShouldReverseDirection, foodShouldTeleport]);
return (
  <>
  {gameboard2.map((row, rowIdx) => (
    <div key={rowIdx} className="row">
      {row.map((cellValue, cellIdx) => {
        const cellColor = getCellColor(
        cellValue,
        foodCell2,
        teleportationCell2,
        foodShouldReverseDirection2,
        foodShouldTeleport2,
        snakeCells2,       
      );  
        return <div key={cellIdx} className="cell" style={{backgroundColor: cellColor}}></div>;
       })}
      </div>
    ))}  
  </>
    )};         
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