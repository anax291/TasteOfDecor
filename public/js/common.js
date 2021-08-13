import {
  addProdToCartInDb,
  deleteDataFromDb,
  deletingCartItemAnimation,
  getDataFromDb,
  updateBadge,
  updateCart,
  updateData,
  updateTotalPrice,
} from './dataFunctions.js';

document.addEventListener('DOMContentLoaded', () => {
  updateBadge();
  updateCart();
});

// hamburger
const hamburgerBtn = document.querySelector('.hamburger');
hamburgerBtn.addEventListener('click', function () {
  hamburgerBtn.classList.toggle('menu-active');
});

// scroll activated navbar
const body = document.body;
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (window.pageYOffset > 80) {
    // at top
    if (currentScroll <= 0) {
      body.classList.remove('scroll-up');
    }
    // going down
    if (currentScroll > lastScroll && !body.classList.contains('scroll-down')) {
      body.classList.remove('scroll-up');
      body.classList.add('scroll-down');
    }
    //going up
    if (currentScroll < lastScroll && body.classList.contains('scroll-down')) {
      body.classList.remove('scroll-down');
      body.classList.add('scroll-up');
    }
  }
  lastScroll = currentScroll;
});

// Cards interaction
const ids = ['index', 'collection', 'prod-detail'];
if (ids.includes(body.id)) {
  const prodContainer =
    document.querySelector('.product-container') ||
    document.querySelector('.products') ||
    document.querySelector('.similar-products .flex');

  prodContainer.addEventListener('click', (e) => {
    const targetCard = e.target.closest('.card');
    if (!targetCard) return;
    const addToCartBtn = targetCard.querySelector('.buy');
    const removeBtn = targetCard.querySelector('.remove');
    if (e.target.parentElement === addToCartBtn) {
      targetCard.querySelector('.bottom').classList.add('clicked');
      // adding prod to cart in data base
      cartFunctions(targetCard);
    } else if (e.target.parentElement === removeBtn) {
      targetCard.querySelector('.bottom').classList.remove('clicked');
    }
  });
}

/* Footer Stuff */
// const cursor = document.getElementById('cursor');
// const footer = document.querySelector('.footer');

// footer.addEventListener('mousemove', function (e) {
//   cursor.style.left = e.pageX + 'px';
//   cursor.style.top = e.pageY + 'px';
// });

// document.querySelectorAll('.wrap').forEach((wrap) => {
//   wrap.addEventListener('mousemove', (e) => {
//     cursor.classList.add('active');
//   });
// });

// document.querySelectorAll('.wrap').forEach((wrap) => {
//   wrap.addEventListener('mouseleave', (e) => {
//     cursor.classList.remove('active');
//   });
// });

/* Custom Footer */

const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.3/css/all.css"
    integrity="sha384-SZXxX4whJ79/gErwcOYf+zWLeJdY/qpuqC4cAa9rOGUstPomtqpuNWT9wdPEn2fk" crossorigin="anonymous">
  <link rel="stylesheet" href="./css/footer.css">
  <footer class="footer">
    <div class="cursor" id="cursor"></div>
    <div class="container">
      <div class="grid">
        <div class="col col1">
          <h1 class="name">Taste Of Decor</h1>
          <p>We create possibilities for the connected world.</p>
          <p class="tagline">Be Bold</p>
        </div>
        <div class="col col2">
          <h3 class="col-title">Explore</h3>
          <a href="#" class="wrap">
            <div class="inner">
              <div class="top">Home</div>
              <div class="bottom">Home</div>
            </div>
          </a>
          <a href="#" class="wrap">
            <div class="inner">
              <div class="top">About</div>
              <div class="bottom">About</div>
            </div>
          </a>
          <a href="#" class="wrap">
            <div class="inner">
              <div class="top">Capabilities</div>
              <div class="bottom">Capabilities</div>
            </div>
          </a>
          <a href="#" class="wrap">
            <div class="inner">
              <div class="top">Career</div>
              <div class="bottom">Career</div>
            </div>
          </a>
        </div>
        <div class="col col3">
          <h3 class="col-title">Visit</h3>
          <a href="#" class="wrap">
            <div class="inner">
              <div class="top">03333107559</div>
              <div class="bottom">03333107559</div>
            </div>
          </a>
          <a href="#" class="wrap">
            <div class="inner">
              <div class="top">support@tod.com</div>
              <div class="bottom">support@tod.com</div>
            </div>
          </a>
          <a href="#" class="wrap">
            <div class="inner">
              <div class="top">St.45/1 Italy</div>
              <div class="bottom">St.45/1 Italy</div>
            </div>
          </a>
        </div>
        <div class="col col4">
          <h3 class="col-title">Legal</h3>
          <a href="#" class="wrap">
            <div class="inner">
              <div class="top">Terms</div>
              <div class="bottom">Terms</div>
            </div>
          </a>
          <a href="#" class="wrap">
            <div class="inner">
              <div class="top">Policy</div>
              <div class="bottom">Policy</div>
            </div>
          </a>
          <a href="#" class="wrap">
            <div class="inner">
              <div class="top">Privacy</div>
              <div class="bottom">Privacy</div>
            </div>
          </a>
        </div>
      </div>
      <div class="social-links">
        <a href="#" class="icon facebook">
          <i class="fab fa-facebook-f"></i>
        </a>
        <a href="#" class="icon whatsapp">
          <i class="fab fa-whatsapp"></i>
        </a>
        <a href="#" class="icon instagram">
          <i class="fab fa-instagram"></i>
        </a>
        <a href="#" class="icon linkedin">
          <i class="fab fa-linkedin"></i>
        </a>
        <a href="#" class="icon youtube">
          <i class="fab fa-youtube"></i>
        </a>
        </div>
    </div>
  </footer>
`;

class CustomFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  showCursor() {
    const cursor = this.shadowRoot.querySelector('#cursor');
    cursor.style.display = 'block';
  }

  hideCursor() {
    const cursor = this.shadowRoot.querySelector('#cursor');
    cursor.style.display = 'none';
  }

  updateCursorPosition(e) {
    const cursor = this.shadowRoot.querySelector('#cursor');
    cursor.style.left = e.pageX + 'px';
    cursor.style.top = e.pageY + 'px';
  }
  addClass() {
    const cursor = this.shadowRoot.querySelector('#cursor');
    if (!cursor.classList.contains('active')) {
      cursor.classList.add('active');
    }
  }
  removeClass() {
    const cursor = this.shadowRoot.querySelector('#cursor');
    cursor.classList.remove('active');
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector('.footer')
      .addEventListener('mousemove', (e) => {
        this.updateCursorPosition(e);
      });
    this.shadowRoot.querySelectorAll('.wrap').forEach((wrap) => {
      wrap.addEventListener('mouseenter', (e) => {
        this.addClass();
      });
    });
    this.shadowRoot.querySelectorAll('.wrap').forEach((wrap) => {
      wrap.addEventListener('mouseleave', (e) => {
        this.removeClass();
      });
    });
    this.shadowRoot
      .querySelector('.footer')
      .addEventListener('mouseleave', (e) => this.hideCursor());
    this.shadowRoot
      .querySelector('.footer')
      .addEventListener('mouseenter', (e) => this.showCursor());
  }
}

window.customElements.define('custom-footer', CustomFooter);

/* Cart */
const cartIcon = document.querySelector('.cart-wrapper');
const cartContainer = document.querySelector('.cart-container');

// open cart
cartIcon.addEventListener('click', (e) => {
  openCart();
});

const openCart = () => {
  cartContainer.classList.add('cart-open');
  document.body.style = 'overflow: hidden';
};

//close cart
cartContainer.querySelector('.close').addEventListener('click', () => {
  cartContainer.classList.remove('cart-open');
  document.body.style = '';
});

const cartFunctions = async (card) => {
  const success = await addProdToCartInDb(card);
  if (success) {
    updateBadge();
    updateCart();
  }
};

/* Cart Interactions */

const cart = document.querySelector('.cart-container');
cart.addEventListener('click', (e) => {
  const target =
    e.target.closest('.delete-item') ||
    e.target.closest('.increament') ||
    e.target.closest('.decreament') ||
    e.target.closest('.remove-all');

  if (!target) return;
  switch (target.className) {
    case 'delete-item':
      deleteItem(e);
      break;
    case 'increament':
      changeProdQty(e, 'increase');
      break;
    case 'decreament':
      changeProdQty(e, 'decrease');
      break;
    case 'remove-all':
      removeAll(e);
      break;
  }
});

const deleteItem = async (e) => {
  const targetCard = e.target.closest('.item');
  const targetId = targetCard.getAttribute('data-id');
  let url = `http://localhost:3000/cart/${targetId}`;
  const success = await deleteDataFromDb(url);
  deletingCartItemAnimation(targetCard);
  setTimeout(() => {
    if (success) {
      updateCart();
      updateBadge();
    }
  }, 2000);
};

const changeProdQty = async (e, mode) => {
  const targetCard = e.target.closest('.item');
  const targetId = targetCard.getAttribute('data-id');
  let prodQty = targetCard.querySelector('.item__qty');
  let obj;
  if (mode === 'increase') {
    obj = { qty: parseInt(prodQty.textContent) + 1 };
  } else {
    if (parseInt(prodQty.textContent) == 1) {
      deleteItem(e);
      return;
    } else {
      obj = { qty: parseInt(prodQty.textContent) - 1 };
    }
  }
  let url = `http://localhost:3000/cart/${targetId}`;
  const success = updateData(url, obj);
  if (success) {
    updateBadge();
    updateCart();
  }
};

const removeAll = async (e) => {
  const cartItems = e.target.closest('.cart-head').nextElementSibling;
  const items = Array.from(cartItems.children);
  let success;
  items.forEach((item) => {
    const id = item.getAttribute('data-id');
    let url = `http://localhost:3000/cart/${id}`;
    success = deleteDataFromDb(url);
    deletingCartItemAnimation(item);
  });
  setTimeout(() => {
    if (success) {
      updateCart();
      updateBadge();
    }
  }, 2000);
};
