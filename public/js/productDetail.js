// imports
import {
  emptyContainer,
  getDataFromDb,
  addLoadingAnimation,
  removeLoadingAnimation,
  injectProducts,
  validateEmail,
  postReviewToDb,
} from './dataFunctions.js';

/* Running Functions on Page Load */
document.addEventListener('DOMContentLoaded', () => {
  injectProductDetails();
  changePrimaryImage();
  populateSimilarProducts();
});

// getting id and categoryId from URL
const productId = new URLSearchParams(window.location.search).get('id');
const categoryId = new URLSearchParams(window.location.search).get(
  'categoryId'
);

/* injecting prod details */
const injectProductDetails = async () => {
  //get data from db
  let url = `http://localhost:3000/products/${productId}`;
  const productObj = await getDataFromDb(url);
  // grabbing UI elements
  const prodContainer = document.querySelector('main.product .container');
  emptyContainer(prodContainer);
  const prodTemplate = document.getElementById('prod-detail-template');
  // grabbing reqd fields from product template
  const product = document.importNode(prodTemplate.content, true);
  const imageGrid = product.querySelector('.image-grid');
  const primaryImage = product.querySelector('.primary__image');
  const prodName = product.querySelector('.product__name');
  const prodPrice = product.querySelector('.product__price');
  const ratings = product.querySelector('.stars-inner');
  const reviewsNumber = product.querySelector('.reviews-number');
  const productDescription = product.querySelector('.product__description');
  // assigning values
  primaryImage.src = productObj.imgSrc[0];
  imageGrid.appendChild(primaryImage);
  let imageList = [];
  imageList = injectAllImages(productObj.imgSrc, imageList);
  imageList.forEach((image) => {
    imageGrid.appendChild(image);
  });
  prodName.textContent = productObj.name;
  prodPrice.textContent = `Rs. ${productObj.price} / piece`;
  if (productObj.reviews.length) {
    const ratingsInfo = getRatingsInfo(productObj.reviews);
    reviewsNumber.textContent = `${productObj.reviews.length} reviews (${ratingsInfo[1]} avg. ratings)`;
    ratings.style.width = ratingsInfo[0];
  } else {
    reviewsNumber.textContent = `No reviews`;
  }
  let descList = [];
  descList = injectDetails(productObj.description, descList);
  descList.forEach((li) => {
    productDescription.appendChild(li);
  });
  prodContainer.appendChild(product);
};

/* necessary functions for product detail section */
const injectAllImages = (imgs, imageList) => {
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

const injectDetails = (details, descList) => {
  details.forEach((detail) => {
    const li = document.createElement('li');
    li.textContent = detail;
    descList.push(li);
  });
  return descList;
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

/* populate Similar Products */

const populateSimilarProducts = async () => {
  // get data from db
  let url = `http://localhost:3000/categories/${categoryId}/products`;
  let products = await getDataFromDb(url);
  products = products.filter((product) => product.id != productId);
  products.sort(() => 0.5 - Math.random());
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
        userImg.src = `https://i.pravatar.cc/75?img=${review.id}`;
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
    if (entries[0].isIntersecting) {
      populateReviews();
      console.log(entries[0]);
      observer.unobserve(entries[0].target);
    }
  },
  { threshold: 0.8 }
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
    name.value = '';
    email.value = '';
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
  const rating = ratingsContainer
    .querySelector('.active')
    .getAttribute('data-rating');
  if (rating) {
    const userReview = review.value;
    reviewObj.ratings = rating;
    reviewObj.description = userReview;
    postReview(reviewObj);
    formsContainer.style.animation = `slideOut 2000ms ease-out forwards`;
    review.value = '';
    ratingsContainer.querySelector('.active').classList.remove('active');
  } else {
    window.alert('please rate the prod');
  }
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
