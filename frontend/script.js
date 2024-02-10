const login = document.querySelector('#login');
const logout = document.querySelector('#logout');
const myOrders = document.querySelector('#myOrders');
const toCart = document.querySelector('#toCart');
const loginContainer = document.querySelector('#loginContainer');
const mainContainer = document.querySelector('#mainContainer');
const headerLogo = document.querySelector('#headerLogo');

let newUserName;
let newUserEmail;
let newUserPassword;
let productStockStatus =
  JSON.parse(localStorage.getItem('productStockStatus')) || {};

login.addEventListener('click', printLoginForm);
logout.addEventListener('click', logoutUser);
myOrders.addEventListener('click', printOrders);
toCart.addEventListener('click', printCartProducts);
headerLogo.addEventListener('click', printOptions);

// Check login state
if (localStorage.getItem('user')) {
  printLogoutBtn();
} else {
  printLoginBtn();
}

/**
 * -----------------------------
 * ---- LOGIN FUNCTIONS --------
 * -----------------------------
 */

function toggleLoginContainer() {
  loginContainer.classList.toggle('hidden');
}

function logoutUser() {
  localStorage.removeItem('user');
  localStorage.removeItem('key');
  localStorage.removeItem('products');
  localStorage.removeItem('productStockStatus');
  productStockStatus =
    JSON.parse(localStorage.getItem('productStockStatus')) || {};
  printLoginBtn();
  printOptions();
}

function printLoginForm() {
  toggleLoginContainer();
  loginContainer.innerHTML = '';

  const loginHeader = createH2('Login');
  const inputEmail = createInput('Email', 'email');
  const inputPassword = createInput('Password', 'password', 'password');
  const loginBtn = createBtn('Log in', 'button', function () {
    const email = inputEmail.value;
    const password = inputPassword.value;
    loginUser(email, password);
  });
  const newUserBtn = createBtn('Create new user', 'button', newUserForm);
  const closeLoginBtn = createCloseButton();

  loginContainer.append(
    loginHeader,
    inputEmail,
    inputPassword,
    loginBtn,
    newUserBtn,
    closeLoginBtn
  );
}

function loginUser(email, password) {
  fetch('http://localhost:3000/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
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
}

function printLogoutBtn() {
  login.classList.add('hidden');
  logout.classList.remove('hidden');
  myOrders.classList.remove('hidden');
  toCart.classList.remove('hidden');
}

function printLoginBtn() {
  login.classList.remove('hidden');
  logout.classList.add('hidden');
  myOrders.classList.add('hidden');
  toCart.classList.add('hidden');
}

function needToLogin() {
  toggleLoginContainer();
  loginContainer.innerHTML = '';

  const loginNeededMsg = createH2('You need to login to add items to cart');
  const getLoggedInBtn = createBtn('Take me to login', 'button', () => {
    toggleLoginContainer();
    printLoginForm();
  });
  const closeLoginBtn = createCloseButton();

  loginContainer.append(loginNeededMsg, getLoggedInBtn, closeLoginBtn);
}

/**
 * -----------------------------
 * ---- NEW USER FUNCTIONS -----
 * -----------------------------
 */

function newUserForm() {
  loginContainer.innerHTML = '';

  const newUserHeader = createH2('Create new user');
  newUserName = createInput('Name', 'text');
  newUserEmail = createInput('Email', 'email');
  newUserPassword = createInput('Password', 'password', 'password');
  const createNewUserBtn = createBtn(
    'Create and log in user',
    'button',
    saveNewUser
  );
  const closeLoginBtn = createCloseButton();

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
  mainHeader.innerText = 'Welcome to the world leading webshop!';
  const viewAllBtn = createBtn(
    'View all products',
    'view_all_btn',
    printAllProducts
  );
  const byCategoryHeader = createH2('Or view by categories:');
  byCategoryHeader.classList.add('category_header');
  const categoryBtnContainer = document.createElement('div');
  categoryBtnContainer.classList.add('category_container');

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
            if (products.length > 0) {
              const categoryBtn = createBtn(
                category.name,
                'category_btn',
                function () {
                  printProductsByCategory(category._id, category.name);
                }
              );
              categoryBtnContainer.appendChild(categoryBtn);
            }
          })
          .catch((error) => {
            console.error(
              'Error trying to fetch the products of the category:',
              error
            );
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

  const allProductsHeader = createH2('All products');
  const ul = document.createElement('ul');
  ul.classList.add('all_cards_container');

  fetch('http://localhost:3000/api/products')
    .then((res) => res.json())
    .then((products) => {
      products.forEach((product) => {
        const productCard = createProductCard(product);
        ul.appendChild(productCard);
      });
    })
    .catch((error) => {
      console.error('Error when trying to fetch products:', error);
    });

  mainContainer.append(allProductsHeader, ul);
}

function printProductsByCategory(categoryId, categoryName) {
  mainContainer.innerHTML = '';

  fetch(`http://localhost:3000/api/products/category/${categoryId}`)
    .then((res) => res.json())
    .then((products) => {
      const categoryHeader = createH2(categoryName);
      const productList = document.createElement('ul');
      productList.classList.add('card_container');

      products.forEach((product) => {
        const productCard = createProductCard(product);
        productList.appendChild(productCard);
      });
      mainContainer.append(categoryHeader, productList);
    })
    .catch((error) => {
      console.error('Error when trying to fetch products:', error);
    });
}

function createProductCard(product) {
  const li = document.createElement('li');
  li.classList.add('product_card');

  const productName = createSpan(product.name, 'product_name');
  const placeholderImg = createPlaceholderImg('card_img');
  const productPrice = createSpan('$' + product.price, 'product_price');
  const amountContainer = createAmountContainer(product);
  const addToCartBtn = createBtn('Add to cart', 'add_to_cart_btn', function () {
    addToCart(
      product,
      amountContainer.querySelector('.quantity_display'),
      addToCartBtn
    );
  });
  addToCartBtn.classList.add('white_blue_btn');

  updateAddToCartBtn(product, addToCartBtn);

  li.append(
    productName,
    placeholderImg,
    productPrice,
    amountContainer,
    addToCartBtn
  );

  return li;
}

function decreaseQuantity(quantityDisplay) {
  let currentQuantity = parseInt(quantityDisplay.innerText);
  if (currentQuantity > 0) {
    currentQuantity--;
    quantityDisplay.innerText = currentQuantity.toString();
  }
}

function increaseQuantity(product, quantityDisplay) {
  let currentQuantity = parseInt(quantityDisplay.innerText);
  if (
    currentQuantity < product.lager &&
    (productStockStatus[product._id] === undefined ||
      currentQuantity < productStockStatus[product._id])
  ) {
    currentQuantity++;
    quantityDisplay.innerText = currentQuantity.toString();
  }
}

function addToCart(product, quantityDisplay, addToCartBtn) {
  if (!localStorage.getItem('user')) {
    needToLogin();
    return;
  }

  let currentQuantity = parseInt(quantityDisplay.innerText);
  if (currentQuantity > 0) {
    const cartItem = {
      productId: product._id,
      quantity: currentQuantity,
    };

    let products = JSON.parse(localStorage.getItem('products')) || [];

    const checkIfItemExists = products.findIndex(
      (item) => item.productId === product._id
    );

    if (checkIfItemExists !== -1) {
      products[checkIfItemExists].quantity += currentQuantity;
    } else {
      products.push(cartItem);
    }

    localStorage.setItem('products', JSON.stringify(products));
    updateStockStatus(product, currentQuantity);
    updateAddToCartBtn(product, addToCartBtn);
    quantityDisplay.innerText = '0';
  } else {
    createPopup('Please change amount before adding to cart!');
  }
}

function updateAddToCartBtn(product, addToCartBtn) {
  const productStock = productStockStatus.hasOwnProperty(product._id)
    ? productStockStatus[product._id]
    : product.lager;
  if (product.lager === 0 || productStock === 0) {
    addToCartBtn.disabled = true;
    addToCartBtn.innerText = 'Out of stock';
  } else {
    addToCartBtn.disabled = false;
    addToCartBtn.innerText = 'Add to cart';
  }
}

function updateStockStatus(product, currentQuantity) {
  if (productStockStatus.hasOwnProperty(product._id)) {
    productStockStatus[product._id] -= currentQuantity;
  } else {
    productStockStatus[product._id] = product.lager - currentQuantity;
  }
  console.log(productStockStatus);
  localStorage.setItem(
    'productStockStatus',
    JSON.stringify(productStockStatus)
  );
}

/**
 * -----------------------------
 * ------ CART FUNCTIONS -------
 * -----------------------------
 */

function printCartProducts() {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  mainContainer.innerHTML = '';

  if (products.length === 0) {
    printEmptyCart();
    return;
  }

  const cartHeader = createH2('Cart');
  const ul = document.createElement('ul');
  ul.classList.add('cart_container');
  const placeOrderBtn = createBtn('Place order', 'place_order_btn', placeOrder);
  placeOrderBtn.classList.add('white_blue_btn');

  products.forEach((cartItem) => {
    fetch(`http://localhost:3000/api/products/${cartItem.productId}`)
      .then((res) => res.json())
      .then((product) => {
        const li = document.createElement('li');
        li.classList.add('cart_card');

        const placeholderImg = createPlaceholderImg('cart_card_img');
        const cartTextContainer = createCartTextContainer(
          product,
          cartItem.quantity
        );

        li.append(placeholderImg, cartTextContainer);
        ul.appendChild(li);
        mainContainer.append(cartHeader, ul, placeOrderBtn);
      })
      .catch((error) => {
        console.error('Error trying to fetch product:', error);
      });
  });
}

function printEmptyCart() {
  mainContainer.innerHTML = '';

  const cartEmptyHeader = createH2('Your cart is empty');
  cartEmptyHeader.classList.add('empty_cart_header');

  const viewAllBtn = createBtn(
    'View all products',
    'view_all_btn',
    printAllProducts
  );
  const byCategoryHeader = createH2('Or view by categories:');
  byCategoryHeader.classList.add('category_header');
  const categoryBtnContainer = document.createElement('div');
  categoryBtnContainer.classList.add('category_container');

  mainContainer.append(
    cartEmptyHeader,
    viewAllBtn,
    byCategoryHeader,
    categoryBtnContainer
  );

  fetch('http://localhost:3000/api/categories')
    .then((res) => res.json())
    .then((categories) => {
      categories.forEach((category) => {
        const categoryBtn = createBtn(
          category.name,
          'category_btn',
          function () {
            printProductsByCategory(category._id, category.name);
          }
        );
        categoryBtnContainer.appendChild(categoryBtn);
      });
    })
    .catch((error) => {
      console.error('Error trying to fetch categories:', error);
    });
}

/**
 * -----------------------------
 * ------ ORDER FUNCTIONS ------
 * -----------------------------
 */

function placeOrder() {
  console.log('placing order');
  const user = localStorage.getItem('user');
  const products = JSON.parse(localStorage.getItem('products')) || [];

  if (!user) {
    createPopup('Please log in to place an order!');
    return;
  }

  if (products.length === 0) {
    createPopup('Your cart is empty!');
    return;
  }

  const order = {
    user: user,
    products: products.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
  };

  fetch('http://localhost:3000/api/orders/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  })
    .then((res) => {
      if (res.ok) {
        localStorage.removeItem('products');
        localStorage.removeItem('productStockStatus');
        productStockStatus =
          JSON.parse(localStorage.getItem('productStockStatus')) || {};
        printEmptyCart();
        createPopup('Order made!');
      } else {
        console.error('Failed to place order.');
      }
    })
    .catch((error) => {
      console.error('Error placing order:', error);
      createPopup('Failed to place order.');
    });
}

function printOrders() {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('key');

  if (!user || !token) {
    createPopup('Please log in to view your orders!');
    return;
  }

  const userRequest = {
    user: user,
    token: token,
  };

  fetch('http://localhost:3000/api/orders/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userRequest),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return res.json().then((data) => {
          throw new Error(data.message || 'Failed to get orders');
        });
      }
    })
    .then((orders) => {
      if (orders.length === 0) {
        createPopup('No orders has been made!');
        return;
      }
      displayOrders(orders);
    })
    .catch((error) => {
      console.error('Error fetching orders:', error);
      createPopup('Failed to fetch orders!');
    });
}

async function displayOrders(orders) {
  mainContainer.innerHTML = '';

  const ordersHeader = createH2('Your orders');
  const ordersContainer = document.createElement('ul');
  ordersContainer.classList.add('orders_container');

  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    const orderItem = await createOrderItem(order, i);
    ordersContainer.appendChild(orderItem);
  }

  mainContainer.append(ordersHeader, ordersContainer);
}

/**
 * -----------------------------
 * ------ HELP FUNCTIONS -------
 * -----------------------------
 */

function createBtn(text, className, onClick) {
  const button = document.createElement('button');
  button.innerText = text;
  button.classList.add(className);
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  return button;
}

function createAmountContainer(product) {
  const amountContainer = document.createElement('div');
  amountContainer.classList.add('amount_container');

  const decreaseBtn = createBtn('-', 'white_blue_btn', function () {
    decreaseQuantity(quantityDisplay);
  });

  const quantityDisplay = document.createElement('span');
  quantityDisplay.innerText = '0';
  quantityDisplay.classList.add('quantity_display');

  const increaseBtn = createBtn('+', 'white_blue_btn', function () {
    increaseQuantity(product, quantityDisplay);
  });

  amountContainer.append(decreaseBtn, quantityDisplay, increaseBtn);

  return amountContainer;
}

function createH2(text) {
  const h2 = document.createElement('h2');
  h2.innerText = text;
  return h2;
}

function createInput(placeholder, type, inputMode) {
  const input = document.createElement('input');
  input.placeholder = placeholder;
  input.type = type;
  if (inputMode) input.inputMode = inputMode;
  return input;
}

function createSpan(text, className) {
  const span = document.createElement('span');
  span.innerText = text;
  if (className) span.classList.add(className);
  return span;
}

function createPlaceholderImg(className) {
  const placeholderImg = document.createElement('img');
  placeholderImg.src = 'src/img/placeholder.webp';
  placeholderImg.alt = 'Placeholder image';
  placeholderImg.width = '768';
  placeholderImg.height = '1024';
  placeholderImg.classList.add(className);
  return placeholderImg;
}

function createCloseButton() {
  const closeLoginBtn = document.createElement('button');
  closeLoginBtn.innerText = 'X';
  closeLoginBtn.ariaLabel = 'Close login';
  closeLoginBtn.classList.add('close_login');
  closeLoginBtn.addEventListener('click', toggleLoginContainer);
  return closeLoginBtn;
}

function createCartTextContainer(product, quantity) {
  const cartTextContainer = document.createElement('div');
  cartTextContainer.classList.add('cart_text_container');

  const productName = createSpan(product.name, 'cart_product_name');
  const cartAmount = createSpan(`Amount: ${quantity}`, 'cart_amount');

  cartTextContainer.append(productName, cartAmount);

  return cartTextContainer;
}

async function createOrderItem(order, index) {
  const orderItem = document.createElement('li');
  orderItem.classList.add('order_item');

  const orderNumber = index + 1;
  const orderHeader = createH2(`Order nr. ${orderNumber}`);

  const productContainer = document.createElement('ul');
  productContainer.classList.add('order_product_container');

  for (const orderProduct of order.products) {
    const productDetails = await fetchProductDetails(orderProduct.productId);
    if (productDetails) {
      const productCard = document.createElement('li');
      productCard.classList.add('order_product_card');

      const productName = createSpan(
        `${productDetails.name}`,
        'order_product_name'
      );
      const productAmount = createSpan(
        `Amount: ${orderProduct.quantity}`,
        'order_product_amount'
      );
      const productPrice = createSpan(
        `Price per item: ${productDetails.price}`,
        'order_product_price'
      );

      productCard.append(productName, productAmount, productPrice);
      productContainer.appendChild(productCard);
    }
  }

  orderItem.append(orderHeader, productContainer);

  return orderItem;
}

async function fetchProductDetails(productId) {
  try {
    const res = await fetch(`http://localhost:3000/api/products/${productId}`);
    if (!res.ok) {
      throw new Error('Failed to fetch product info');
    }
    const product = await res.json();
    return product;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
}

function createPopup(message) {
  const popupContainer = document.createElement('div');
  popupContainer.classList.add('popup_container');

  const popupMessage = createSpan(message, 'popup_message');

  const closeBtn = createBtn('Close', 'white_blue_btn', () => {
    document.body.removeChild(popupContainer);
  });

  popupContainer.append(popupMessage, closeBtn);
  document.body.appendChild(popupContainer);
}
