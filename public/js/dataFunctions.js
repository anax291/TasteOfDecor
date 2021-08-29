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
  let res = await fetch(url);
  let categories = await res.json();
  return categories;
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
      price.textContent = `Rs. ${product.price}`;
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

/* Email validation */
export const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/* Name Validation */
export const validateName = (name) => {
  const re = /^[A-Za-z. ]{3,20}$/;
  return re.test(name);
};

/* Subject Validation */
export const validateSubject = (text) => {
  const re = /^[A-Za-z. ]{3,}$/;
  return re.test(text);
};

/* Validte Message */
export const validateMessage = (text) => {
  const re = /^[A-Za-z. ]{5,}$/;
  return re.test(text);
};

/* Validate Phone Number */
export const validatePhoneNumber = (number) => {
  const re = /\(?(\d{3})\)?[-\.\s]?(\d{3})[-\.\s]?(\d{4})/;
  return re.test(number);
};

/* Clear Form Fields */
export const clearFields = (...fields) => {
  fields.forEach((field) => {
    field.value = '';
  });
};

/* Throw Error */
export const throwError = (message, element) => {
  const err = document.createElement('span');
  err.classList.add('err');
  err.textContent = message;
  element.parentElement.appendChild(err);
  setTimeout(() => {
    element.parentElement.removeChild(element.parentElement.lastChild);
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
const sendProdToCart = async (prodCard, targetId) => {
  let prodImg = prodCard.querySelector('img').src;
  prodImg = prodImg.replace('http://localhost:3000', '.');
  let prodName =
    prodCard.querySelector('.name') || prodCard.querySelector('.product__name');
  prodName = prodName.textContent;
  let prodPrice =
    prodCard.querySelector('.price') || prodCard.querySelector('.product__price');
  prodPrice = prodPrice.textContent;
  prodPrice = prodPrice.replace('Rs. ', '');
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
};

// empty cart display
const displayEmptyCartMsg = (container) => {
  const emptyCart = emptyCartTemplate.content.firstElementChild.cloneNode(true);
  container.appendChild(emptyCart);
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
    prodPrice.textContent = `Rs. ${item.price}`;
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
  priceElement.textContent = totalPrice;
};
