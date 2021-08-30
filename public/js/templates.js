export const emptyCartTemplate = document.createElement('template');
emptyCartTemplate.innerHTML = `
        <div class="empty-cart">
          <div class="message">
            <p>Your shopping Cart is empty</p>
            <p>Stay Connected with us...</p>
          </div>
          <img src="./assets/misc/empty-cart.svg" alt="">
          <p>@Taste Of Decor</p>
        </div>
`;

export const cartItemTemplate = document.createElement('template');
cartItemTemplate.innerHTML = `
    <div class="item">
      <img src="" alt="" class="item__img">
      <div class="item__info">
        <p class="item__name"></p>
        <p class="item__price"></p>
        <div class="qty-info">
          <button class="decreament"><i class="fas fa-minus"></i></button>
          <span class="item__qty">1</span>
          <button class="increament"><i class="fas fa-plus"></i></button>
        </div>
      </div>
      <div class="delete-item">
        <i class="far fa-trash-alt"></i>
      </div>
    </div>
`;

export const cartDeletingTemplate = document.createElement('template');
cartDeletingTemplate.innerHTML = `
  <div class="item deleting">
    <img src="" alt="" class="item__img animate-bg">
    <div class="item__info">
      <p class="item__name">
        <span class="animate-bg animate-text"></span>
        <span class="animate-bg animate-text"></span>
      </p>
      <p class="item__price">
        <span class="animate-bg animate-text"></span>
      </p>
      <div class="qty-info animate-bg">
      </div>
    </div>
    <div class="delete-item">
      <i class="far fa-trash-alt"></i>
    </div>
  </div>
`;

export const modal = document.createElement('template');
modal.innerHTML = `
  <div class="popup-overlay" aria-expanded="false">
    <div class="popup container">
      <div class="header">
        <div class="cross"><span></span></div>
        <p class="sub-title">[ What We Offer ]</p>
        <h3 class="lead">All Kinds of Buildings in Chematic or Working Design</h3>
      </div>
      <div class="content">
        <h2 class="heading"></h2>
        <p>The interior design of your dream begins with a concept that is reflected in the blueprints, project plans,
          in 3D visualizations. It is possible to make any place more interesting, attractive and functional, for this
          it is worth to trust the real professionals and then the money will not be spent in a vain.
        </p>
        <div class="images">
          <img src="" alt="">
          <img src="" alt="">
        </div>
        <p>In design, we bring characteristics of the natural world into built spaces, such as water, greenery, and
          natural light, or elements like wood and stone. Encouraging the use of natural systems and processes in design
          allows for exposure to nature, and in turn, these design approaches improve health and wellbeing. There are a
          number of possible benefits, including reduced heart rate variability and pulse rates, decreased blood
          pressure, and increased activity in our nervous systems, to name a few.
        </p>
        <img src="" alt="">
        <p>Over time, our connections to the natural world diverged in parallel with technological developments.
          Advances in the 19th and 20th centuries fundamentally changed how people interact with nature. Sheltered from
          the elements, we spent more and more time indoors. Today, the majority of people spend almost 80-90% of their
          time indoors, moving between their homes and workplaces. As interior designers embrace biophilia.
        </p>
      </div>
    </div>
  </div>
`;
