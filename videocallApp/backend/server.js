const express = require("express");
const app = express()
const server = require("http").createServer(app)
const cors = require("cors")
const io = require("socket.io")(server,{
    cors:{
        origin:"*",
        methods:["*"]
    }
})
app.use(cors())
const port =process.env.PORT||3001
server.listen(port,()=>{
    console.log(`server is listening on ${port}`);
})
 app.get('/',(req,res)=>{
  
    res.send("the server is running")

 })
 io.on('connection',function(socket){
    socket.emit('me',socket.id)
    socket.on('disconnect',()=>{
        socket.broadcast.emit("cancelled")
    })
    socket.on('calluser',({userToCall,signalData,from,name})=>{
        // console.log("what",userToCall,signalData,from,name);
        io.to(userToCall).emit("calluser",{signal:signalData,from,name})
    })
    socket.on("answerCall",(data)=>{
      
        io.to(data.to).emit("callaccepted",data.signal)
    })
 })