// imports
import {
  emptyContainer,
  addLoadingAnimation,
  removeLoadingAnimation,
  getDataFromDb,
  injectProducts,
} from './dataFunctions.js';

// On page load
document.addEventListener('DOMContentLoaded', () => {
  populateCategories();
});

// populate categories
const populateCategories = async () => {
  const url = 'http://localhost:3000/categories';
  const categories = await getDataFromDb(url);
  const categoryList = document.querySelector('.categories');
  emptyContainer(categoryList);
  const defaultLi = document.createElement('li');
  defaultLi.classList.add('category');
  defaultLi.setAttribute('data-category', 'all');
  defaultLi.appendChild(document.createTextNode('all'));
  categoryList.appendChild(defaultLi);
  categories.forEach((category) => {
    const li = document.createElement('li');
    li.classList.add('category');
    li.setAttribute('data-id', category.id);
    li.setAttribute('data-category', category.name);
    li.appendChild(document.createTextNode(category.name));
    categoryList.appendChild(li);
  });
  const defaultSelectedElement = categoryList.querySelector('li:nth-child(2)');
  defaultSelectedElement.classList.add('active');
  selectCategory(categoryList);
  populateProducts();
};

// Select Category
const selectCategory = async (categoryList) => {
  categoryList.addEventListener('click', (e) => {
    const targetElement = e.target.closest('li');
    if (!targetElement) return;
    // remove active class from old element
    categoryList.querySelector('.active').classList.remove('active');
    targetElement.classList.add('active');
    populateProducts();
  });
};

// populate Products
const populateProducts = async () => {
  const selectedCategory = document.querySelector('.categories .active');
  const selectedCategoryId = selectedCategory.getAttribute('data-id');
  const productContainer = document.querySelector('.products');
  const cardTemplate = document.getElementById('card-template');
  emptyContainer(productContainer);
  // add loading animation
  addLoadingAnimation(productContainer);
  let url = `http://localhost:3000`;
  if (selectedCategoryId) {
    url = `${url}/categories/${selectedCategoryId}/products`;
  } else {
    url = `${url}/products`;
  }
  const products = await getDataFromDb(url);
  // remove loading animation and injecting products
  setTimeout(() => {
    removeLoadingAnimation(productContainer);
    injectProducts(cardTemplate, products, productContainer);
  }, 700);
};
