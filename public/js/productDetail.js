// imports
import {
  emptyContainer,
  getDataFromDb,
  addLoadingAnimation,
  removeLoadingAnimation,
  injectProducts,
  postReviewToDb,
  addProdToCartInDb,
  updateBadge,
  updateCart,
  sendProdToCart,
  numberWithCommas,
  getNameInitials,
  getRandomNumber,
  getFutureDate,
  shuffleArray,
} from './dataFunctions.js';

import { clearFields, validateEmail } from './formValidations.js';

/* Running Functions on Page Load */
document.addEventListener('DOMContentLoaded', () => {
  updatePageTitle();
  injectProductDetails();
  changePrimaryImage();
  populateSimilarProducts();
  buyProduct();
});

// getting id and categoryId from URL
const productId = new URLSearchParams(window.location.search).get('id');
const categoryId = new URLSearchParams(window.location.search).get('categoryId');

/* Update page title */
const updatePageTitle = async () => {
  const prod = await getDataFromDb(`http://localhost:3000/products/${productId}`);
  document.title = `Taste of Décor | ${prod.name}`;
};

/* injecting prod details */
const injectProductDetails = async () => {
  //get data from db
  const productObj = await getDataFromDb(`http://localhost:3000/products/${productId}`);
  // grabbing UI elements
  const prodContainer = document.querySelector('main.product .container');
  emptyContainer(prodContainer);
  const prodTemplate = document.getElementById('prod-detail-template');
  // grabbing reqd fields from product template
  const product = prodTemplate.content.firstElementChild.cloneNode(true);
  const imageGrid = product.querySelector('.image-grid');
  const primaryImage = product.querySelector('.primary__image');
  const prodName = product.querySelector('.product__name');
  const prodPrice = product.querySelector('.product__price');
  const ratings = product.querySelector('.stars-inner');
  const reviewsNumber = product.querySelector('.reviews-number');
  const productDescription = product.querySelector('.product__description');
  const buyNow = product.querySelector('.buy-now');
  const deliveryDetails = product.querySelector('.delivery__details p span');
  // assigning values
  product.setAttribute('data-id', productObj.id);
  primaryImage.src = productObj.imgSrc[0];
  imageGrid.appendChild(primaryImage);
  const imageList = injectAllImages(productObj.imgSrc);
  imageList.forEach((image) => imageGrid.appendChild(image));
  prodName.textContent = productObj.name;
  prodPrice.textContent = `Rs. ${numberWithCommas(productObj.price)}`;
  addRatingInfo(reviewsNumber, ratings, productObj);
  const descList = injectDetails(productObj.description);
  descList.forEach((li) => productDescription.appendChild(li));
  setButtonState(buyNow);
  addDeliveryDetails(deliveryDetails);
  prodContainer.appendChild(product);
};

/* necessary functions for product detail section */
const injectAllImages = (imgs) => {
  const imageList = [];
  imgs.forEach((img) => {
    const imageElement = document.createElement('img');
    imageElement.classList.add('prod-image');
    imageElement.src = img;
    imageList.push(imageElement);
  });
  imageList[0].classList.add('active');
  return imageList;
};

const getRatingsInfo = (reviews) => {
  const totalRatings = reviews.reduce((total, review) => {
    return total + parseInt(review.ratings);
  }, 0);
  const avgRating = totalRatings / reviews.length;
  let starPercentage = totalRatings / (reviews.length * 5);
  starPercentage = `${Math.round(starPercentage * 100)}%`;
  return [starPercentage, avgRating.toFixed(1)];
};

const injectDetails = (details) => {
  const descList = [];
  details.forEach((detail) => {
    const li = document.createElement('li');
    li.textContent = detail;
    descList.push(li);
  });
  return descList;
};

const addRatingInfo = (reviewsNumber, ratings, productObj) => {
  if (productObj.reviews.length) {
    const ratingsInfo = getRatingsInfo(productObj.reviews);
    reviewsNumber.textContent = `${productObj.reviews.length} reviews (${ratingsInfo[1]} avg. ratings)`;
    ratings.style.width = ratingsInfo[0];
  } else {
    reviewsNumber.textContent = `No reviews`;
  }
};

const setButtonState = (buyNow) => {
  const cartItems = document.querySelector('.cart-items > *');
  if (cartItems) {
    buyNow.setAttribute('disabled', '');
  } else {
    buyNow.removeAttribute('disabled');
  }
};

const addDeliveryDetails = (deliveryDetails) => {
  const { date, month, day } = getFutureDate(3);
  deliveryDetails.textContent = `Delivered by ${date} ${month}, ${day} | Sale`;
};

// image interaction
const changePrimaryImage = () => {
  const container = document.querySelector('.product .container');
  container.addEventListener('click', (e) => {
    const target = e.target.closest('.prod-image');
    if (!target) return;
    const primaryImage = document.querySelector('img.primary__image');
    const activeImage = document.querySelector('img.active');
    if (target === activeImage) return;
    activeImage.classList.remove('active');
    target.classList.add('active');
    primaryImage.src = target.src;
  });
};

const buyProduct = async () => {
  const container = document.querySelector('.product .container');
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn.buy-now');
    if (!btn) return;
    sendProdToCart(document.querySelector('.product .grid'), productId);
    setTimeout(() => {
      window.location.href = `http://localhost:3000/checkout.html`;
    }, 500);
  });
};

/* Add prod to cart from prod details */
const prodContainer = document.querySelector('main.product .container');
prodContainer.addEventListener('click', (e) => {
  const cardBtn = e.target.closest('.add-to-cart');
  if (!cardBtn) return;
  const card = prodContainer.querySelector('[data-prod-card]');
  cartFunctions(card);
});

const cartFunctions = async (card) => {
  const success = await addProdToCartInDb(card);
  if (success) {
    updateBadge();
    updateCart();
  }
};

/* populate Similar Products */
const populateSimilarProducts = async () => {
  // get data from db
  let url = `http://localhost:3000/categories/${categoryId}/products`;
  let products = await getDataFromDb(url);
  products = products.filter((product) => product.id != productId);
  products = shuffleArray(products);
  products.length = 4;
  // getting UI elements
  const cardTemplate = document.getElementById('card-template');
  const container = document.querySelector('.similar-products .flex');
  // inject prod to DOM
  injectProducts(cardTemplate, products, container);
};

/* Populate Reviews If Any */
const reviewsContainer = document.querySelector('.reviews');
const populateReviews = async () => {
  let url = `http://localhost:3000/products/${productId}`;
  const prodObj = await getDataFromDb(url);
  const reviews = prodObj.reviews;
  addLoadingAnimation(reviewsContainer);
  setTimeout(() => {
    emptyContainer(reviewsContainer);
    if (!reviews.length) {
      let elem = document.getElementById('no-reviews');
      elem = document.importNode(elem.content, true);
      reviewsContainer.appendChild(elem);
    } else {
      // grabbing elements
      const reviewTemplate = document.getElementById('review-template');
      reviews.forEach((review) => {
        const reviewElement = document.importNode(reviewTemplate.content, true);
        const userName = reviewElement.querySelector('.user-name');
        const userEmail = reviewElement.querySelector('.user-email');
        const userImg = reviewElement.querySelector('.user-image');
        const userRatings = reviewElement.querySelector('.stars-inner');
        const reviewBody = reviewElement.querySelector('.review__body p');
        // inserting values
        userName.textContent = review.name;
        userEmail.textContent = review.email;
        userImg.textContent = `${getNameInitials(review.name)}`;
        userImg.style.backgroundColor = `hsl(${getRandomNumber()}, 50%, 50%)`;
        userRatings.style.width = `${(review.ratings / 5) * 100}%`;
        reviewBody.textContent = review.description;
        reviewsContainer.appendChild(reviewElement);
      });
    }
  }, 1000);
};
/* Populating Reviews when in viewport */
const observer = new IntersectionObserver(
  function (entries) {
    if (entries[0].isIntersecting && window.scrollY > 0) {
      populateReviews();
      console.log(entries[0]);
      observer.unobserve(entries[0].target);
    }
  },
  { threshold: 1 }
);
observer.observe(reviewsContainer);

/* Review Form */

let reviewObj = {};

// get UI elements
const formsContainer = document.querySelector('.review-form');
const form1 = document.querySelector('.form1');
const form2 = document.querySelector('.form2');
const ratingsContainer = document.querySelector('.review-form .ratings');

// 1st form
form1.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const userName = name.value;
  const userEmail = email.value;
  if (userName && validateEmail(userEmail)) {
    reviewObj.name = userName;
    reviewObj.email = userEmail;
    formsContainer.style.animation = `slideIn 2000ms ease-out forwards`;
    clearFields(name, email);
  } else {
    window.alert('Fill the fields correctly');
  }
});

// rate the prod
ratingsContainer.addEventListener('click', (e) => {
  const target = e.target.closest('i.far');
  if (!target) return;
  const stars = Array.from(ratingsContainer.children);
  stars.forEach((star) => {
    if (star.classList.contains('active')) {
      star.classList.remove('active');
    }
  });
  target.classList.add('active');
});

// 2nd Form
form2.addEventListener('submit', (e) => {
  e.preventDefault();
  const review = document.getElementById('review');
  const rating = ratingsContainer.querySelector('.active').getAttribute('data-rating');
  if (!rating) return window.alert('please rate the prod');
  const userReview = review.value;
  reviewObj.ratings = rating;
  reviewObj.description = userReview;
  postReview(reviewObj);
  formsContainer.style.animation = `slideOut 2000ms ease-out forwards`;
  clearFields(review);
  ratingsContainer.querySelector('.active').classList.remove('active');
});

// Make reqd changes and post review to db
const postReview = async (reviewObj) => {
  let url = `http://localhost:3000/products/${productId}`;
  const prodObj = await getDataFromDb(url);
  const prodReviews = prodObj.reviews;
  reviewObj.id = prodReviews.length + 1;
  prodReviews.push(reviewObj);
  postReviewToDb(url, prodReviews);
};
