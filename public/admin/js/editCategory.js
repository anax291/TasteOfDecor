import { getDataFromDb, updateDataInDb } from '../../js/apiCalls.js';

const categoryId = new URLSearchParams(window.location.search).get('id');

/* Grabbing UI elements */
const form = document.querySelector('.edit-category');
const categoryNameField = document.getElementById('category-name');
const itemsList = document.querySelector('.items');
const updateBtn = document.querySelector('.update-category');
const listItemTemplate = document.querySelector('[data-item]');

const init = async () => {
  const category = await getDataFromDb(`categories/${categoryId}`);
  const products = await getDataFromDb(`categories/${categoryId}/products`);
  form.addEventListener('submit', (e) => e.preventDefault());
  updateNameField(category);
  createProductsListAndAddToDOM(products);
  updateBtn.addEventListener('click', updateCategory);
};

const updateNameField = (category) => {
  categoryNameField.value = category.name;
};

const createProductsListAndAddToDOM = (products) => {
  const lis = products.map((product) => createProductListItem(product));
  lis.forEach((li) => itemsList.appendChild(li));
};

const createProductListItem = ({ id, name, imgSrc }) => {
  const li = listItemTemplate.content.firstElementChild.cloneNode(true);
  const itemImage = li.querySelector('.item__image');
  const itemName = li.querySelector('.item__name');
  const itemDeleteBtn = li.querySelector('.item__delete-btn');
  li.setAttribute('data-id', id);
  itemImage.src = `.${imgSrc[0]}`;
  itemImage.alt = name;
  itemName.textContent = name;
  itemDeleteBtn.title = `Remove ${name} from this category`;
  itemDeleteBtn.setAttribute('aria-label', `Remove ${name} from this category`);
  itemDeleteBtn.addEventListener('click', () => removeItemFromThisCategory(id));
  return li;
};

const removeItemFromThisCategory = async (id) => {
  await updateDataInDb(`products/${id}`, { categoryId: null });
  itemsList.removeChild(itemsList.querySelector(`[data-id="${id}"]`));
};

const updateCategory = async () => {
  await updateDataInDb(`categories/${categoryId}`, { name: categoryNameField.value });
};

document.addEventListener('DOMContentLoaded', init);
