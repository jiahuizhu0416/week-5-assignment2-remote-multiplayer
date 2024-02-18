const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Tell our Node.js Server to host our P5.JS sketch from the public folder.
app.use(express.static("public"));

// Set up variables to store player positions and trails
let players = {}; // 存储所有玩家的位置信息

// Callback function for what to do when our P5.JS sketch connects and sends us messages
io.on('connection', (socket) => {
    console.log(`New player connected: ${socket.id}`);
    
    // 初始化玩家状态
    players[socket.id] = {
        x: 0,
        y: 0,
        trail: [],
    };

    // 分配初始位置
    const playerIndex = Object.keys(players).length;
    switch (playerIndex) {
        case 1:
            players[socket.id].x = 0;
            players[socket.id].y = 0;
            break;
        case 2:
            players[socket.id].x = 540;
            players[socket.id].y = 0;
            break;
        case 3:
            players[socket.id].x = 0;
            players[socket.id].y = 540;
            break;
        case 4:
            players[socket.id].x = 540;
            players[socket.id].y = 540;
            break;
        default:
            // 如果超过4个玩家，可以选择重新分配位置或拒绝连接
            break;
    }

    // 通知所有玩家更新状态
    io.emit('playersUpdate', players);

    socket.on('move', (data) => {
        // 更新玩家位置和轨迹
        players[socket.id].x = data.x;
        players[socket.id].y = data.y;
        players[socket.id].trail.push({ x: data.x, y: data.y });

        // 广播更新后的游戏状态给所有客户端
        io.emit('gameStateUpdate', players);
    });

    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
        delete players[socket.id];

        // 广播更新后的游戏状态给所有客户端
        io.emit('gameStateUpdate', players);
    });
});

function assignInitialPosition(socketId) {
    // Your logic to assign initial position, keeping as is from your example
    const playerIndex = Object.keys(players).length;
    switch (playerIndex) {
        case 1: players[socketId].x = 0; players[socketId].y = 0; break;
        case 2: players[socketId].x = 540; players[socketId].y = 0; break;
        case 3: players[socketId].x = 0; players[socketId].y = 540; break;
        case 4: players[socketId].x = 540; players[socketId].y = 540; break;
        // Handle more than 4 players if needed
    }
}

// 添加路由处理程序
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// 启动服务器
server.listen(3000, '0.0.0.0',() => {
    console.log('Server is running on port 3000');
});