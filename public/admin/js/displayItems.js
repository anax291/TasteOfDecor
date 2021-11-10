import { getDataFromDb } from '../../js/apiCalls.js';
import { emptyContainer, numberWithCommas } from '../../js/dataFunctions.js';

export const updateHeader = (title) => {
  const resourceTitle = document.querySelector('.resources__details__header h1');
  resourceTitle.textContent = title;
};

export const showProducts = async () => {
  // grabbing data
  const products = await getDataFromDb('products');
  // Grabbing UI Elements
  const productsContainer = document.querySelector('.app');
  const headerTemplate = document.querySelector('[data-resource-item-header]');
  const header = headerTemplate.content.firstElementChild.cloneNode(true);
  const itemTemplate = document.querySelector('[data-resource-item]');
  const ul = document.createElement('ul');
  ul.classList.add('resource__table');
  // clearing the div
  emptyContainer(productsContainer);
  // injecting header
  productsContainer.appendChild(header);
  // injecting product items
  for (const product of products) {
    const resourceItem = itemTemplate.content.firstElementChild.cloneNode(true);
    resourceItem.setAttribute('data-product-id', product.id);
    resourceItem.querySelector('.resource__item__id').textContent = product.id;
    resourceItem.querySelector('.resource__item__name').textContent = product.name;
    resourceItem.querySelector(
      '.resource__item__price'
    ).textContent = `Rs. ${numberWithCommas(product.price)}`;
    resourceItem.querySelector('.resource__item__stock').textContent = '50';
    ul.appendChild(resourceItem);
  }
  productsContainer.appendChild(ul);
};

export const showCategories = async () => {
  const categories = await getDataFromDb('categories');
  const products = await getDataFromDb('products');
  const productsQuantity = products.reduce((temp, prod) => {
    if (temp[prod.categoryId]) temp[prod.categoryId] = temp[prod.categoryId] + 1;
    else temp[prod.categoryId] = 1;
    return temp;
  }, {});
  // Grabbing UI Elements
  const categoriesContainer = document.querySelector('.app');
  const headerTemplate = document.querySelector('[data-category-header]');
  const header = headerTemplate.content.firstElementChild.cloneNode(true);
  const itemTemplate = document.querySelector('[data-category]');
  const ul = document.createElement('ul');
  ul.classList.add('categories');
  // clearing the div
  emptyContainer(categoriesContainer);
  // injecting header
  categoriesContainer.appendChild(header);
  // inject categories
  for (const category of categories) {
    const item = itemTemplate.content.firstElementChild.cloneNode(true);
    item.setAttribute('data-category-id', category.id);
    item.querySelector('.category__id').textContent = category.id;
    item.querySelector('.category__name').textContent = category.name;
    item.querySelector('.category__items').textContent = productsQuantity[category.id];
    ul.appendChild(item);
  }
  categoriesContainer.appendChild(ul);
};

export const showOrder = async () => {
  const orders = await getDataFromDb('orders');
  const ordersContainer = document.querySelector('.app');
  const headerTemplate = document.querySelector('[data-order-header]');
  const header = headerTemplate.content.firstElementChild.cloneNode(true);
  // clearing the div
  emptyContainer(ordersContainer);
  // injecting header
  ordersContainer.appendChild(header);
  // if there are no order
  if (orders.length === 0) {
    const p = document.createElement('p');
    p.style.fontSize = '3rem';
    p.style.textAlign = 'center';
    p.textContent = 'No Orders to show...';
    ordersContainer.appendChild(p);
    return;
  }
  // if there are any orders
  const itemTemplate = document.querySelector('[data-order-item]');
  const ul = document.createElement('ul');
  ul.classList.add('order__table');

  // injecting orders
  for (const order of orders) {
    const qty = order.items.reduce((total, curr) => (total += curr.qty), 0);
    const item = itemTemplate.content.firstElementChild.cloneNode(true);
    item.setAttribute('data-order-id', order.id);
    item.querySelector('.order__item__id').textContent = order.id;
    item.querySelector('.customer__name').textContent = order.name;
    item.querySelector('.order__price').textContent = `Rs. ${numberWithCommas(
      order.totalPrice
    )}`;
    item.querySelector('.product__qty').textContent = qty;
    item.querySelector('.order__item__view').href = `./orderDetail.html?id=${order.id}`;
    item.querySelector('.delivered-status').textContent = order.hasBeenDelivered;
    ul.appendChild(item);
  }
  ordersContainer.appendChild(ul);
};

export const showMessages = async () => {
  const messages = await getDataFromDb('messages');
  const messageContainer = document.querySelector('.app');
  const messageTemplate = document.querySelector('[data-message-template]');
  const ul = document.createElement('ul');
  ul.classList.add('messages');
  // clearing the div
  emptyContainer(messageContainer);
  // injecting messages
  for (const message of messages) {
    const msgItem = messageTemplate.content.firstElementChild.cloneNode(true);
    msgItem.setAttribute('data-id', message.id);
    msgItem.querySelector('.message__name span').textContent = message.name;
    msgItem.querySelector('.message__subject span').textContent = message.subject;
    msgItem.querySelector('.message__body span').textContent = message.message;
    if (message.subject.toLowerCase() === 'testimonial') addToogler(msgItem, message);
    ul.appendChild(msgItem);
  }
  messageContainer.appendChild(ul);
};

const addToogler = (msgItem, message) => {
  // grab toggler template
  const togglerTemplate = document.querySelector('[data-toggler]');
  const toggler = togglerTemplate.content.firstElementChild.cloneNode(true);
  toggler.setAttribute('for', `message${message.id}`);
  toggler.querySelector('.featured-toggler').id = `message${message.id}`;
  toggler.querySelector('.featured-toggler').checked = message.featured;
  msgItem.appendChild(toggler);
};
