import "./Board.css"
import BlockDescription from "./Blockdescription"
import io from 'socket.io-client'
import SocketTesting from "./sockettesting"
const socket = io.connect("http://localhost:5174")

function TitleScreen({ setGameStatus }) {
  

    return (
        
        <div className="title-screen">
            <SocketTesting/>
        <h1>Welcome to Elite Snake</h1>
       
        <BlockDescription/>

        <button className="btn-pink button-23" onClick={() => setGameStatus("playing")}>Play</button>
        </div>

    )
        
  }
  
  export default TitleScreen
  