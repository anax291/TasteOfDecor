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
