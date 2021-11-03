/* Get data from local storage */
export const getDataFromLS = (key) => {
  const result = localStorage.getItem(key);
  const data = result ? JSON.parse(result) : [];
  return data;
};

/* Set data to localStorage */
export const setDataToLS = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};
