const faqs = [
  {
    question: 'How do I choose between the many interior design styles?',
    answer: {
      p: 'During your initial consultation with an interior designer, you will discuss your likes and dislikes. This will help narrow the field. Photos are also helpful in choosing an ultimate design. How you want to furnish the space, as well as how it will be used can make a difference in style selection.',
    },
  },
  {
    question: 'What should I look for when interviewing interior designers?',
    answer: {
      p: 'You want to see a variety of before and after photos from various projects. If your prospective interior designer does not have any pictures of a completed bathroom, for example, you may want to speak to someone else with experience and photos to show you if that is the room you are redesigning.',
    },
  },
  {
    question: 'What interior design services should I expect from my designer?',
    answer: {
      p: 'Your interior designer will provide many services, including but not limited to:',
      lis: [
        'PDF presentations',
        'Color selections',
        'Lighting designs',
        'General inspiration',
        'Furniture selection',
        'Product research',
        'Floor planning',
        'Product and cost comparisons',
        'Flooring selections',
        'Wall and window treatments',
        'Lifestyle requirements',
        'Budget',
        'Accessories',
      ],
    },
  },
  {
    question: 'Can I afford interior design help from a professional?',
    answer: {
      p: 'You can often save money by hiring an interior designer. Industry professionals have access to discounts from multiple businesses that they can pass on to their clients. Also, you can avoid costly mistakes and purchases by utilizing a designer’s professional services up front, rather than during a redo of a space that did not suit your needs or desires.',
    },
  },
  {
    question:
      ' Is it worth it to get interior design advice and services for a small living space?',
    answer: {
      p: 'An interior designer knows how to use furnishings, colors, and art to make a small space look larger. A strategically placed mirror or light colors of paint can do wonders for increasing visual depth. Additionally, breaking a long narrow room into different seating areas can add dimension. You will be amazed at how well the right interior design can turn your small living space into a functional and homey environment.',
    },
  },
  {
    question:
      ' When you design a room, what is the most important interior design advice you give?',
    answer: {
      p: 'Think about the primary use of the room, and who will see it. Your bedroom is your haven and should be inviting to you. A living room or dining room that will be seen by many people is where you may want to make a statement. How do you need the room to function for you? People who have very little storage space may want to incorporate pieces of furniture that double as storage spaces. In an open environment, it is essential to have an interior design that flows from one room to the next.',
    },
  },
  {
    question: 'What is the most important factor when designing a room?',
    answer: {
      p: 'Having a clear vision of what you want is essential. If you are not sure, the services of the interior designer can be priceless. Before you go out and start buying pieces of furniture and artwork that do not mix, get help narrowing down your design and theme. Some colors compliment while others clash. You want your living space to reflect your personality and be functional and inviting at the same time.',
    },
  },
  {
    question: 'How do I decide between wood, tile, carpet, and other flooring options?',
    answer: {
      p: 'An in-depth consultation with an interior designer about your desires, goals, and lifestyle will yield important answers.  As a result, you will be able to determine what flooring, wallcoverings, window treatments, and furnishings will best suit your needs.',
    },
  },
  {
    question: 'What questions should I expect an interior designer to ask?',
    answer: {
      p: 'Here are some of the common questions interior designer may ask you:',
      lis: [
        'What is your budget?',
        'Have you ever worked with an interior designer before?',
        'What design style do you like or have in mind?',
        'Will you want to remain in the home during the design?',
        'Is there anything you absolutely do not like?',
        'What is your timeframe?',
      ],
    },
  },
];

/* Populate Accordions */

const faqContainer = document.querySelector('.faqs');

const populateAccordions = () => {
  const template = document.getElementById('faq-template');
  faqs.forEach((faq, index) => {
    const faqItem = template.content.firstElementChild.cloneNode(true);
    const question = faqItem.querySelector('.faq-item__btn span');
    const content = faqItem.querySelector('.faq-item__content');
    question.textContent = faq.question;
    const p = document.createElement('p');
    p.textContent = faq.answer.p;
    content.appendChild(p);
    if (faq.answer.lis) {
      const ul = document.createElement('ul');
      faq.answer.lis.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });
      content.appendChild(ul);
    }
    faqContainer.appendChild(faqItem);
  });
};

populateAccordions();

/* Accordion Open Close Functionality */
faqContainer.addEventListener('click', (e) => {
  const target = e.target.closest('.faq-item__btn');
  if (!target) return;
  const content = target.nextElementSibling;
  if (target.classList.contains('active')) {
    // when accordion is open
    target.classList.remove('active');
    content.style.maxHeight = null;
  } else {
    // when accordion is closed
    target.classList.add('active');
    content.style.maxHeight = `${content.scrollHeight}px`;
  }
});
