const login = document.querySelector('#login');
const logout = document.querySelector('#logout');
const myOrders = document.querySelector('#myOrders');
const loginContainer = document.querySelector('#loginContainer');

login.addEventListener('click', printLoginForm);

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
