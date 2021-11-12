import { getDataFromDb, updateDataInDb } from '../../js/apiCalls.js';
import { getNameInitials, numberWithCommas } from '../../js/dataFunctions.js';
import { createElementWithOptions } from './helperFunctions.js';

const productId = new URLSearchParams(window.location.search).get('id');

const init = async () => {
  const product = await getDataFromDb(`products/${productId}`);
  document.querySelector('.root').appendChild(displayPage(product));
};

const displayPage = (product) => {
  const app = document.createElement('div');
  app.classList.add('app', 'container');
  app.appendChild(createProductView(product));
  app.appendChild(createReviewsView(product.reviews));
  return app;
};

const createProductView = (product) => {
  const productView = document.createElement('section');
  productView.classList.add('product__view');
  productView.appendChild(createImageGrid(product));
  productView.appendChild(createProductDetails(product));
  return productView;
};

const createImageGrid = ({ name, imgSrc: images }) => {
  const imageGrid = document.createElement('div');
  imageGrid.classList.add('image-grid');
  imageGrid.appendChild(createImage(images[0], name, 'primary__image'));
  const imgs = images.map((image) => createImage(image, name));
  imgs.forEach((img) => imageGrid.appendChild(img));
  imageGrid.querySelector('.primary__image + *').classList.add('active');
  return imageGrid;
};

const createImage = (imageSource, imageAlt, className = null) => {
  const img = document.createElement('img');
  img.src = `.${imageSource}`;
  img.alt = imageAlt;
  className
    ? img.classList.add(className)
    : img.addEventListener('click', togglePrimaryImage);
  return img;
};

const togglePrimaryImage = (e) => {
  document.querySelector('.primary__image').src = e.target.src;
  document.querySelector('.image-grid .active').classList.remove('active');
  e.target.classList.add('active');
};

const createProductDetails = (product) => {
  const productDetails = document.createElement('div');
  productDetails.classList.add('product__details', 'flow');
  productDetails.appendChild(createHeader(product.name, product.price));
  productDetails.appendChild(displayProductRatings(product.reviews));
  productDetails.appendChild(displayProductDescription(product.description));
  productDetails.appendChild(createEditBtn(product.id));
  return productDetails;
};

const createHeader = (name, price) => {
  const fragment = document.createDocumentFragment();
  const productName = document.createElement('h2');
  productName.classList.add('product__name');
  productName.textContent = name;
  const productPrice = document.createElement('p');
  productPrice.classList.add('product__price');
  productPrice.textContent = `Rs. ${numberWithCommas(price)}`;
  fragment.appendChild(productName);
  fragment.appendChild(productPrice);
  return fragment;
};

const displayProductRatings = (reviews) => {
  const div = createElementWithOptions('div', ['product__ratings']);
  const starsOuter = createElementWithOptions('div', ['stars-outer']);
  const starsInner = createElementWithOptions('div', ['stars-inner']);
  starsOuter.appendChild(starsInner);
  const span = createElementWithOptions('span', ['reviews-number']);
  div.appendChild(starsOuter);
  div.appendChild(span);
  if (reviews.length) {
    const [starsWidth, avgRating] = getRatingsInfo(reviews);
    span.textContent = `${reviews.length} reviews (${avgRating} avg. ratings)`;
    starsInner.style.width = starsWidth;
  } else {
    span.textContent = `No reviews`;
  }
  return div;
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

const displayProductDescription = (description) => {
  if (description.length === 1) {
    const p = document.createElement('p');
    p.classList.add('product__description');
    p.textContent = [description];
    return p;
  }
  const ul = document.createElement('ul');
  ul.classList.add('product__description');
  const lis = description.map((desc) => createDescriptionItem(desc));
  lis.forEach((li) => ul.appendChild(li));
  return ul;
};

const createDescriptionItem = (desc) => {
  const li = document.createElement('li');
  li.textContent = desc;
  return li;
};

const createEditBtn = (id) => {
  const btn = document.createElement('a');
  btn.href = `./editProduct.html?id=${id}`;
  btn.classList.add('btn', 'edit-product');
  btn.textContent = 'Edit Product...';
  return btn;
};

const createReviewsView = (reviews) => {
  const reviewsSection = document.createElement('section');
  reviewsSection.classList.add('reviews', 'container');
  const title = createElementWithOptions('h2', ['review-title'], 'Reviews');
  reviewsSection.appendChild(title);
  if (reviews.length) {
    const reviewItems = reviews.map((review) => createReviewItem(review, reviews));
    reviewItems.forEach((reviewItem) => reviewsSection.appendChild(reviewItem));
  } else {
    reviewsSection.style.gridTemplateColumns = '1fr';
    reviewsSection.appendChild(displayEmptyMessage());
  }
  return reviewsSection;
};

const createReviewItem = (review, reviews) => {
  const reviewItem = document.createElement('article');
  reviewItem.classList.add('review', 'flow');
  reviewItem.appendChild(createDeleteBtn(review.id, reviews));
  reviewItem.appendChild(displayMetaInfo(review));
  reviewItem.appendChild(addRatings(Number(review.ratings)));
  reviewItem.appendChild(addReviewDescription(review.description));
  return reviewItem;
};

const createDeleteBtn = (id, reviews) => {
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-review', 'far', 'fa-trash-alt', 'fa-2x');
  deleteBtn.ariaLabel = 'Delete this review';
  deleteBtn.title = 'Delete this review';
  deleteBtn.addEventListener('click', () => deleteReview(id, reviews));
  return deleteBtn;
};

const deleteReview = async (id, reviews) => {
  const reviewList = reviews.filter((review) => review.id.toString() !== id.toString());
  await updateDataInDb(`products/${productId}`, { reviews: reviewList });
  window.location.reload();
};

const displayMetaInfo = ({ name, email }) => {
  const metaInfo = createElementWithOptions('div', ['flex']);
  const userImage = createElementWithOptions(
    'div',
    ['user-image'],
    getNameInitials(name)
  );
  metaInfo.appendChild(userImage);
  const userInfo = createElementWithOptions('div', ['user-info']);
  const userName = createElementWithOptions('h3', ['user-name'], name);
  userInfo.appendChild(userName);
  const userEmail = createElementWithOptions('p', ['user-email'], email);
  userInfo.appendChild(userEmail);
  metaInfo.appendChild(userInfo);
  return metaInfo;
};

const addRatings = (ratings) => {
  const starsOuter = createElementWithOptions('div', ['stars-outer']);
  const starsInner = createElementWithOptions('div', ['stars-inner']);
  starsInner.style.width = `${(ratings / 5) * 100}%`;
  starsOuter.appendChild(starsInner);
  return starsOuter;
};

const addReviewDescription = (text) => {
  const p = createElementWithOptions('p', ['review__body'], text);
  return p;
};

const displayEmptyMessage = () => {
  const div = createElementWithOptions('div', ['not-found']);
  const p = createElementWithOptions('p', undefined, 'No Reviews Found');
  const img = document.createElement('img');
  img.src = '../assets/misc/notfound.svg';
  div.appendChild(p);
  div.appendChild(img);
  return div;
};

document.addEventListener('DOMContentLoaded', init);
