const login = document.querySelector('#login');
const logout = document.querySelector('#logout');
const myOrders = document.querySelector('#myOrders');
const loginContainer = document.querySelector('#loginContainer');
const mainContainer = document.querySelector('#mainContainer');
const headerLogo = document.querySelector('#headerLogo');

let newUserName;
let newUserEmail;
let newUserPassword;

login.addEventListener('click', printLoginForm);
logout.addEventListener('click', logoutUser);
headerLogo.addEventListener('click', printOptions);

/**
 * -----------------------------
 * ---- LOGIN FUNCTIONS --------
 * -----------------------------
 */

if (localStorage.getItem('user')) {
  // ÄR INLOGGAD
  printLogoutBtn();
} else {
  // ÄR INTE INLOGGAD
  printLoginBtn();
}

function toggleLoginContainer() {
  loginContainer.classList.toggle('hidden');
}

function logoutUser() {
  localStorage.removeItem('user');
  localStorage.removeItem('key');
  printLoginBtn();
}

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
  loginBtn.classList.add('button');
  const newUserBtn = document.createElement('button');
  newUserBtn.innerText = 'Create new user';
  newUserBtn.classList.add('button');
  newUserBtn.addEventListener('click', newUserForm);
  const closeLoginBtn = document.createElement('button');
  closeLoginBtn.innerText = 'X';
  closeLoginBtn.ariaLabel = 'Close Login';
  closeLoginBtn.classList.add('close_login');

  closeLoginBtn.addEventListener('click', toggleLoginContainer);

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
    newUserBtn,
    closeLoginBtn
  );
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

/**
 * -----------------------------
 * ---- NEW USER FUNCTIONS -----
 * -----------------------------
 */

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
  createNewUserBtn.classList.add('button');
  const closeLoginBtn = document.createElement('button');
  closeLoginBtn.innerText = 'X';
  closeLoginBtn.ariaLabel = 'Close Login';
  closeLoginBtn.classList.add('close_login');

  closeLoginBtn.addEventListener('click', toggleLoginContainer);

  createNewUserBtn.addEventListener('click', saveNewUser);

  loginContainer.append(
    newUserHeader,
    newUserName,
    newUserEmail,
    newUserPassword,
    createNewUserBtn,
    closeLoginBtn
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

/**
 * -----------------------------
 * ------ MAIN FUNCTIONS -------
 * -----------------------------
 */

function printOptions() {
  mainContainer.innerHTML = '';
  const mainHeader = document.createElement('h1');
  mainHeader.innerText = 'Welcome to a webshop!';
  const viewAllBtn = document.createElement('button');
  viewAllBtn.innerText = 'View all products';
  viewAllBtn.classList.add('view_all_btn');
  const byCategoryHeader = document.createElement('h2');
  byCategoryHeader.innerText = 'Or view by categories:';
  byCategoryHeader.classList.add('category_header');
  const categoryBtnContainer = document.createElement('div');
  categoryBtnContainer.classList.add('category_container');

  viewAllBtn.addEventListener('click', printAllProducts);

  mainContainer.append(
    mainHeader,
    viewAllBtn,
    byCategoryHeader,
    categoryBtnContainer
  );

  fetch('http://localhost:3000/api/categories')
    .then((res) => res.json())
    .then((categories) => {
      categories.forEach((category) => {
        fetch(`http://localhost:3000/api/products/category/${category._id}`)
          .then((res) => res.json())
          .then((products) => {
            if (products.length === 0) {
              return;
            }
            console.log('products:', products);
            const categoryBtn = document.createElement('button');
            categoryBtn.innerText = category.name;
            categoryBtn.classList.add('category_btn');
            categoryBtn.addEventListener('click', () => {
              mainContainer.innerHTML = '';
              const productList = document.createElement('ul');
              productList.classList.add('card_container');
              products.forEach((product) => {
                const listItem = document.createElement('li');
                listItem.classList.add('product_card');
                listItem.innerText = product.name;
                const placeholderImg = document.createElement('img');
                placeholderImg.src = 'src/img/placeholder.webp';
                placeholderImg.alt = 'Placeholder img';
                placeholderImg.width = '768';
                placeholderImg.height = '1024';
                placeholderImg.classList.add('card_img');
                listItem.append(placeholderImg);
                productList.appendChild(listItem);
              });
              mainContainer.append(productList);
            });
            categoryBtnContainer.append(categoryBtn);
          })
          .catch((error) => {
            console.error('Error when trying to fetch products:', error);
          });
      });
    })
    .catch((error) => {
      console.error('Error trying to fetch categories:', error);
    });
}
printOptions();

/**
 * -----------------------------
 * ---- PRODUCT FUNCTIONS ------
 * -----------------------------
 */

function printAllProducts() {
  mainContainer.innerHTML = '';
  const allProductsContainer = document.createElement('div');
  allProductsContainer.classList.add('all_products_container');
  mainContainer.append(allProductsContainer);

  const allProductsHeader = document.createElement('h2');
  allProductsHeader.innerText = 'All products';

  fetch('http://localhost:3000/api/products')
    .then((res) => res.json())
    .then((products) => {
      products.map((product) => {
        const li = document.createElement('li');
        li.innerText = product.name;

        allProductsContainer.appendChild(li);
      });
    });

  allProductsContainer.append(allProductsHeader);
}
