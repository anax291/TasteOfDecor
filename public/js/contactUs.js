import {
  validateName,
  validateEmail,
  validateSubject,
  validateMessage,
  postTestimonailToDb,
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
  console.log(132);
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
  postTestimonailToDb(obj);
};

/* Intro js */
introJs()
  .setOptions({
    steps: [
      {
        element: subjectField,
        intro: `
          <h2>Want to post a review for us???</h2>
          <br>
          <p> Make "testimonial" the subject of your form and then submit</p>
          <br>
          <p> Like this </p>
          <br>
          <input style="padding: 0.5rem 1rem" type="text" value="Testimonial">
          <br>
          <h3>Thank You </h3>
      `,
      },
    ],
  })
  .start();
