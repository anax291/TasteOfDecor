import { getDataFromDb, updateDataInDb } from '../../js/apiCalls.js';
import { numberWithCommas } from '../../js/dataFunctions.js';

const orderId = new URLSearchParams(window.location.search).get('id');

const init = async () => {
  const orderObject = await getDataFromDb(`orders/${orderId}`);
  document.querySelector('.root').appendChild(displayPage(orderObject));
};

const displayPage = (orderObject) => {
  const app = document.createElement('main');
  app.classList.add('app');
  app.appendChild(displayHeader(orderObject.id.toString()));
  app.appendChild(displayShipping(orderObject));
  app.appendChild(displayOrders(orderObject.items));
  app.appendChild(displaySummary(orderObject));
  return app;
};

const displayHeader = (id) => {
  const header = document
    .querySelector('[data-header]')
    .content.firstElementChild.cloneNode(true);
  header.querySelector('h1').textContent = `Order ${id.length === 1 ? `0${id}` : id}`;
  return header;
};

const displayShipping = (orderObject) => {
  const delivered = orderObject.hasBeenDelivered;
  const section = document
    .querySelector('[data-shipping]')
    .content.firstElementChild.cloneNode(true);
  section.querySelector('.user__name span').textContent = orderObject.name;
  section.querySelector('.user__email a').textContent = orderObject.email;
  section.querySelector('.user__email a').href = `mailto:${orderObject.email}`;
  section.querySelector('.user__cell a').textContent = orderObject.tel;
  section.querySelector('.user__cell a').href = `tel:+92${orderObject.tel.slice(1)}`;
  section.querySelector('.user__address span').textContent = orderObject.address;
  const deliveredBox = section.querySelector('.delivered__status');
  deliveredBox.classList.add(delivered ? 'delivered' : 'not-delivered');
  deliveredBox.textContent = delivered
    ? `Delivered at: ${orderObject.deliveryDateTime}`
    : 'Not Delivered';
  return section;
};

const displayOrders = (items) => {
  const section = document
    .querySelector('[data-order-items]')
    .content.firstElementChild.cloneNode(true);
  const ul = section.querySelector('.items');
  const lis = items.map((item) => displayItem(item));
  lis.forEach((li) => ul.appendChild(li));
  return section;
};

const displayItem = (item) => {
  item = { ...item, total: Number(item.qty) * Number(item.price) };
  const li = document
    .querySelector('[data-order-item]')
    .content.firstElementChild.cloneNode(true);
  li.querySelector('img').src = `.${item.imgSrc}`;
  li.querySelector('.item__name').textContent = item.name;
  li.querySelector('.item__price').textContent = `${item.qty} x Rs. ${numberWithCommas(
    item.price
  )} = Rs. ${numberWithCommas(item.total)}`;
  return li;
};

const displaySummary = (order) => {
  const delivered = order.hasBeenDelivered;
  const section = document
    .querySelector('[data-summary]')
    .content.firstElementChild.cloneNode(true);
  section.querySelector('.order__total span').textContent = `Rs. ${numberWithCommas(
    order.subtotal
  )}`;
  section.querySelector('.order__discount-code span').textContent = order.discountCode;
  section.querySelector('.order__discount span').textContent = order.discountPercent;
  section.querySelector('.order__final-price span').textContent = `Rs. ${numberWithCommas(
    order.totalPrice
  )}`;
  if (!delivered) section.appendChild(showMarkAsDeliverBtn());
  return section;
};

const showMarkAsDeliverBtn = () => {
  const button = document.createElement('button');
  button.classList.add('btn');
  button.classList.add('mark-as-deliver');
  button.textContent = 'Mark as Delivered';
  button.addEventListener('click', () => {
    markOrderAsDelivered();
    updateDeliveryStatus();
  });
  return button;
};

const markOrderAsDelivered = async () => {
  const obj = { hasBeenDelivered: true, deliveryDateTime: new Date() };
  await updateDataInDb(`orders/${orderId}`, obj);
  document
    .querySelector('.order__summary')
    .removeChild(document.querySelector('.mark-as-deliver'));
};

const updateDeliveryStatus = async () => {
  const orderObject = await getDataFromDb(`orders/${orderId}`);
  const deliveredBox = document.querySelector('.delivered__status');
  deliveredBox.classList.remove('not-delivered');
  deliveredBox.classList.add('delivered');
  deliveredBox.textContent = `Deliverd at: ${orderObject.deliveryDateTime}`;
};

document.addEventListener('DOMContentLoaded', init);
