/* Imports */
import { CustomFooter } from './footer.js';

import { displayMsg, numberWithCommas, throwError } from './dataFunctions.js';

import { getDataFromLS, setDataToLS } from './localStorage.js';

import { postDataToDb } from './apiCalls.js';

import {
  validateName,
  validateEmail,
  validateAddress,
  validatePhoneNumber,
} from './formValidations.js';

/* Constants */
const customizationCartKey = 'CUSTOMIZATION_CART';
const cartKey = 'TASTE_OF_DECOR_CART';
const collectionCartKey = 'COLLECTION_CART';

const discountCodes = [
  { code: 'code1', discount: 0.1 },
  { code: 'code2', discount: 0.2 },
  { code: 'code3', discount: 0.3 },
];

document.addEventListener('DOMContentLoaded', () => {
  fetchingData();
  document
    .querySelector('.go-back')
    .addEventListener('click', () => window.history.go(-1));
});

const fetchingData = () => {
  const items = getDataFromLS(cartKey);
  injectProductCards(items);
  updatePrices(items);
  calculateDiscount(items);
  placeorder(items);
};

const injectProductCards = (items) => {
  const cardContainer = document.querySelector('.products');
  const cardTemplate = document.getElementById('checkout-card');
  items.forEach((item) => {
    // grabbing UI fields
    const card = cardTemplate.content.firstElementChild.cloneNode(true);
    const img = card.querySelector('.prod__image img');
    const imgBadge = card.querySelector('.prod__qty');
    const name = card.querySelector('.prod__name');
    const price = card.querySelector('.prod__price');
    // Setting values
    card.setAttribute('data-cart-item-id', item.id);
    img.src = item.imgSrc;
    imgBadge.textContent = item.qty;
    name.textContent = item.name;
    price.textContent = `Rs: ${numberWithCommas(item.price)}`;
    // inserting card to DOM
    cardContainer.appendChild(card);
  });
};

const updatePrices = async (items, discount = null) => {
  const subTotal = document.querySelector('.sub-total__amount');
  const total = document.querySelector('.total__amount');
  const priceArr = items.map((item) => {
    return parseInt(item.price) * parseInt(item.qty);
  });
  const subTotalPrice = priceArr.reduce((total, price) => {
    return (total += price);
  }, 0);
  let totalPrice = subTotalPrice;
  if (discount) {
    totalPrice = subTotalPrice - subTotalPrice * discount;
  }
  subTotal.textContent = `Rs: ${numberWithCommas(subTotalPrice)}`;
  total.textContent = `Rs: ${numberWithCommas(parseInt(totalPrice))}`;
};

const calculateDiscount = (items) => {
  const discountForm = document.querySelector('.discount-form');
  discountForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const discountField = document.getElementById('discount-code');
    const code = discountField.value;
    const isValid = checkForCodeValidity(code);
    if (isValid) {
      displayMsg('discount code applied successfully', 'success', 8000);
      document.querySelector('.discount-percent span').textContent = `${
        isValid.discount * 100
      }%`;
      document.querySelector('.discount-code span').textContent = `${isValid.code}`;
      discountField.disabled = true;
      updatePrices(items, isValid.discount);
    } else {
      displayMsg(
        'Discount Code is invalid. Please try again with a valide code',
        'danger',
        8000
      );
    }
  });
};

const placeorder = async (items) => {
  const placeorderForm = document.querySelector('.customer__detail__form');
  placeorderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = document.querySelector('#fName');
    const lastName = document.querySelector('#lName');
    const userEmail = document.querySelector('#email');
    const userAddress = document.querySelector('#address');
    const userTel = document.querySelector('#phone');
    if (
      !checkForCustomerDetailsValidity(
        firstName,
        lastName,
        userEmail,
        userAddress,
        userTel
      )
    )
      return;
    /* If all fields are okay */
    // make orderObj and send it to db
    makeOrderObject(
      firstName.value.trim(),
      lastName.value.trim(),
      userEmail.value,
      userAddress.value.trim(),
      userTel.value,
      items
    );
    emptyCart();
    // add animation
    addPostInteractivity();
  });
};

const checkForCodeValidity = (code) => {
  const result = discountCodes.find((discountCode) => discountCode.code === code);
  if (result) return { status: true, ...result };
  return false;
};

const checkForCustomerDetailsValidity = (fname, lname, email, address, tel) => {
  if (!validateName(fname.value)) {
    throwError('Please enter a valid first name', fname);
    return false;
  }
  if (!validateName(lname.value)) {
    throwError('Please enter a valid last name', lname);
    return false;
  }
  if (!validateEmail(email.value)) {
    throwError('please enter a valid email', email);
    return false;
  }
  if (!validateAddress(address.value)) {
    throwError('Address must be atleast 10 characters long.', address);
    return false;
  }
  if (!validatePhoneNumber(tel.value)) {
    throwError('please enter a valid phone number', tel);
    return false;
  }
  return true;
};

const makeOrderObject = async (fname, lname, email, address, tel, products) => {
  // grabbing addtional fields
  let subtotal = document.querySelector('.sub-total__amount').textContent;
  subtotal = subtotal.replace('Rs: ', '');
  let discountCode = document.querySelector('.discount-code span').textContent;
  let discountPercent = document.querySelector('.discount-percent span').textContent;
  let discountedPrice = document.querySelector('.total__amount').textContent;
  discountedPrice = discountedPrice.replace('Rs: ', '');
  // making obj
  const obj = {
    name: `${fname} ${lname}`,
    email,
    tel,
    address,
    subtotal: `${subtotal.replaceAll(',', '')}`,
    discountCode,
    discountPercent,
    totalPrice: `${discountedPrice.replaceAll(',', '')}`,
    hasBeenDelivered: false,
    deliveryDateTime: null,
    items: products,
  };
  await postDataToDb('orders', obj);
};

const emptyCart = () => {
  setDataToLS(cartKey, []);
  setDataToLS(customizationCartKey, []);
  setDataToLS(collectionCartKey, []);
};

const addPostInteractivity = () => {
  document.body.style.overflow = 'hidden';
  document.querySelector('main.checkout').classList.add('blur');
  // grabbing templates
  let loader = document
    .getElementById('loading')
    .content.firstElementChild.cloneNode(true);
  let checkoutMsg = document
    .getElementById('checkout-msg-template')
    .content.firstElementChild.cloneNode(true);
  // adding post loader
  document.body.appendChild(loader);
  // removing post loader and adding checkout msg
  const container = document.querySelector('.overlay');
  setTimeout(() => {
    container.replaceChild(checkoutMsg, document.querySelector('.checkout-animation'));
  }, 4000);

  container.addEventListener('click', (e) => {
    const target = e.target.closest('.close__checkout-msg');
    if (!target) return;
    document.querySelector('.overlay').style.transform = `scale(0)`;
    setTimeout(() => {
      window.location.href = `http://localhost:3000`;
    }, 1500);
  });
};
