/* Imports */
import products from './products.js';
import { emptyContainer, numberWithCommas, generateId } from './dataFunctions.js';
import { getDataFromLS, setDataToLS } from './localStorage.js';
import { updateBadge, updateCart } from './cart.js';

/* Constants */
const customizationCartKey = 'CUSTOMIZATION_CART';
const cartKey = 'TASTE_OF_DECOR_CART';
const collectionCartKey = 'COLLECTION_CART';

/* Grabbing UI Elements */
const room = document.querySelector('.room');
const leftSideBar = document.querySelector('.products');
const rightSideBar = document.querySelector('.right-container');
const productPrices = rightSideBar.querySelector('.product__price');
const totalPrice = rightSideBar.querySelector('.total__price');
const filterForm = document.getElementById('category-filter');
const categoriesDropDown = filterForm.querySelector('select');

/* Getting categories */
const categories = products.reduce((arr, prod) => {
  if (!arr.includes(prod.category)) arr.push(prod.category);
  return arr;
}, []);

const injectCategories = () => {
  emptyContainer(categoriesDropDown);
  categories.forEach((category) =>
    categoriesDropDown.appendChild(createOptionElement(category))
  );
  categoriesDropDown.firstElementChild.selected = true;
};

const createOptionElement = (category) => {
  const option = document.createElement('option');
  option.value = category;
  option.textContent = category;
  return option;
};

const injectProducts = () => {
  emptyContainer(leftSideBar);
  const selectedCategory = categoriesDropDown.value;
  let prods = products.filter((product) => product.category === selectedCategory);
  prods.forEach((prod) => leftSideBar.appendChild(createImageElement(prod)));
};

const createImageElement = ({ id, src: imageSource, price, name }) => {
  const img = document.createElement('img');
  img.classList.add('product');
  img.src = imageSource;
  img.setAttribute('draggable', true);
  img.setAttribute('data-id', id);
  img.setAttribute('data-price', price);
  img.setAttribute('data-name', name);
  addEventListenersToImages(img);
  return img;
};

const addEventListenersToImages = (image) => {
  image.addEventListener('dragstart', () => {
    image.classList.add('dragging');
  });
  image.addEventListener('dragend', () => {
    image.classList.remove('dragging');
    updateProductsAtCustomizationCart();
  });
};

room.addEventListener('dragover', (e) => {
  const draggingElement = document.querySelector('.dragging');
  let x = e.clientX - room.getBoundingClientRect().x;
  let y = e.clientY - room.getBoundingClientRect().y;
  draggingElement.style.left = `${x}px`;
  draggingElement.style.top = `${y}px`;
  room.appendChild(draggingElement);
  // addProductPriceElementToDOM(draggingElement);
});

const updateProductsAtCustomizationCart = () => {
  const newProducts = Array.from(room.children);
  const cartProducts = newProducts.map((prod) => ({
    prodId: prod.dataset.id,
    name: prod.dataset.name,
    imgSrc: prod.src.replace('http://localhost:3000', '.'),
    price: prod.dataset.price,
    qty: 1,
    id: `customizationProd${generateId.next().value}`,
  }));
  setDataToLS(customizationCartKey, cartProducts);
  addProductPriceElementToDOM();
};

const addProductsToMainCart = () => {
  const collectionProducts = getDataFromLS(collectionCartKey);
  const customizationProducts = getDataFromLS(customizationCartKey);
  setDataToLS(cartKey, [...collectionProducts, ...customizationProducts]);
  updateCart();
  updateBadge();
};

const addProductPriceElementToDOM = () => {
  const prods = getDataFromLS(customizationCartKey);
  const total = prods.reduce((total, prod) => (total += Number(prod.price)), 0);
  emptyContainer(productPrices);
  prods.forEach((prod) => {
    const li = document.createElement('li');
    li.setAttribute('data-id', prod.prodId);
    li.textContent = `${prod.name}: Rs. ${numberWithCommas(prod.price)}`;
    productPrices.appendChild(li);
  });
  if (!prods.length) return;
  totalPrice.textContent = `Total: Rs. ${numberWithCommas(total)}`;
  if (document.querySelector('.checkout__button')) return;
  const button = document.createElement('button');
  button.classList.add('checkout__button');
  button.classList.add('btn');
  button.addEventListener('click', addProductsToMainCart);
  button.textContent = 'Send to cart...';
  rightSideBar.appendChild(button);
};

leftSideBar.addEventListener('dragover', () => {
  const dragging = document.querySelector('.dragging');
  leftSideBar.appendChild(dragging);
});

room.addEventListener('dblclick', (e) => {
  const target = e.target.closest('img');
  if (!target) return;
  if (room.querySelector('.active')) closeCustomizationBox(room.querySelector('.active'));
  target.classList.add('active');
  displayCustomizationBox(target);
  customizationInteractivity(target);
});

const displayCustomizationBox = async (target) => {
  const template = document.getElementById('customization-template');
  console.log(template);
  const customizationDiv = template.content.firstElementChild.cloneNode(true);
  customizationDiv.querySelector('#width').value = window
    .getComputedStyle(target)
    .width.replace('px', '');
  customizationDiv.querySelector('#height').value = window
    .getComputedStyle(target)
    .height.replace('px', '');
  let temp = target.style.transform;
  if (temp) temp = temp.slice(7, temp.length - 4);
  customizationDiv.querySelector('#rotate').value = temp || 0;
  document.body.appendChild(customizationDiv);
};

const customizationInteractivity = (img) => {
  const widthElement = document.getElementById('width');
  const heightElement = document.getElementById('height');
  const degElement = document.getElementById('rotate');
  const reduceZindex = document.getElementById('reduce-z-index');
  const increaseZindex = document.getElementById('increase-z-index');
  const closeBtn = document.querySelector('.cta-close');

  widthElement.addEventListener('change', (e) => {
    changeWidth(img, e.target.value);
  });

  widthElement.addEventListener('keyup', (e) => {
    changeWidth(img, e.target.value);
  });

  heightElement.addEventListener('change', (e) => {
    changeHeight(img, e.target.value);
  });

  heightElement.addEventListener('keyup', (e) => {
    changeHeight(img, e.target.value);
  });

  degElement.addEventListener('change', (e) => {
    rotateImg(img, e.target.value);
  });

  degElement.addEventListener('keyup', (e) => {
    rotateImg(img, e.target.value);
  });

  reduceZindex.addEventListener('click', () => {
    changeZindex(img, false);
  });
  increaseZindex.addEventListener('click', () => {
    changeZindex(img, true);
  });

  closeBtn.addEventListener('click', () => {
    closeCustomizationBox(img);
  });
};

const changeWidth = (img, width) => {
  img.style.width = `${width}px`;
};

const changeHeight = (img, height) => {
  img.style.width = `${height}px`;
};
const rotateImg = (img, deg) => {
  img.style.transform = `rotate(${deg}deg)`;
};

const changeZindex = (img, bool) => {
  const oldZindex = parseInt(window.getComputedStyle(img).zIndex);
  const newZindex = bool ? oldZindex + 1 : oldZindex - 1;
  img.style.zIndex = `${newZindex}`;
};

const closeCustomizationBox = (img) => {
  img.classList.remove('active');
  const customizationDiv = document.querySelector('.customization-box');
  document.body.removeChild(customizationDiv);
};

const init = () => {
  injectCategories();
  categoriesDropDown.addEventListener('change', injectProducts);
  injectProducts();
};

document.addEventListener('DOMContentLoaded', init);

/* Functionality to download the design */
const downloadBtn = document.querySelector('.download-design');
downloadBtn.addEventListener('click', async () => {
  const target = document.querySelector('.terrarium');
  const canvas = await html2canvas(target);
  const a = document.createElement('a');
  a.href = canvas.toDataURL();
  a.download = 'canvas-image.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});
