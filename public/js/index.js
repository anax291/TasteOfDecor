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
import { modal } from './templates.js';

const init = async () => {
  const categories = await getDataFromDb('categories');
  const products = await getDataFromDb('products?featured=true');
  const testimonials = await getDataFromDb('messages?subject=testimonial&featured=true');
  populateCategories(categories);
  selectCategory(products);
  populateProducts(products);
  handleTestimonialEvents(testimonials);
};

//  On page load
document.addEventListener('DOMContentLoaded', init);

// populate categories
const populateCategories = (categories) => {
  const categoryList = document.querySelector('.categories');
  emptyContainer(categoryList);
  createCategoriesAndInject(categories, categoryList);
  const defaultSelectedElement = categoryList.querySelector('li:nth-child(1)');
  defaultSelectedElement.classList.add('active');
};

// select category
const selectCategory = (products) => {
  const categoryList = document.querySelector('.categories');
  categoryList.addEventListener('click', (e) => {
    const targetElement = e.target.closest('li');
    if (!targetElement) return;
    // remove active class from old element and add to the new one
    categoryList.querySelector('.active').classList.remove('active');
    targetElement.classList.add('active');
    populateProducts(products);
  });
};

// populate Products
const populateProducts = async (products) => {
  const selectedCategoryId = document
    .querySelector('.categories .active')
    .getAttribute('data-id');
  const productContainer = document.querySelector('.product-container');
  const cardTemplate = document.getElementById('card-template');
  emptyContainer(productContainer);
  // add loading animation
  addLoadingAnimation(productContainer);
  products = products.filter((prod) => prod.categoryId === +selectedCategoryId);
  products = shuffleArray(products);
  products.length = 3;
  console.log(products);
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
      observer.unobserve(entries[0].target);
    }
  },
  { threshold: 0.9 }
);
observer.observe(factsContainer);

/* Modal */
const services = document.querySelector('.services');
services.addEventListener('click', (e) => {
  const target = e.target.closest('.box__link');
  if (!target) return;
  let modalElement = modal.content.firstElementChild.cloneNode(true);
  modalElement = injectCustomInfo(modalElement, target);
  modalElement.querySelector('.cross').addEventListener('click', closeModal);
  document.body.insertBefore(modalElement, services.nextElementSibling);
  // GSAP
  const timeline = gsap.timeline({ defaults: { ease: 'power1.out' } });
  timeline.to('body', { overflow: 'hidden' });
  timeline.to('.popup-overlay', { scale: 1, duration: 0.25 });
  timeline.to('.popup-overlay', { borderRadius: 0, duration: 0.2 });
  timeline.to('.popup', { y: 0, duration: 0.75 }, '-=0.2');
});

const closeModal = async () => {
  const modal = document.querySelector('.popup-overlay');
  //GSAP
  const timeline = gsap.timeline({ defaults: { ease: 'power1.out' } });
  timeline.to('.popup', { y: '-20%', duration: 0.15 });
  timeline.to('.popup', { y: '200%', duration: 0.5 });
  timeline.to('.popup-overlay', { borderRadius: '100%', duration: 0.2 });
  timeline.to('.popup-overlay', { width: 0, duration: 0.25 });
  timeline.to('.popup-overlay', { height: 0, duration: 0.25 }, '-=0.25');
  timeline.to('body', { overflow: '' });
  timeline.then(() => {
    document.body.removeChild(modal);
  });
};

const injectCustomInfo = (modalElement, target) => {
  const boxId = parseInt(target.closest('.box').getAttribute('data-id'));
  const images = modalElement.querySelectorAll('img');
  const heading = modalElement.querySelector('.heading');
  switch (boxId) {
    case 1:
      images[0].src = './assets/popUp/1.jpg';
      images[1].src = './assets/popUp/2.jpg';
      images[2].src = './assets/popUp/3.jpg';
      heading.textContent = 'Design & Planning';
      break;
    case 2:
      images[0].src = './assets/popUp/4.jpg';
      images[1].src = './assets/popUp/5.jpg';
      images[2].src = './assets/popUp/6.jpg';
      heading.textContent = 'Custom Solutions';
      break;
    case 3:
      images[0].src = './assets/popUp/7.jpg';
      images[1].src = './assets/popUp/8.jpg';
      images[2].src = './assets/popUp/9.jpg';
      heading.textContent = 'Furniture & Decor';
      break;
  }
  return modalElement;
};

/* Testimonials */
const testimonialContainer = document.querySelector('.testimonials__container');
const testimonialNav = testimonialContainer.querySelector('.testimonial__nav');

const handleTestimonialEvents = (testimonials) => {
  createTestimonialNav(testimonials);
  handleTestimonialBtnClicks(testimonials);
  showTestimonial(testimonials);
};

const showTestimonial = (testimonials) => {
  // remove previous testimonial if any
  if (testimonialContainer.querySelector('.testimonial'))
    testimonialContainer.removeChild(testimonialContainer.querySelector('.testimonial'));
  // grabbing UI fields
  const testimonialElement = document
    .getElementById('testimonial-template')
    .content.firstElementChild.cloneNode(true);
  const quote = testimonialElement.querySelector('.testimonial__content');
  const clientName = testimonialElement.querySelector('.client__name');
  // grabbing the id of testimonial to be displayed and filtering through the array
  const id = testimonialNav.querySelector('.current').dataset.navId;
  const [currTestimonial] = testimonials.filter((testimonial) => testimonial.id === +id);
  // inserting data and appending to DOM
  quote.textContent = currTestimonial.message;
  clientName.textContent = ` - ${currTestimonial.name}`;
  testimonialContainer.appendChild(testimonialElement);
};

const handleTestimonialBtnClicks = (testimonials) => {
  testimonialNav.addEventListener('click', (e) => {
    const target = e.target.closest('button.testimonial__indicator');
    if (!target) return;
    const targetId = Number(target.getAttribute('data-nav-id')) - 1;
    testimonialNav.querySelector('.current').classList.remove('current');
    target.classList.add('current');
    showTestimonial(testimonials);
  });
};

const createTestimonialNav = (testimonials) => {
  emptyContainer(testimonialNav);
  testimonials.forEach((testimonial) => {
    const btn = document.createElement('button');
    btn.classList.add('testimonial__indicator');
    btn.setAttribute('data-nav-id', testimonial.id);
    testimonialNav.appendChild(btn);
  });
  testimonialNav
    .querySelector('.testimonial__indicator:nth-child(1)')
    .classList.add('current');
};

/* Start Up animation */
let logos = document.querySelectorAll('#logo-animated path');
logos.forEach((logo) => {
  const temp = logo.getTotalLength();
  logo.style.cssText = `
      stroke-dasharray: ${temp}px;
      stroke-dashoffset: ${temp}px;
      `;
});

const tl = gsap.timeline({ defaults: { ease: 'power1.out' } });
tl.to('body', { overflow: 'hidden' });
tl.to('#logo-animated path', {
  strokeDashoffset: '0%',
  duration: 1,
  stagger: 0.5,
});
tl.to('#logo-animated', { fill: '#f4f4f4', duration: 1 }, '-=1');
tl.to('.slide', { y: '-100%', duration: 1.5, delay: 0.25 });
tl.to('.intro', { y: '-100%', duration: 1 }, '-=1');
tl.to('body', { overflow: '' });
