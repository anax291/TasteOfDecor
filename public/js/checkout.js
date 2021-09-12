import { CustomFooter } from './footer.js';
import {
  deleteDataFromDb,
  displayMsg,
  getDataFromDb,
  numberWithCommas,
  postDataToDb,
  throwError,
} from './dataFunctions.js';

import {
  validateName,
  validateEmail,
  validateAddress,
  validatePhoneNumber,
} from './formValidations.js';

const discountCodes = [
  { code: 'code1', discount: 0.1 },
  { code: 'code2', discount: 0.2 },
  { code: 'code3', discount: 0.3 },
];

document.addEventListener('DOMContentLoaded', () => {
  fetchingData();
});

const fetchingData = async () => {
  let uri = `http://localhost:3000/cart`;
  const items = await getDataFromDb(uri);
  injectProductCards(items);
  updatePrices(items);
  calculateDiscount(items);
  placeorder(items);
};

const injectProductCards = async (items) => {
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
  const shipping = document.querySelector('.shipping__charges');
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
  shipping.textContent = `Rs: 500`;
  total.textContent = `Rs: ${numberWithCommas(parseInt(totalPrice + 500))}`;
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
      document.querySelector('.discount__percent').textContent = `${isValid.code * 100}%`;
      discountField.disabled = true;
      updatePrices(items, isValid.code);
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
  const result = discountCodes.findIndex((discountCode) => discountCode.code === code);
  if (result + 1) return { status: true, code: discountCodes[result].discount };
  return false;
};

const checkForCustomerDetailsValidity = (fname, lname, email, address, tel) => {
  if (!validateName(fname)) {
    throwError('Please enter a valid first name', fname);
    return false;
  }
  if (!validateName(lname)) {
    throwError('Please enter a valid last name', lname);
    return false;
  }
  if (!validateEmail(email.value)) {
    throwError('please enter a valid email', email);
    return false;
  }
  if (!validateAddress(address)) {
    throwError('please enter a valid home address', address);
    return false;
  }
  if (!validatePhoneNumber(tel.value)) {
    throwError('please enter a valid phone number', tel);
    return false;
  }
  return true;
};

const makeOrderObject = (fname, lname, email, address, tel, products) => {
  // grabbing addtional fields
  let subtotal = document.querySelector('.sub-total__amount').textContent;
  subtotal = subtotal.replace('Rs: ', '');
  let discount = document.querySelector('.discount__percent').textContent;
  let discountedPrice = document.querySelector('.total__amount').textContent;
  discountedPrice = discountedPrice.replace('Rs: ', '');
  console.log(fname, lname, email, address, tel, products);
  // making obj
  const obj = {
    name: `${fname} ${lname}`,
    email,
    tel,
    address,
    subtotal: `${subtotal.replaceAll(',', '')}`,
    discount,
    totalPrice: `${discountedPrice.replaceAll(',', '')}`,
    hasBeenDelivered: false,
    items: products,
  };
  postDataToDb(obj, 'orders');
};

const emptyCart = async () => {
  const items = document.querySelectorAll('.product');
  items.forEach((item) => {
    const targetId = item.getAttribute('data-cart-item-id');
    deleteDataFromDb(`http://localhost:3000/cart/${targetId}`);
  });
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
