import { useState, useEffect } from 'react'
import './SocketTesting.css'
import io from 'socket.io-client'
const socket = io.connect("http://localhost:5174")


function SocketTesting() {
  const [room, setRoom] = useState("");

  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  //can only emit message to a backend, so backend has to be middle man
  const sendMessage = () =>{
    socket.emit("send_message",  { message, room });
  };
  const snakes ={}



 

  
  const joinRoom = () =>{
    if(room !== ""){
    socket.emit("join_room", room);
    }
  };

  useEffect(()=>{
    socket.on("receive_message", (data)=>{
      setMessageReceived(data.message)
    })

  }, [socket])

  return (
    <>
    <div className='SocketTesting'>
    <input placeholder='Room number' onChange={(event)=>{
        setRoom(event.target.value)
      }}/>
      <button onClick = {joinRoom}>Join Room</button>

      <input placeholder='message' onChange={(event)=>{
        setMessage(event.target.value)
      }}/>
      <button onClick = {sendMessage}>Send message</button>
      <h1>Message:</h1>
      {messageReceived}
    </div>
    </>
  )
}

export default SocketTesting
