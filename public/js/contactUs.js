import {
  validateName,
  validateEmail,
  validateSubject,
  validateMessage,
  postDataToDb,
  clearFields,
  displayMsg,
  getDataFromDb,
} from './dataFunctions.js';

// Grabbing UI Elements
const contactForm = document.getElementById('contact-form');
const nameField = document.getElementById('name');
const emailField = document.getElementById('email');
const subjectField = document.getElementById('subject');
const textArea = document.getElementById('message');

// Submit Event
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = nameField.value;
  const email = emailField.value;
  let subject = subjectField.value;
  const message = textArea.value;
  if (!validateForm(name, email, subject, message)) return;

  subject = subject.trim().toLowerCase();
  let isEmailAlreadyTaken = false;
  if (subject === 'testimonial') {
    isEmailAlreadyTaken = await checkEmail(email);
  }
  if (isEmailAlreadyTaken) {
    displayMsg('Please choose another email', 'danger');
  } else {
    createMessageObj(name, email, subject, message);
    displayMsg('Your message has been recorded', 'success');
    clearFields(nameField, emailField, subjectField, textArea);
  }
});

const validateForm = (name, email, subject, message) => {
  if (!validateName(name)) {
    throwError('Please enter a valid name', nameField);
    return false;
  }
  if (!validateEmail(email)) {
    throwError('Please enter a valid email', emailField);
    return false;
  }
  if (!validateSubject(subject)) {
    throwError('Please enter a valid subject', subjectField);
    return false;
  }
  if (!validateMessage(message)) {
    throwError('please enter a proper message', textArea);
    return false;
  }
  return true;
};

const throwError = (message, element) => {
  const err = document.createElement('span');
  err.classList.add('err');
  err.textContent = message;
  element.parentElement.appendChild(err);
  setTimeout(() => {
    element.parentElement.removeChild(element.parentElement.lastChild);
  }, 3000);
};

const createMessageObj = (userName, userEmail, title, desc) => {
  let obj = {
    name: userName,
    email: userEmail,
    subject: title,
    message: desc,
  };
  postDataToDb(obj, 'messages');
};

const checkEmail = async (email) => {
  const data = await getDataFromDb('http://localhost:3000/messages');
  const res = data.find(
    (obj) => obj.email === email && obj.subject === 'testimonial'
  );
  console.log(res);
  return res;
};

/* Intro js */
introJs()
  .setOptions({
    steps: [
      {
        element: subjectField,
        intro: `
          <h2 style="margin-bottom: 0.75rem">Want to post a review for us???</h2>
          <p style="margin-bottom: 0.75rem"> Make "testimonial" the subject of your form and then submit</p>
          <p style="margin-bottom: 0.75rem"> Like this </p>
          <input style="padding: 0.5rem 1rem; margin-bottom: 0.75rem" type="text" value="Testimonial">
          <h3 style="margin-bottom: 0.75rem">Thank You </h3>
      `,
      },
    ],
  })
  .start();
