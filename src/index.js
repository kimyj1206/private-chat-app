const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const { default: mongoose } = require('mongoose');

const server = http.createServer(app);
const io = new Server(server);

// mongoose configuration
mongoose.connect(``)
  .then(() => {
    console.log('DB CONNECTION SUCCESSFUL');
  })
  .catch((error) => {
    console.log('DB CONNECTION ERROR => ' + error);
  })


// array에 user info save
let users = [];

// socket이 connection 되었을 때 실행
io.on('connection', async (socket) => {

  // 1명의 user info를 저장
  let userDate = {};
  users.push(userDate);

  //users-data라는 event 이름을 가지며 client에게 users를 보내줌
  io.emit('users-data', { users });

  // message를 client에서 server로 오는 것을 받아줌
  socket.on('message-to-server', () => {

  });

  // db에서 message 가져옴
  socket.on('fetch-messages', () => {

  });

  // user가 방에서 나갔을 때 실행
  socket.on('disconnect', () => {

  });

});



// static file path configuration
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// client send body parsing configuration
app.use(express.json());

// port configuration
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});