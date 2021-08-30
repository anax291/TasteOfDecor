const draggables = document.querySelectorAll('.draggable');
const rooms = document.querySelectorAll('.room');
const sideBars = document.querySelectorAll(
  '.left-container .prods, .right-container .prods'
);

draggables.forEach((draggable) => {
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add('dragging');
  });
  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging');
  });
});
rooms.forEach((room) => {
  room.addEventListener('dragover', (e) => {
    const draggingElement = document.querySelector('.dragging');
    let x = e.clientX - room.getBoundingClientRect().x;
    let y = e.clientY - room.getBoundingClientRect().y;
    draggingElement.style.left = `${x}px`;
    draggingElement.style.top = `${y}px`;
    room.appendChild(draggingElement);
  });
});

// back to sidebars
sideBars.forEach((side) => {
  side.addEventListener('dragover', () => {
    const dragging = document.querySelector('.dragging');
    side.appendChild(dragging);
  });
});

rooms.forEach((room) => {
  room.addEventListener('dblclick', (e) => {
    const target = e.target.closest('img');
    if (!target) return;
    target.classList.add('active');
    displayCustomizationBox(target);
    customizationInteractivity(target);
  });
});

const displayCustomizationBox = async (target) => {
  const template = document.getElementById('customization');
  const customizationDiv = template.content.firstElementChild.cloneNode(true);
  customizationDiv.querySelector('#width').value = window
    .getComputedStyle(target)
    .width.replace('px', '');
  customizationDiv.querySelector('#height').value = window
    .getComputedStyle(target)
    .height.replace('px', '');
  let temp = target.style.transform;
  if (temp) temp = temp.slice(7, temp.length - 4);
  customizationDiv.querySelector('#rotate').value = temp || 0;
  document.body.appendChild(customizationDiv);
};

const customizationInteractivity = (img) => {
  const widthElement = document.getElementById('width');
  const heightElement = document.getElementById('height');
  const degElement = document.getElementById('rotate');
  const reduceZindex = document.getElementById('reduce-z-index');
  const increaseZindex = document.getElementById('increase-z-index');
  const closeBtn = document.querySelector('.cta-close');

  widthElement.addEventListener('change', (e) => {
    changeWidth(img, e.target.value);
  });

  widthElement.addEventListener('keyup', (e) => {
    changeWidth(img, e.target.value);
  });

  heightElement.addEventListener('change', (e) => {
    changeHeight(img, e.target.value);
  });

  heightElement.addEventListener('keyup', (e) => {
    changeHeight(img, e.target.value);
  });

  degElement.addEventListener('change', (e) => {
    rotateImg(img, e.target.value);
  });

  degElement.addEventListener('keyup', (e) => {
    rotateImg(img, e.target.value);
  });

  reduceZindex.addEventListener('click', () => {
    changeZindex(img, false);
  });
  increaseZindex.addEventListener('click', () => {
    changeZindex(img, true);
  });

  closeBtn.addEventListener('click', () => {
    closeCustomizationBox(img);
  });
};

const changeWidth = (img, width) => {
  img.style.width = `${width}px`;
};

const changeHeight = (img, height) => {
  img.style.width = `${height}px`;
};
const rotateImg = (img, deg) => {
  img.style.transform = `rotate(${deg}deg)`;
};

const changeZindex = (img, bool) => {
  const oldZindex = parseInt(window.getComputedStyle(img).zIndex);
  const newZindex = bool ? oldZindex + 1 : oldZindex - 1;
  img.style.zIndex = `${newZindex}`;
};

const closeCustomizationBox = (img) => {
  img.classList.remove('active');
  const customizationDiv = document.querySelector('.customization-box');
  document.body.removeChild(customizationDiv);
};
