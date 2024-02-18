//const socket = io();
let gridSize = 60; // 方格的大小
let rows, cols;
let player1X = 0;
let player1Y = 0;
let player1Trail = []; // 玩家1的路径
let player2X = 540;
let player2Y = 0;
let player2Trail = []; // 玩家2的路径
let player3X = 0;
let player3Y = 540;
let player3Trail = []; // 玩家3的路径
let player4X = 540;
let player4Y = 540;
let player4Trail = []; // 玩家4的路径
let socket;
let trail;

let gameStartTime; // 游戏开始时间
let winnerText = ""; // 用于显示获胜者信息的文本
let backgroundImage; // 用于存储背景图片

function preload() {
  // 加载背景图片
  backgroundImage = loadImage('9bg.png');
}

function setup() {
  createCanvas(900, 600); // 创建一个800x800的画布
  // 设置背景图片
  socket = io.connect('http://172.20.10.4:3000'); 

  socket.on('connect', function() {
    console.log('Socket connected successfully!');
    // 连接成功后，您可以执行其他操作，如向服务器发送消息或从服务器接收数据
  });

  image(backgroundImage, 0, 0, width, height);
  //rect(100,100,600,600)
  rows = width / gridSize;
  cols = height / gridSize;
  drawGrid();

  // 设置游戏开始时间
  gameStartTime = millis();

  // 在指定时间后检查获胜者
  setTimeout(checkWinner, 20000); // 20秒后检查

  socket.on('playerPositionUpdate', function(data) {
    // 更新玩家位置信息
    player1X = data.x;
    player1Y = data.y;
    player2X = data.x;
    player2Y = data.y;
    player3X = data.x;
    player3Y = data.y;
    player4X = data.x;
    player4Y = data.y;
    // 重新绘制游戏状态
    drawGrid();
});

  socket.on('gameStateUpdate', function(gameState) {

    Object.keys(gameState).forEach(playerId => {
      let player = gameState[playerId];
    // 更新游戏状态，例如玩家位置和轨迹
    if (playerId === "player1ID") { // 假设当前客户端为玩家1
      player1X = player.x;
      player1Y = player.y;
      player1Trail = player.trail;
  }
  if (playerId === "player2ID") { // 假设当前客户端为玩家1
    player2X = player.x;
    player2Y = player.y;
    player2Trail = player.trail;
}
if (playerId === "player3ID") { // 假设当前客户端为玩家1
  player3X = player.x;
  player3Y = player.y;
  player3Trail = player.trail;
}
if (playerId === "player4ID") { // 假设当前客户端为玩家1
  player4X = player.x;
  player4Y = player.y;
  player4Trail = player.trail;
}

});
    // 更新其他玩家的状态
    drawGrid(); // 重新绘制游戏状态
  });

}

function draw() {
  // 不再在draw函数中处理按键事件
  
  // 显示获胜者信息
 
  textSize(20);
  fill(0);
  text(winnerText, 10, height - 20); // 在画布底部显示获胜者信息
  
}

function drawGrid() {
  // 不再在这里绘制网格，因为背景已经是网格图片了
  // 只需绘制玩家和轨迹即可
  drawTrail(player1Trail, '🍚'); // 绘制玩家1的路径，使用emoji 🍚
  drawTrail(player2Trail, '🥔'); // 绘制玩家2的路径，使用emoji 🥔
  drawTrail(player3Trail, '🍠'); 
  drawTrail(player4Trail, '🌾'); 
  drawPlayer(player1X, player1Y, '🍚'); // 绘制玩家1，使用emoji 🍚
  drawPlayer(player2X, player2Y, '🥔'); // 绘制玩家2，使用emoji 🥔
  drawPlayer(player3X, player3Y, '🍠'); // 绘制玩家2，使用emoji 🥔
  drawPlayer(player4X, player4Y, '🌾'); // 绘制玩家2，使用emoji 🥔
  
  console.log("Player 1 trails:", player1Trail.length);
  console.log("Player 2 trails:", player2Trail.length);
  console.log("Player 3 trails:", player3Trail.length);
  console.log("Player 4 trails:", player4Trail.length);
}

function drawPlayer(x, y, emoji) {
  textSize(gridSize); // 设置文本大小为方格大小
  text(emoji, x, y + gridSize); // 在方格中心绘制emoji
}

function drawTrail(trail, emoji) {

  if (!trail) {
    console.error('Trail is undefined.');
    return; // 直接返回，避免进一步的错误
  }
  trail.forEach(point => {
    let x = point.x;
    let y = point.y;
    // 根据 x, y 绘制轨迹，这里的绘制逻辑保持不变
});
  textSize(gridSize); // 设置文本大小为方格大小
  for (let i = 0; i < trail.length; i++) {
    let x = trail[i].x;
    let y = trail[i].y;
    text(emoji, x, y + gridSize); // 在方格中心绘制emoji
  }
}

function updateTrail(trail, x, y, opponentTrail1, opponentTrail2, opponentTrail3) {
  let idx = x / gridSize + y / gridSize * cols;
  trail.push(idx); // 将当前方格的位置添加到轨迹数组中
  
  // 检查新添加的轨迹是否已经存在于对手的路径中
  if (opponentTrail1.includes(idx)) {
    // 如果存在，则从对手的路径数组中移除该位置
    let opponentIdx = opponentTrail1.indexOf(idx);
    opponentTrail1.splice(opponentIdx, 1);
  }
  if (opponentTrail2.includes(idx)) {
    // 如果存在，则从对手的路径数组中移除该位置
    let opponentIdx = opponentTrail2.indexOf(idx);
    opponentTrail2.splice(opponentIdx, 1);
  }
  if (opponentTrail3.includes(idx)) {
    // 如果存在，则从对手的路径数组中移除该位置
    let opponentIdx = opponentTrail3.indexOf(idx);
    opponentTrail3.splice(opponentIdx, 1);
  }
  
  // 将当前位置替换为当前玩家的路径
  for (let i = 0; i < opponentTrail1.length; i++) {
    if (opponentTrail1[i] === idx) {
      opponentTrail1[i] = x / gridSize + y / gridSize * cols;
    }
  }
  for (let i = 0; i < opponentTrail2.length; i++) {
    if (opponentTrail2[i] === idx) {
      opponentTrail2[i] = x / gridSize + y / gridSize * cols;
    }
  }
  for (let i = 0; i < opponentTrail3.length; i++) {
    if (opponentTrail3[i] === idx) {
      opponentTrail3[i] = x / gridSize + y / gridSize * cols;
    }
  }
  
  // 发送位置更新到服务器端
  socket.emit('playerPositionUpdate', {x: x, y: y});
  socket.emit('move', {x: x, y: y});
}

function keyPressed() {
  // 玩家1的按键控制
  if ((keyCode === UP_ARROW || key === 'W') && player1Y - gridSize >= 0) {
    player1Y -= gridSize;
    updateTrail(player1Trail, player1X, player1Y, player2Trail, player3Trail, player4Trail);
  } else if ((keyCode === DOWN_ARROW || key === 'S') && player1Y + gridSize < height) {
    player1Y += gridSize;
    updateTrail(player1Trail, player1X, player1Y, player2Trail, player3Trail, player4Trail);
  } else if ((keyCode === LEFT_ARROW || key === 'A') && player1X - gridSize >= 0) {
    player1X -= gridSize;
    updateTrail(player1Trail, player1X, player1Y, player2Trail, player3Trail, player4Trail);
  } else if ((keyCode === RIGHT_ARROW || key === 'D') && player1X + gridSize < width) {
    player1X += gridSize;
    updateTrail(player1Trail, player1X, player1Y, player2Trail, player3Trail, player4Trail);
  }

  // 玩家2的按键控制
  if ((key === 'w') && player2Y - gridSize >= 0) {
    player2Y -= gridSize;
    updateTrail(player2Trail, player2X, player2Y, player1Trail, player3Trail, player4Trail);
  } else if ((key === 's') && player2Y + gridSize < height) {
    player2Y += gridSize;
    updateTrail(player2Trail, player2X, player2Y, player1Trail, player3Trail, player4Trail);
  } else if ((key === 'a') && player2X - gridSize >= 0) {
    player2X -= gridSize;
    updateTrail(player2Trail, player2X, player2Y, player1Trail, player3Trail, player4Trail);
  } else if ((key === 'd') && player2X + gridSize < width) {
    player2X += gridSize;
    updateTrail(player2Trail, player2X, player2Y, player1Trail, player3Trail, player4Trail);
  }
  
  // 玩家3的按键控制
  if ((key === '1') && player3Y - gridSize >= 0) {
    player3Y -= gridSize;
    updateTrail(player3Trail, player3X, player3Y, player1Trail, player2Trail, player4Trail);
  } else if ((key === '2') && player3Y + gridSize < height) {
    player3Y += gridSize;
    updateTrail(player3Trail, player3X, player3Y, player1Trail, player2Trail, player4Trail);
  } else if ((key === '3') && player3X - gridSize >= 0) {
    player3X -= gridSize;
    updateTrail(player3Trail, player3X, player3Y, player1Trail, player2Trail, player4Trail);
  } else if ((key === '4') && player3X + gridSize < width) {
    player3X += gridSize;
    updateTrail(player3Trail, player3X, player3Y, player1Trail, player2Trail, player4Trail);
  }
  
  // 玩家4的按键控制
  if ((key === 'i') && player4Y - gridSize >= 0) {
    player4Y -= gridSize;
    updateTrail(player4Trail, player4X, player4Y, player1Trail, player2Trail, player3Trail);
  } else if ((key === 'k') && player4Y + gridSize < height) {
    player4Y += gridSize;
    updateTrail(player4Trail, player4X, player4Y, player1Trail, player2Trail, player3Trail);
  } else if ((key === 'j') && player4X - gridSize >= 0) {
    player4X -= gridSize;
    updateTrail(player4Trail, player4X, player4Y, player1Trail, player2Trail, player3Trail);
  } else if ((key === 'l') && player4X + gridSize < width) {
    player4X += gridSize;
    updateTrail(player4Trail, player4X, player4Y, player1Trail, player2Trail, player3Trail);
  }

  // 重新绘制网格
  drawGrid();
}

function checkWinner() {
  let currentTime = millis();
  let elapsedTime = (currentTime - gameStartTime) / 1000; // 毫秒转换为秒

  // 计算轨迹最长的玩家
  let maxTrailLength = Math.max(player1Trail.length, player2Trail.length, player3Trail.length, player4Trail.length);
  let winner = '';
  if (player1Trail.length === maxTrailLength) {
    winner = 'Player 1';
  } else if (player2Trail.length === maxTrailLength) {
    winner = 'Player 2';
  } else if (player3Trail.length === maxTrailLength) {
    winner = 'Player 3';
  } else if (player4Trail.length === maxTrailLength) {
    winner = 'Player 4';
  }
  
  // 输出获胜者信息
  winnerText = `Winner: ${winner} with ${maxTrailLength} trails!`;

  // 如果游戏时间不足20秒，则延迟剩余时间后再次检查
  if (elapsedTime < 20) {
    let remainingTime = (20 - elapsedTime) * 1000; // 秒转换为毫秒
    setTimeout(checkWinner, remainingTime);
  }
}