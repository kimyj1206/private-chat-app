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
const loginForm = document.querySelector('.login-form');

// login form handler
loginForm.addEventListener('submit', (e) => {

  // page refresh 방지
  e.preventDefault();

  // input 요소를 잡아줘서 그 값을 받아오고, 영어라면 소문자 변경
  const userName = document.getElementById('userName');
  createSession(userName.value.toLowerCase());
  // userName 빈 값 처리
  userName.value = '';
});

// user session handler
const createSession = async (userName) => {

  const options = {
    method: 'Post',
    headers: { 'Content-Type' : 'application/json' },
    body: JSON.stringify({ userName })
  };

  // server에서 해당 request를 처리
  await fetch('/session', options)
    // response 온 것을 json 형태로 변환
    .then(res => res.json())
    // 해당 결과를 data에 넣어서 server에서 만들어준 user session data를 통해 socket과 connect
    .then(data => {
      socketConnect(data.userName, data.userId);

      // localStorage에 session data Set
      localStorage.setItem('session-userName', data.userName);
      localStorage.setItem('session-userId', data.userId);

      loginContainer.classList.add('d-none');
      chatBody.classList.remove('d-none');
      userTitle.innerHTML = data.userName;
    })
    .catch((error) => {
      console.log(error);
    })
};

const socketConnect = async (userName, userId) => {
  socket.auth = { userName: userName, userId: userId };

  await socket.connect();
};

socket.on('users-data', ({ users }) => {
  // 리스트 나열 시 자신은 포함이 되면 안됨 => 자신은 제거
  const index = users.findIndex(user => user.userId === socket.id);

  // array에 user가 없다면 -1을 리턴함
  if(index > -1) {
    users.splice(index, 1);
  }
});