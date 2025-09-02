const express = require("express");
const http = require("http");

const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server);  

const path = require('path');

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('A user connected!');

    socket.on('chat message', (msg) => {
        console.log('message: '+ msg);

        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})