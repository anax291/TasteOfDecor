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

// function to remove loading animation
export const removeLoadingAnimation = (container) =>
  container.removeChild(container.firstChild);

/* fetch functions */
export const getDataFromDb = async (url) => {
  let res = await fetch(url);
  let categories = await res.json();
  return categories;
};

/* patch function */
export const postReviewToDb = async (url, reviewsArr) => {
  const body = { reviews: reviewsArr };
  const obj = {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(url, obj);
};

/* Inject Prodouct Cards */
export const injectProducts = (cardTemplate, products, productContainer) => {
  products.forEach((product) => {
    const card = document.importNode(cardTemplate.content, true);
    const prodImage = card.querySelector('img');
    const names = card.querySelectorAll('.name');
    const prices = card.querySelectorAll('.price');
    const details = card.querySelector('.inside .details');
    const ctaBtn = card.querySelector('.inside .btn');
    prodImage.src = product.imgSrc[0];
    prodImage.alt = product.name;
    names.forEach((name) => {
      name.textContent = product.name;
    });
    prices.forEach((price) => {
      price.textContent = `Rs. ${product.price}`;
    });
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

/* Email validation */
export const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
