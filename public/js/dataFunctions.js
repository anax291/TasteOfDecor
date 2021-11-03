/* Helper Functions */

// function to empty Container
export const emptyContainer = (container) => {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

// function to add Loading Animation
export const addLoadingAnimation = (container) => {
  const image = document.createElement('img');
  image.classList.add('loading-gif');
  image.src = './assets/misc/loadingSvg.svg';
  container.appendChild(image);
};

// function to get random number
export const getRandomNumber = (min = 0, max = 359) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// get Future Date
export const getFutureDate = (daysAhead = 0) => {
  const reqdDate = new Date();
  reqdDate.setDate(reqdDate.getDate() + daysAhead);
  const date = reqdDate.getDate();
  const month = reqdDate.getMonth();
  const year = reqdDate.getFullYear();
  const day = reqdDate.getDay();
  return formatDate(date, month, year, day);
};
const formatDate = (date, month, year, day) => {
  const mapMonth = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December',
  };
  const mapDay = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  };
  return { date: date, month: mapMonth[month], year: year, day: mapDay[day] };
};

// Shuffle Array
export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate random number
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

/* Create Category list and inject [for index and collection page] */
export const createCategoriesAndInject = (categories, categoryList) => {
  categories.forEach((category) => {
    const li = document.createElement('li');
    li.classList.add('category');
    category.id && li.setAttribute('data-id', category.id);
    li.setAttribute('data-category', category.name);
    li.appendChild(document.createTextNode(category.name));
    categoryList.appendChild(li);
  });
};

// function to remove loading animation
export const removeLoadingAnimation = (container) =>
  container.removeChild(container.firstChild);

/* Number With Commas */
export const numberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/* Name Initials */
export const getNameInitials = (name) => {
  let initials = name.split(' ');
  if (initials.length == 1) {
    initials = initials[0].charAt(0).toUpperCase();
  } else {
    initials =
      initials[0].charAt(0).toUpperCase() +
      initials[initials.length - 1].charAt(0).toUpperCase();
  }
  return initials;
};

/* Inject Prodouct Cards */
export const injectProducts = (cardTemplate, products, productContainer) => {
  products.forEach((product) => {
    const card = cardTemplate.content.firstElementChild.cloneNode(true);
    const prodImage = card.querySelector('img');
    const names = card.querySelectorAll('.name');
    const prices = card.querySelectorAll('.price');
    const details = card.querySelector('.inside .details');
    const ctaBtn = card.querySelector('.inside .btn');
    prodImage.src = product.imgSrc[0];
    prodImage.alt = product.name;
    card.setAttribute('data-id', product.id);
    names.forEach((name) => (name.textContent = product.name));
    prices.forEach(
      (price) => (price.textContent = `Rs. ${numberWithCommas(product.price)}`)
    );
    const prodDesc = product.description;
    prodDesc.forEach((desc) => {
      const li = document.createElement('li');
      li.appendChild(document.createTextNode(desc));
      details.appendChild(li);
    });
    ctaBtn.href = `./productDetail.html?id=${product.id}&categoryId=${product.categoryId}`;
    productContainer.appendChild(card);
  });
};

/* Throw Error */
export const throwError = (message, element) => {
  const elementWrapper = element.closest('.field-wrapper') || element.parentElement;
  const err = document.createElement('span');
  err.classList.add('err');
  err.textContent = message;
  elementWrapper.appendChild(err);
  setTimeout(() => {
    elementWrapper.removeChild(elementWrapper.lastChild);
  }, 3000);
};

// displaying message
export const displayMsg = (msg, alertType, time) => {
  const popUp = document.createElement('p');
  popUp.classList.add(`alert`);
  popUp.classList.add(alertType);
  popUp.style.animationDuration = `${time}ms`;
  popUp.textContent = msg;
  document.body.appendChild(popUp);
  setTimeout(() => {
    document.body.removeChild(document.querySelector('.alert'));
  }, time);
};

// updateBuyNowBtnState
export const updateBuyNowBtnState = () => {
  const id = document.body.id;
  if (!id === 'prod-detail') return;
  try {
    const btn = document.querySelector('.buy-now');
    if (document.querySelector('.item')) {
      btn.setAttribute('disabled', '');
    } else {
      btn.removeAttribute('disabled');
    }
  } catch (error) {
    console.log(error);
  }
};
