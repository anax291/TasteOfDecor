import {
  validateName,
  validateEmail,
  validateSubject,
  validateMessage,
  postDataToDb,
  clearFields,
} from './dataFunctions.js';

// Grabbing UI Elements
const contactForm = document.getElementById('contact-form');
const nameField = document.getElementById('name');
const emailField = document.getElementById('email');
const subjectField = document.getElementById('subject');
const textArea = document.getElementById('message');

// Submit Event
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameField.value;
  const email = emailField.value;
  let subject = subjectField.value;
  const message = textArea.value;
  if (!validateForm(name, email, subject, message)) return;
  // check if subject is testimonial
  subject = subject.trim();
  if (subject.toLowerCase() === 'testimonial') {
    createTestimonialObj(name, message);
  }
  clearFields(nameField, emailField, subjectField, textArea);
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

const createTestimonialObj = (userName, desc) => {
  let obj = {
    name: userName,
    message: desc,
  };
  postDataToDb(obj, 'testimonials');
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
