// imports
import {
  emptyContainer,
  addLoadingAnimation,
  removeLoadingAnimation,
  getDataFromDb,
  injectProducts,
} from './dataFunctions.js';

//  On page load
document.addEventListener('DOMContentLoaded', () => {
  populateCategories();
});

// populate categories
const populateCategories = async () => {
  const url = 'http://localhost:3000/categories';
  const categories = await getDataFromDb(url);
  const categoryList = document.querySelector('.categories');
  emptyContainer(categoryList);
  categories.forEach((category) => {
    const li = document.createElement('li');
    li.classList.add('category');
    li.setAttribute('data-id', category.id);
    li.setAttribute('data-category', category.name);
    li.appendChild(document.createTextNode(category.name));
    categoryList.appendChild(li);
  });
  const defaultSelectedElement = categoryList.querySelector('li:nth-child(1)');
  defaultSelectedElement.classList.add('active');
  selectCategory(categoryList);
  populateProducts();
};

// select category
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
  const productContainer = document.querySelector('.product-container');
  const cardTemplate = document.getElementById('card-template');
  emptyContainer(productContainer);
  // add loading animation
  addLoadingAnimation(productContainer);
  let url = `http://localhost:3000/categories/${selectedCategoryId}/products?featured=true`;
  const products = await getDataFromDb(url);
  // remove loading animation and injecting products
  setTimeout(() => {
    removeLoadingAnimation(productContainer);
    injectProducts(cardTemplate, products, productContainer);
  }, 700);
};

/* Counter Animation */
const counterAnimation = async () => {
  const counters = document.querySelectorAll('.count');
  const speed = 18;
  counters.forEach((counter) => {
    const updateCount = () => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;
      const inc = Math.floor(target / speed);
      if (count < target) {
        if (target - count < inc) {
          counter.innerText = count + (target - count);
        } else {
          counter.innerText = count + inc;
        }
        setTimeout(updateCount, 30);
      }
    };
    updateCount();
  });
};
const factsContainer = document.querySelector('.facts');
const observer = new IntersectionObserver(
  function (entries) {
    if (entries[0].isIntersecting) {
      counterAnimation();
      console.log(entries[0]);
      observer.unobserve(entries[0].target);
    }
  },
  { threshold: 0.9 }
);

observer.observe(factsContainer);
