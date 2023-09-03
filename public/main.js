const socket = io('http://localhost:3000', {
  // 앱에 들어갔을 때 바로 실행되는 것이 아니라 로그인 후에 실행되어야 하기에
  autoConnect: false
});

socket.onAny((event, ...args) => {
  console.log(event, ...args);
});

// global variables
const chatBody = document.querySelector('.chat-body');
const userTitle = document.querySelector('.user-title');
const loginContainer = document.querySelector('.login-container');
const userTable = document.querySelector('.users');
const userTagline = document.querySelector('#users-tagline');
const title = document.querySelector('#active-user');
const message = document.querySelector('.messages');
const msgDiv = document.querySelector('.msg-form');