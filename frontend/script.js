const login = document.querySelector('#login');
const logout = document.querySelector('#logout');
const myOrders = document.querySelector('#myOrders');
const loginContainer = document.querySelector('#loginContainer');

let newUserName;
let newUserEmail;
let newUserPassword;

login.addEventListener('click', printLoginForm);
logout.addEventListener('click', logoutUser);

function logoutUser() {
  localStorage.removeItem('user');
  localStorage.removeItem('key');
  printLoginBtn();
}

function toggleLoginContainer() {
  loginContainer.classList.toggle('hidden');
}

// Login user
function printLoginForm() {
  toggleLoginContainer();
  loginContainer.innerHTML = '';
  const loginHeader = document.createElement('h2');
  loginHeader.innerText = 'Login';
  const inputEmail = document.createElement('input');
  inputEmail.placeholder = 'Email';
  const inputPassword = document.createElement('input');
  inputPassword.placeholder = 'Password';
  inputPassword.type = 'password';
  const loginBtn = document.createElement('button');
  loginBtn.innerText = 'Log in';
  const newUserBtn = document.createElement('button');
  newUserBtn.innerText = 'Create new user';
  newUserBtn.addEventListener('click', newUserForm);

  loginBtn.addEventListener('click', () => {
    const sendLogin = {
      email: inputEmail.value,
      password: inputPassword.value,
    };

    fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sendLogin),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('user', data);

        if (data.user && data.key) {
          localStorage.setItem('user', data.user);
          localStorage.setItem('key', data.key);
          printLogoutBtn();
          toggleLoginContainer();
        } else {
          alert(data.message);
        }
      });
  });

  loginContainer.append(
    loginHeader,
    inputEmail,
    inputPassword,
    loginBtn,
    newUserBtn
  );
}

function newUserForm() {
  loginContainer.innerHTML = '';
  const newUserHeader = document.createElement('h2');
  newUserHeader.innerText = 'Create new user';
  newUserName = document.createElement('input');
  newUserName.placeholder = 'Name';
  newUserEmail = document.createElement('input');
  newUserEmail.placeholder = 'Email';
  newUserPassword = document.createElement('input');
  newUserPassword.placeholder = 'Password';
  newUserPassword.type = 'password';
  const createNewUserBtn = document.createElement('button');
  createNewUserBtn.innerText = 'Create and log in user';

  createNewUserBtn.addEventListener('click', saveNewUser);

  loginContainer.append(
    newUserHeader,
    newUserName,
    newUserEmail,
    newUserPassword,
    createNewUserBtn
  );
}

function saveNewUser() {
  const sendUser = {
    name: newUserName.value,
    email: newUserEmail.value,
    password: newUserPassword.value,
  };

  console.log('user', sendUser);

  fetch('http://localhost:3000/api/users/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sendUser),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      localStorage.setItem('user', data.user);
      localStorage.setItem('key', data.key);
      toggleLoginContainer();
      printLogoutBtn();
    });
}

if (localStorage.getItem('user')) {
  // ÄR INLOGGAD
  printLogoutBtn();
} else {
  // ÄR INTE INLOGGAD
  printLoginBtn();
}

function printLogoutBtn() {
  login.classList.add('hidden');
  logout.classList.remove('hidden');
  myOrders.classList.remove('hidden');
}

function printLoginBtn() {
  login.classList.remove('hidden');
  logout.classList.add('hidden');
  myOrders.classList.add('hidden');
}
