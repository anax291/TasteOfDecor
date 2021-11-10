import {
  addProdToCartInLS,
  updateBadge,
  updateCart,
  updateTotalPrice,
  deletingCartItemAnimation,
} from './cart.js';

import { CustomFooter } from './footer.js';
import { getDataFromLS, setDataToLS } from './localStorage.js';

const cartKey = 'TASTE_OF_DECOR_CART';
const collectionCartKey = 'COLLECTION_CART';

// hamburger
const hamburgerBtn = document.querySelector('.hamburger');
hamburgerBtn.addEventListener('click', function () {
  hamburgerBtn.classList.toggle('menu-active');
});

// scroll activated navbar
const body = document.body;
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (window.pageYOffset > 80) {
    // at top
    if (currentScroll <= 0) {
      body.classList.remove('scroll-up');
    }
    // going down
    if (currentScroll > lastScroll && !body.classList.contains('scroll-down')) {
      body.classList.remove('scroll-up');
      body.classList.add('scroll-down');
    }
    //going up
    if (currentScroll < lastScroll && body.classList.contains('scroll-down')) {
      body.classList.remove('scroll-down');
      body.classList.add('scroll-up');
    }
  }
  lastScroll = currentScroll;
});

/* Cart */
const cartIcon = document.querySelector('.cart-wrapper');
const cartContainer = document.querySelector('.cart-container');

// open cart
cartIcon.addEventListener('click', () => {
  cartContainer.classList.add('cart-open');
  document.body.style = 'overflow: hidden';
});

//close cart
cartContainer.querySelector('.close').addEventListener('click', () => {
  cartContainer.classList.remove('cart-open');
  document.body.style = '';
});

// Cards interaction
const ids = ['index', 'collection', 'prod-detail'];
if (ids.includes(body.id)) {
  const prodContainer =
    document.querySelector('.product-container') ||
    document.querySelector('.products') ||
    document.querySelector('.similar-products .flex');

  prodContainer.addEventListener('click', (e) => {
    const targetCard = e.target.closest('.card');
    if (!targetCard) return;
    const addToCartBtn = targetCard.querySelector('.buy');
    const removeBtn = targetCard.querySelector('.remove');
    if (e.target.parentElement === addToCartBtn) {
      targetCard.querySelector('.bottom').classList.add('clicked');
      // adding prod to cart in data base
      sendProductToCart(targetCard);
    } else if (e.target.parentElement === removeBtn) {
      targetCard.querySelector('.bottom').classList.remove('clicked');
    }
  });
}

/* Init Function */
const initCart = () => {
  const cartItems = getDataFromLS(cartKey);
  updateCart();
  updateBadge();
};

document.addEventListener('DOMContentLoaded', initCart);

const sendProductToCart = (card) => {
  addProdToCartInLS(card);
  updateBadge();
  updateCart();
};

/* Cart Interactions */

const cart = document.querySelector('.cart-container');
cart.addEventListener('click', (e) => {
  const target =
    e.target.closest('.delete-item') ||
    e.target.closest('.increament') ||
    e.target.closest('.decreament') ||
    e.target.closest('.remove-all');

  if (!target) return;
  switch (target.className) {
    case 'delete-item':
      deleteItem(e);
      break;
    case 'increament':
      changeProdQty(e, 'increase');
      break;
    case 'decreament':
      changeProdQty(e, 'decrease');
      break;
    case 'remove-all':
      removeAll(e);
      break;
  }
});

const deleteItem = async (e) => {
  const cartItems = getDataFromLS(cartKey);
  const collectionCartItems = getDataFromLS(collectionCartKey);
  const targetCard = e.target.closest('.item');
  const targetId = targetCard.getAttribute('data-id');
  const newCartItems = cartItems.filter((item) => item.id !== +targetId);
  const newCollectionCartItems = collectionCartItems.filter(
    (item) => item.id !== +targetId
  );
  setDataToLS(cartKey, newCartItems);
  setDataToLS(collectionCartItems, newCollectionCartItems);
  deletingCartItemAnimation(targetCard);
  setTimeout(() => {
    if (document.querySelector('.cart-items > *')) updateTotalPrice();
    else updateCart();
    updateBadge();
  }, 2000);
};

const changeProdQty = (e, mode) => {
  const cartItems = getDataFromLS(cartKey);
  const collectionCartItems = getDataFromLS(collectionCartKey);
  const targetCard = e.target.closest('.item');
  const targetId = targetCard.getAttribute('data-id');
  let prodQty = targetCard.querySelector('.item__qty');
  let updatedCartItems, updatedCollectionCartItems;
  if (mode === 'increase') {
    updatedCartItems = cartItems.map((item) =>
      item.id == targetId ? { ...item, qty: parseInt(prodQty.textContent) + 1 } : item
    );
    updatedCollectionCartItems = collectionCartItems.map((item) =>
      item.id == targetId ? { ...item, qty: parseInt(prodQty.textContent) + 1 } : item
    );
  } else {
    if (parseInt(prodQty.textContent) == 1) {
      deleteItem(e);
      return;
    } else {
      updatedCartItems = cartItems.map((item) =>
        item.id == targetId ? { ...item, qty: parseInt(prodQty.textContent) - 1 } : item
      );
      updatedCollectionCartItems = collectionCartItems.map((item) =>
        item.id == targetId ? { ...item, qty: parseInt(prodQty.textContent) - 1 } : item
      );
    }
  }
  setDataToLS(cartKey, updatedCartItems);
  setDataToLS(collectionCartKey, updatedCollectionCartItems);
  updateBadge();
  updateCart();
};

const removeAll = async (e) => {
  const cartItems = e.target.closest('.cart-head').nextElementSibling;
  const items = Array.from(cartItems.children);
  items.forEach((item) => {
    deletingCartItemAnimation(item);
  });
  setTimeout(() => {
    setDataToLS(cartKey, []);
    setDataToLS(collectionCartKey, []);
    updateCart();
    updateBadge();
  }, 2000);
};
