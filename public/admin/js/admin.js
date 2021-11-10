import { updateDataInDb, deleteDataFromDb } from '../../js/apiCalls.js';
import { emptyContainer, numberWithCommas } from '../../js/dataFunctions.js';
import {
  showProducts,
  showCategories,
  showMessages,
  showOrder,
  updateHeader,
} from './displayItems.js';

const handleSideBarClick = (e) => {
  const target = e.target.closest('.resource__list__item');
  if (!target) return;
  document.querySelector('.resource__list .active').classList.remove('active');
  target.classList.add('active');
  switch (target.dataset.value) {
    case 'products':
      updateHeader('Inventory');
      showProducts();
      break;
    case 'categories':
      updateHeader('categories');
      showCategories();
      break;
    case 'orders':
      updateHeader('orders');
      showOrder();
      break;
    case 'messages':
      updateHeader('messages');
      showMessages();
      break;
  }
};

const handleAppInteractions = (e) => {
  const target = e.target.closest('ul');
  if (!target) return;
  if (target.classList.contains('resource__table')) handleResourceClicks(e);
  if (target.classList.contains('categories')) handleCategoriesClicks(e);
  if (target.classList.contains('order__table')) handleOrdersClicks(e);
  if (target.classList.contains('messages')) handleMessagesClicks(e);
};

const handleResourceClicks = (e) => {
  console.log(e.target);
};

const handleCategoriesClicks = (e) => {
  console.log(e.target);
};

const handleOrdersClicks = (e) => {
  console.log(e.target);
};

const handleMessagesClicks = (e) => {
  if (e.target.closest('.message__delete')) {
    const id = e.target.closest('.message').dataset.id;
    deleteMessage(id);
  }
  if (e.target.closest('.featured-toggler-container')) {
    const id = e.target.closest('.message').dataset.id;
    updateMessage(id);
  }
};

const deleteMessage = async (id) => {
  // deleting from database
  await deleteDataFromDb(`messages/${id}`);
  // removing from DOM
  document
    .querySelector('.messages')
    .removeChild(document.querySelector(`.message[data-id='${id}']`));
};

const updateMessage = async (id) => {
  const featured = document.getElementById(`message${id}`).checked;
  await updateDataInDb(`messages/${id}`, { featured });
};

const init = async () => {
  const sideBar = document.querySelector('.resource__list');
  const app = document.querySelector('.app');
  sideBar.addEventListener('click', handleSideBarClick);
  sideBar.firstElementChild.click();
  app.addEventListener('click', handleAppInteractions);
};

document.addEventListener('DOMContentLoaded', init);
