import { getDataFromLS, setDataToLS } from './localStorage.js';
import {
  displayMsg,
  emptyContainer,
  updateBuyNowBtnState,
  numberWithCommas,
} from './dataFunctions.js';

import {
  cartDeletingTemplate,
  cartItemTemplate,
  emptyCartTemplate,
} from './templates.js';

const cartKey = 'TASTE_OF_DECOR_CART';

export const addProdToCartInLS = (card) => {
  const targetId = card.getAttribute('data-id');
  const cartItems = getDataFromLS(cartKey);
  const flag = cartItems.find((item) => item.prodId === targetId);
  if (flag) {
    displayMsg('Product had already been added', 'warning', 4000);
  } else {
    sendProdToCart(card, targetId, cartItems);
    displayMsg('Product is successfully added', 'success', 4000);
    updateBadge(cartItems);
  }
};

// sending cart obj to database
export const sendProdToCart = (
  prodCard,
  targetId,
  cartItems = getDataFromLS(cartKey)
) => {
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
    id: cartItems.length ? cartItems.length + 1 : 1,
  };
  setDataToLS(cartKey, [prodObj, ...cartItems]);
};

/* update badge */
export const updateBadge = () => {
  const cartItems = getDataFromLS(cartKey);
  const badge = document.querySelector('.cart-badge');
  const totalItems = cartItems.reduce((total, item) => {
    return (total += item.qty);
  }, 0);
  badge.textContent = totalItems;
};

/* update cart */
export const updateCart = () => {
  const cartContainer = document.querySelector('.cart-container');
  const cartItems = getDataFromLS(cartKey);
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

// populating cart
const populateCart = (items, container) => {
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
export const updateTotalPrice = () => {
  const cartItems = getDataFromLS(cartKey);
  const priceElement = document.querySelector('.cart-container .total-price span');
  const priceArr = cartItems.map((item) => {
    return parseInt(item.price) * parseInt(item.qty);
  });
  const totalPrice = priceArr.reduce((total, price) => {
    return (total += price);
  }, 0);
  priceElement.textContent = `Rs. ${numberWithCommas(totalPrice)}`;
};

// deleting cart item animation
export const deletingCartItemAnimation = (card) => {
  const deletingCard = cartDeletingTemplate.content.firstElementChild.cloneNode(true);
  const parent = card.parentElement;
  parent.replaceChild(deletingCard, card);
  setTimeout(() => {
    parent.removeChild(parent.querySelector('.deleting'));
  }, 2000);
};
