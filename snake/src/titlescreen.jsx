import "./Board.css"
import BlockDescription from "./Blockdescription"

function TitleScreen({ setGameStatus }) {
  

    return (
        <div className="title-screen">
        <h1>Welcome to Elite Snake</h1>
       
        <BlockDescription/>

        <button className="btn-pink button-23" onClick={() => setGameStatus("playing")}>Play</button>
        </div>

    )
        
  }
  
  export default TitleScreen
  