import {
  cartDeletingTemplate,
  cartItemTemplate,
  emptyCartTemplate,
} from './templates.js';

/* Helper Functions */

// function to empty Container
export const emptyContainer = (container) => {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

// function to add Loading Animation
export const addLoadingAnimation = (container) => {
  const image = document.createElement('img');
  image.classList.add('loading-gif');
  image.src = './assets/misc/loadingSvg.svg';
  container.appendChild(image);
};

// function to get random number
export const getRandomNumber = (min = 0, max = 359) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// get Future Date
export const getFutureDate = (daysAhead = 0) => {
  const reqdDate = new Date();
  reqdDate.setDate(reqdDate.getDate() + daysAhead);
  const date = reqdDate.getDate();
  const month = reqdDate.getMonth();
  const year = reqdDate.getFullYear();
  const day = reqdDate.getDay();
  return formatDate(date, month, year, day);
};
const formatDate = (date, month, year, day) => {
  const mapMonth = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December',
  };
  const mapDay = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  };
  return { date: date, month: mapMonth[month], year: year, day: mapDay[day] };
};

// Shuffle Array
export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate random number
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

/* Create Category list and inject [for index and collection page] */
export const createCategoriesAndInject = (categories, categoryList) => {
  categories.forEach((category) => {
    const li = document.createElement('li');
    li.classList.add('category');
    li.setAttribute('data-id', category.id);
    li.setAttribute('data-category', category.name);
    li.appendChild(document.createTextNode(category.name));
    categoryList.appendChild(li);
  });
};

// function to remove loading animation
export const removeLoadingAnimation = (container) =>
  container.removeChild(container.firstChild);

// deleting cart item animation
export const deletingCartItemAnimation = (card) => {
  const deletingCard = cartDeletingTemplate.content.firstElementChild.cloneNode(true);
  const parent = card.parentElement;
  parent.replaceChild(deletingCard, card);
  setTimeout(() => {
    parent.removeChild(parent.querySelector('.deleting'));
  }, 2000);
};

/* fetch functions */
export const getDataFromDb = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

/* patch Reviews function */
export const postReviewToDb = async (url, reviewsArr) => {
  const body = { reviews: reviewsArr };
  const obj = {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(url, obj);
};

/* edit db content */
export const updateData = async (url, obj) => {
  const options = {
    method: 'PATCH',
    body: JSON.stringify(obj),
    headers: { 'Content-Type': 'application/json' },
  };
  const res = await fetch(url, options);
  return res;
};

/* send data [testimonials, cart-items] to db */
export const postDataToDb = async (dataObj, dbArr) => {
  const url = `http://localhost:3000/${dbArr}`;
  const optionObj = {
    method: 'POST',
    body: JSON.stringify(dataObj),
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(url, optionObj);
};

/* Delete data from db */
export const deleteDataFromDb = async (url) => {
  const optionObj = { method: 'DELETE' };
  await fetch(url, optionObj);
  return true;
};

/* Number With Commas */
export const numberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/* Name Initials */
export const getNameInitials = (name) => {
  let initials = name.split(' ');
  if (initials.length == 1) {
    initials = initials[0].charAt(0).toUpperCase();
  } else {
    initials =
      initials[0].charAt(0).toUpperCase() +
      initials[initials.length - 1].charAt(0).toUpperCase();
  }
  return initials;
};

/* Inject Prodouct Cards */
export const injectProducts = (cardTemplate, products, productContainer) => {
  products.forEach((product) => {
    const card = cardTemplate.content.firstElementChild.cloneNode(true);
    const prodImage = card.querySelector('img');
    const names = card.querySelectorAll('.name');
    const prices = card.querySelectorAll('.price');
    const details = card.querySelector('.inside .details');
    const ctaBtn = card.querySelector('.inside .btn');
    prodImage.src = product.imgSrc[0];
    prodImage.alt = product.name;
    card.setAttribute('data-id', product.id);
    names.forEach((name) => {
      name.textContent = product.name;
    });
    prices.forEach((price) => {
      price.textContent = `Rs. ${numberWithCommas(product.price)}`;
    });
    const prodDesc = product.description;
    prodDesc.forEach((desc) => {
      const li = document.createElement('li');
      li.appendChild(document.createTextNode(desc));
      details.appendChild(li);
    });
    ctaBtn.href = `./productDetail.html?id=${product.id}&categoryId=${product.categoryId}`;
    productContainer.appendChild(card);
  });
};

/* Throw Error */
export const throwError = (message, element) => {
  const elementWrapper = element.closest('.field-wrapper') || element.parentElement;
  const err = document.createElement('span');
  err.classList.add('err');
  err.textContent = message;
  elementWrapper.appendChild(err);
  setTimeout(() => {
    elementWrapper.removeChild(elementWrapper.lastChild);
  }, 3000);
};

/* Add Prod to cart in database */
export const addProdToCartInDb = async (card) => {
  const targetId = card.getAttribute('data-id');
  const url = `http://localhost:3000/cart`;
  const cartItems = await getDataFromDb(url);
  const flag = cartItems.find((item) => item.prodId === targetId);
  if (flag) {
    displayMsg('Product had already been added', 'warning', 4000);
  } else {
    const success = await sendProdToCart(card, targetId);
    if (success) {
      displayMsg('Product is successfully added', 'success', 4000);
      updateBadge();
    }
  }
  return true;
};

// sending cart obj to database
export const sendProdToCart = async (prodCard, targetId) => {
  let prodImg = prodCard.querySelector('img').src;
  prodImg = prodImg.replace('http://localhost:3000', '.');
  let prodName =
    prodCard.querySelector('.name') || prodCard.querySelector('.product__name');
  prodName = prodName.textContent;
  let prodPrice =
    prodCard.querySelector('.price') || prodCard.querySelector('.product__price');
  prodPrice = prodPrice.textContent;
  prodPrice = prodPrice.replace('Rs. ', '');
  prodPrice = prodPrice.replaceAll(',', '');
  const prodObj = {
    prodId: targetId,
    name: prodName,
    imgSrc: prodImg,
    price: prodPrice,
    qty: 1,
  };
  postDataToDb(prodObj, 'cart');
  return true;
};

// displaying message
export const displayMsg = (msg, alertType, time) => {
  const popUp = document.createElement('p');
  popUp.classList.add(`alert`);
  popUp.classList.add(alertType);
  popUp.style.animationDuration = `${time}ms`;
  popUp.textContent = msg;
  document.body.appendChild(popUp);
  setTimeout(() => {
    document.body.removeChild(document.querySelector('.alert'));
  }, time);
};

/* update badge */
export const updateBadge = async () => {
  const badge = document.querySelector('.cart-badge');
  const cartItems = await getDataFromDb('http://localhost:3000/cart');
  const totalItems = cartItems.reduce((total, item) => {
    return (total += item.qty);
  }, 0);
  badge.textContent = totalItems;
};

/* update cart */
export const updateCart = async () => {
  const cartContainer = document.querySelector('.cart-container');
  const cartItems = await getDataFromDb('http://localhost:3000/cart');
  if (!cartItems.length) {
    cartContainer.querySelector('.cart-head').style.display = 'none';
    cartContainer.querySelector('.btn.checkout').style.display = 'none';
    emptyContainer(cartContainer.querySelector('.cart-items'));
    displayEmptyCartMsg(cartContainer);
  } else {
    cartContainer.querySelector('.cart-head').style.display = '';
    cartContainer.querySelector('.btn.checkout').style.display = '';
    populateCart(cartItems, cartContainer);
  }
  updateBuyNowBtnState();
};

// empty cart display
const displayEmptyCartMsg = (container) => {
  const emptyCart = emptyCartTemplate.content.firstElementChild.cloneNode(true);
  container.appendChild(emptyCart);
};

// updateBuyNowBtnState
export const updateBuyNowBtnState = () => {
  const id = document.body.id;
  if (!id === 'prod-detail') return;
  try {
    const btn = document.querySelector('.buy-now');
    if (document.querySelector('.item')) {
      btn.setAttribute('disabled', '');
    } else {
      btn.removeAttribute('disabled');
    }
  } catch (error) {
    console.log(error);
  }
};

// populating cart
const populateCart = async (items, container) => {
  if (container.querySelector('.empty-cart')) {
    container.removeChild(container.querySelector('.empty-cart'));
  }
  const cartItemsContainer = container.querySelector('.cart-items');
  emptyContainer(cartItemsContainer);
  items.forEach((item) => {
    const cartElement = cartItemTemplate.content.firstElementChild.cloneNode(true);
    const prodImg = cartElement.querySelector('.item__img');
    const prodName = cartElement.querySelector('.item__name');
    const prodPrice = cartElement.querySelector('.item__price');
    const prodQty = cartElement.querySelector('.item__qty');
    cartElement.setAttribute('data-id', item.id);
    prodImg.src = item.imgSrc;
    prodName.textContent = item.name;
    prodQty.textContent = item.qty;
    prodPrice.textContent = `Rs. ${numberWithCommas(item.price)}`;
    cartItemsContainer.appendChild(cartElement);
  });
  updateTotalPrice();
};

/* update price header */
export const updateTotalPrice = async () => {
  const priceElement = document.querySelector('.cart-container .total-price span');
  const cartItems = await getDataFromDb('http://localhost:3000/cart');
  const priceArr = cartItems.map((item) => {
    return parseInt(item.price) * parseInt(item.qty);
  });
  const totalPrice = priceArr.reduce((total, price) => {
    return (total += price);
  }, 0);
  priceElement.textContent = `Rs. ${numberWithCommas(totalPrice)}`;
};
