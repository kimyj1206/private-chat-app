const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const { default: mongoose } = require('mongoose');
const crypto = require('crypto');

const server = http.createServer(app);
const io = new Server(server);

// mongoose configuration
mongoose.connect(`mongodb+srv://kimyj159297:kimyj7288@private-chat-app.pmfwnnh.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => {
    console.log('DB CONNECTION SUCCESSFUL');
  })
  .catch((error) => {
    console.log('DB CONNECTION ERROR => ' + error);
  })

// 호출할 때마다 새롭게 랜덤 아이디 생성
const randomId = () => {
  crypto.randomBytes(8).toString('hex');
};

app.post('/session', (req, res) => {
  const data = {
    userName: req.body.userName,
    userId: randomId()
  };

  // 만든 session을 client에게 응답으로 보내줌
  res.send(data);
});

// middleware
io.use((socket, next) => {
  const userName = socket.handshake.auth.userName;
  const userId = socket.handshake.auth.userId;
  
  if(!userName) {
    return next(new Error('Invalid userName'));
  }

  socket.userName = userName;
  socket.id = userId;

  next();
});


// array에 user info save
// 위의 middleware를 잘 통과한 애들만 users에 들어옴
let users = [];

// socket이 connection 되었을 때 실행
io.on('connection', async (socket) => {

  // 1명의 user info를 저장
  let userDate = {
    userName: socket.userName,
    userId: socket.id
  };
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