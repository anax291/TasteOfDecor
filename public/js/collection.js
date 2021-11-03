// imports
import { getDataFromDb } from './apiCalls.js';
import {
  emptyContainer,
  addLoadingAnimation,
  removeLoadingAnimation,
  injectProducts,
  createCategoriesAndInject,
  shuffleArray,
} from './dataFunctions.js';

const query = new URLSearchParams(window.location.search).get('q') || null;

const init = async () => {
  let categories = await getDataFromDb('categories');
  const products = await getDataFromDb('products');
  populateCategories(categories);
  selectCategory(products);
  populateProducts(products);
};

// On page load
document.addEventListener('DOMContentLoaded', init);

// populate categories
const populateCategories = (categories) => {
  const categoryList = document.querySelector('.categories');
  emptyContainer(categoryList);
  categories = [{ id: undefined, name: 'all' }, ...categories];
  createCategoriesAndInject(categories, categoryList);
  if (query) {
    categoryList
      .querySelector('[data-category="decoration accessories"]')
      .classList.add('active');
  } else {
    const defaultSelectedElement = categoryList.querySelector('li:nth-child(2)');
    defaultSelectedElement.classList.add('active');
  }
};

// Select Category
const selectCategory = (products) => {
  const categoryList = document.querySelector('.categories');
  categoryList.addEventListener('click', (e) => {
    const targetElement = e.target.closest('li');
    if (!targetElement) return;
    // remove active class from old element
    categoryList.querySelector('.active').classList.remove('active');
    targetElement.classList.add('active');
    populateProducts(products);
  });
};

// populate Products
const populateProducts = async (products) => {
  const selectedCategory = document.querySelector('.categories .active');
  const selectedCategoryId = selectedCategory.getAttribute('data-id');
  const productContainer = document.querySelector('.products');
  const cardTemplate = document.getElementById('card-template');
  emptyContainer(productContainer);
  // add loading animation
  addLoadingAnimation(productContainer);
  if (selectedCategoryId)
    products = products.filter((prod) => prod.categoryId === +selectedCategoryId);
  products = shuffleArray(products);
  // remove loading animation and injecting products
  setTimeout(() => {
    removeLoadingAnimation(productContainer);
    injectProducts(cardTemplate, products, productContainer);
  }, 700);
};
