import { getDataFromDb, updateDataInDb } from '../../js/apiCalls.js';
import { displayMsg } from '../../js/dataFunctions.js';

const productId = new URLSearchParams(window.location.search).get('id');

/* Grabbing UI Fields */
const form = document.querySelector('.edit-product');
const productNameField = document.getElementById('product-name');
const productPriceField = document.getElementById('product-price');
const productDescription = document.getElementById('product-description');
const categoryList = document.getElementById('category-list');

const init = async () => {
  const categories = await getDataFromDb('categories');
  const product = await getDataFromDb(`products/${productId}`);
  updateFields(product, categories);
  form.addEventListener('submit', handleFormSubmit);
};

const updateFields = (product, categories) => {
  productNameField.value = product.name;
  productPriceField.value = Number(product.price);
  const options = [{ id: null, name: 'select category...' }, ...categories].map(
    (category) => createOptionElement(category, product.categoryId)
  );
  options.forEach((option) => categoryList.appendChild(option));
  product.description.forEach((desc, index) => {
    if (index === 0) productDescription.innerHTML = desc;
    else productDescription.innerHTML += `\n${desc}`;
  });
};

const createOptionElement = ({ id, name }, categoryId) => {
  const option = document.createElement('option');
  option.value = id;
  option.textContent = name;
  if (id?.toString() === categoryId?.toString()) option.selected = true;
  return option;
};

const handleFormSubmit = async (e) => {
  e.preventDefault();
  const description = productDescription.value
    .split('\n')
    .map((desc) => desc.trim())
    .filter((desc) => desc.length !== 0);
  const product = {
    categoryId: Number(categoryList.value),
    name: productNameField.value,
    price: Number(productPriceField.value),
    description,
  };
  await updateDataInDb(`products/${productId}`, product);
  displayMsg('Product has been updated successfully...', 'success', 4000);
  setTimeout(() => (window.location.href = `./productView.html?id=${productId}`), 4000);
};

document.addEventListener('DOMContentLoaded', init);
