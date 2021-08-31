import {
  addProdToCartInDb,
  deleteDataFromDb,
  deletingCartItemAnimation,
  updateBadge,
  updateCart,
  updateData,
  updateTotalPrice,
} from './dataFunctions.js';

import { CustomFooter } from './footer.js';

document.addEventListener('DOMContentLoaded', () => {
  updateBadge();
  updateCart();
});

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
      cartFunctions(targetCard);
    } else if (e.target.parentElement === removeBtn) {
      targetCard.querySelector('.bottom').classList.remove('clicked');
    }
  });
}

/* Cart */
const cartIcon = document.querySelector('.cart-wrapper');
const cartContainer = document.querySelector('.cart-container');

// open cart
cartIcon.addEventListener('click', (e) => {
  openCart();
});

const openCart = () => {
  cartContainer.classList.add('cart-open');
  document.body.style = 'overflow: hidden';
};

//close cart
cartContainer.querySelector('.close').addEventListener('click', () => {
  cartContainer.classList.remove('cart-open');
  document.body.style = '';
});

const cartFunctions = async (card) => {
  const success = await addProdToCartInDb(card);
  if (success) {
    updateBadge();
    updateCart();
  }
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
  const targetCard = e.target.closest('.item');
  const targetId = targetCard.getAttribute('data-id');
  let url = `http://localhost:3000/cart/${targetId}`;
  const success = await deleteDataFromDb(url);
  deletingCartItemAnimation(targetCard);
  setTimeout(() => {
    if (success) {
      if (document.querySelector('.cart-items > *')) {
        updateTotalPrice();
      } else {
        updateCart();
      }
      updateBadge();
    }
  }, 2000);
};

const changeProdQty = async (e, mode) => {
  const targetCard = e.target.closest('.item');
  const targetId = targetCard.getAttribute('data-id');
  let prodQty = targetCard.querySelector('.item__qty');
  let obj;
  if (mode === 'increase') {
    obj = { qty: parseInt(prodQty.textContent) + 1 };
  } else {
    if (parseInt(prodQty.textContent) == 1) {
      deleteItem(e);
      return;
    } else {
      obj = { qty: parseInt(prodQty.textContent) - 1 };
    }
  }
  let url = `http://localhost:3000/cart/${targetId}`;
  const success = updateData(url, obj);
  if (success) {
    updateBadge();
    updateCart();
  }
};

const removeAll = async (e) => {
  const cartItems = e.target.closest('.cart-head').nextElementSibling;
  const items = Array.from(cartItems.children);
  let success;
  items.forEach((item) => {
    const id = item.getAttribute('data-id');
    let url = `http://localhost:3000/cart/${id}`;
    success = deleteDataFromDb(url);
    deletingCartItemAnimation(item);
  });
  setTimeout(() => {
    if (success) {
      updateCart();
      updateBadge();
    }
  }, 2000);
};
