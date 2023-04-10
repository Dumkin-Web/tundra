const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');
const { Chat, Message } = require("../models/models");

const io = (server) => { 
    const io = new Server(server, {
            cors: {
            origin: '*',
            methods: ["GET", "POST"],
            },
        });

        io.on("connection", (socket) => {
            console.log("a user connected");
            const { token } = socket.handshake.auth;
        
            try{
                const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            } catch(e){
                socket.disconnect()
                console.log('no access');
            }

            socket.on("disconnect", () => {

              console.log("user disconnected");

            });
          
            socket.on("chats", () => {
                const { projectId } = socket.handshake.auth;
                socket.join(projectId);
                console.log('user connected to chat');
            });
          
            socket.on("private_message", ({ message }) => {

                const { projectId, userId } = socket.handshake.auth;
                //io.to(projectId).emit("private_message", { userId, message });
                
                Chat.findOne({where: {projectId}}).then(({id}) => {
                    Message.create({text: message, chatId: id, senderId: userId}).then(newMessage => {
                        io.to(projectId).emit("private_message", newMessage);
                    })
                })
        
            });

            socket.on("projectUpdate", () => {

                const { projectId, userId } = socket.handshake.auth;
                io.to(projectId).emit("projectUpdate", { dontUpdateId: userId });
        
            });

        });
    return io
}



module.exports = io
