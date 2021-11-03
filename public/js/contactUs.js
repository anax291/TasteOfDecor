import { getDataFromDb, postDataToDb, replaceDataInDb } from './apiCalls.js';
import { throwError, displayMsg } from './dataFunctions.js';
import {
  validateName,
  validateEmail,
  validateSubject,
  validateMessage,
  clearFields,
} from './formValidations.js';

// Grabbing UI Elements
const contactForm = document.getElementById('contact-form');
const nameField = document.getElementById('name');
const emailField = document.getElementById('email');
const subjectField = document.getElementById('subject');
const textArea = document.getElementById('message');

// Submit Event
contactForm.addEventListener('submit', handleFormSubmit);

async function handleFormSubmit(e) {
  e.preventDefault();
  const name = nameField.value;
  const email = emailField.value;
  let subject = subjectField.value;
  const message = textArea.value;
  if (!validateForm(name, email, subject, message)) return;

  subject = subject.trim().toLowerCase();
  let msgObj;
  if (subject === 'testimonial') msgObj = await checkEmail(email);

  if (msgObj) {
    replaceTestimonial(msgObj, name, message);
  } else {
    createMessageObj(name, email, subject, message, undefined, 'POST');
    displayMsg('Your message has been recorded', 'success', 4000);
    clearFields(nameField, emailField, subjectField, textArea);
  }
}

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

const createMessageObj = (name, email, subject, message, id = undefined, method) => {
  let obj = { name, email, subject, message };
  if (id) obj.id = id;
  if (method === 'POST') postDataToDb('messages', obj);
  else if (method === 'PUT') replaceDataInDb(`messages/${id}`, obj);
};

const checkEmail = async (email) => {
  const data = await getDataFromDb('messages');
  const res = data.find((obj) => obj.email === email && obj.subject === 'testimonial');
  return res;
};

const replaceTestimonial = async (obj, userName, message) => {
  displayPopup();
  document.querySelector('.popup').addEventListener('click', async (e) => {
    const target = e.target.closest('.replace') || e.target.closest('.cancel');
    if (target) {
      document.body.removeChild(document.querySelector('.popup'));
      document.body.style.overflow = '';
      if (target.classList.contains('replace')) {
        const id = obj.id,
          name = userName,
          title = obj.subject,
          email = obj.email,
          desc = message;
        createMessageObj(name, email, title, desc, id, 'PUT');
        displayMsg('Your message has been replaced', 'success', 4000);
        clearFields(nameField, emailField, subjectField, textArea);
      }
    }
  });
};

const displayPopup = () => {
  const popup = document
    .getElementById('replace-msg')
    .content.firstElementChild.cloneNode(true);
  document.body.appendChild(popup);
  document.body.style.overflow = 'hidden';
};

/* Intro js */
const showHint = () => {
  introJs()
    .setOptions({
      steps: [
        {
          element: document.querySelector('.subject-container'),
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
};

document.querySelector('.info').addEventListener('click', showHint);
