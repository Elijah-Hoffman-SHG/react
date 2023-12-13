import "./Board.css"
import { useState } from "react";
import BlockDescription from "./Blockdescription"


function TitleScreen({ setGameStatus, title, handleStart, inputcolor, inputname }) {
  const [color, setColor] = useState(inputcolor); // Default color is red
  const [name, setName] = useState(inputname);
  const handleColorChange = (event) => {
      setColor(event.target.value);
  }
  const handleNameChange = (event) => {
    setName(event.target.value);
  }
   // Default name is "Player 1"

  const handleStartClick = () => {
      handleStart(color, name); // Pass the color to handleStart
  }
  let usingcolor = color || inputcolor || "#48CFAD"
  
  return (
    <div className="title-screen">
      <h1>{title}</h1>
      <BlockDescription color = {usingcolor}/>
      <h2>Choose your color:</h2>
      <input type="color" value={usingcolor} onChange={handleColorChange} />
      <h2>Choose your name:</h2>
      <input type="text" value={name || "player"} onChange={handleNameChange} />
      <button className="btn-pink button-23" onClick={handleStartClick}>Play</button>
    </div>
  )
}
  
  export default TitleScreen