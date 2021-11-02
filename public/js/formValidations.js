/* Email validation */
export const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/* Name Validation */
export const validateName = (name) => {
  const re = /^[A-Z][a-z]*(([,.] |[ '-])[A-Za-z][a-z]*)*(\.?)$/;
  return re.test(name);
};

/* Subject Validation */
export const validateSubject = (text) => {
  const res = text.length <= 5 ? false : true;
  return res;
};

/* Address Validation */
export const validateAddress = (address) => {
  const res = address.length < 10 ? false : true;
  return res;
};

/* Validte Message */
export const validateMessage = (text) => {
  const res = text.length == 0 ? false : true;
  return res;
};

/* Validate Phone Number */
export const validatePhoneNumber = (number) => {
  const re = /\(?(\d{3})\)?[-\.\s]?(\d{3})[-\.\s]?(\d{4})/;
  return re.test(number);
};

/* Clear Form Fields */
export const clearFields = (...fields) => {
  fields.forEach((field) => {
    field.value = '';
  });
};
