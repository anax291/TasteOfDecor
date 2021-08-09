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
  populateTestimonials();
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

/* Testimonials */

const testimonialContainer = document.querySelector('.testimonials__container');
const testimonialNav = testimonialContainer.querySelector('.testimonial__nav');

const populateTestimonials = async () => {
  const testimonialTemplate = document.getElementById('testimonial-template');
  let url = `http://localhost:3000/testimonials`;
  const testimonials = await getDataFromDb(url);
  createTestimonialNav(testimonialNav, testimonials);
  const testimonialElement = document.importNode(
    testimonialTemplate.content,
    true
  );
  const quote = testimonialElement.querySelector('.testimonial__content');
  const clientName = testimonialElement.querySelector('.client__name');
  quote.textContent = testimonials[0].message;
  clientName.textContent = ` - ${testimonials[0].name}`;
  testimonialContainer.appendChild(testimonialElement);
};

const createTestimonialNav = (container, testimonials) => {
  emptyContainer(container);
  testimonials.forEach((testimonial) => {
    const btn = document.createElement('button');
    btn.classList.add('testimonial__indicator');
    btn.setAttribute('data-nav-id', testimonial.id);
    container.appendChild(btn);
  });
  container
    .querySelector('.testimonial__indicator:nth-child(1)')
    .classList.add('current');
  return container.querySelector('.current').getAttribute('data-nav-id');
};

/* btn Interaction */
testimonialNav.addEventListener('click', async (e) => {
  const target = e.target.closest('button.testimonial__indicator');
  if (!target) return;
  const targetId = target.getAttribute('data-nav-id');
  testimonialNav.querySelector('.current').classList.remove('current');
  target.classList.add('current');
  testimonialContainer.removeChild(
    testimonialContainer.querySelector('.testimonial')
  );
  // changing testimonial
  let url = `http://localhost:3000/testimonials/${targetId}`;
  const testimonial = await getDataFromDb(url);
  const testimonialTemplate = document.getElementById('testimonial-template');
  const testimonialElement = document.importNode(
    testimonialTemplate.content,
    true
  );
  const quote = testimonialElement.querySelector('.testimonial__content');
  const clientName = testimonialElement.querySelector('.client__name');
  quote.textContent = testimonial.message;
  clientName.textContent = `- ${testimonial.name}`;
  testimonialContainer.appendChild(testimonialElement);
});
