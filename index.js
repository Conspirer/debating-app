const express = require("express");
const http = require("http");

const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: '*', // Allow all origins for testing purposes
    },
    transports: ['polling'],
  }); 

const path = require('path');

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', (socket) => {
    console.log('A user connected!');

    socket.on('join topic', async (topic) => {
        const rooms = Array.from(socket.rooms);
        rooms.forEach(room => {
            if ( room !== socket.id ) {
                socket.leave(room);
                console.log(`User left room:${room}`);
            }
        });

        socket.join(topic);
        console.log(`User joined topic: ${topic}`);
        io.to(socket.id).emit('chat message', `Welcome! You have joined the topic: ${topic}.`);
    });

    socket.on('chat message', (data) => {
        const { topic, msg } = data;
        console.log(`Message from topic "${topic}": ${msg}`);
        io.to(topic).emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})