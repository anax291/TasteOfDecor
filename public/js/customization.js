const products = document.querySelectorAll('.prod');
products.forEach((prod) => dragElement(prod));

function dragElement(terrariumElement) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  terrariumElement.onpointerdown = pointerDrag;

  function pointerDrag(e) {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;

    document.onpointermove = elementDrag;
    document.onpointerup = stopElementDrag;
  }

  function elementDrag(e) {
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    terrariumElement.style.position = 'absolute';
    terrariumElement.style.top = terrariumElement.offsetTop - pos2 + 'px';
    terrariumElement.style.left = terrariumElement.offsetLeft - pos1 + 'px';
  }

  function stopElementDrag() {
    document.onpointerup = null;
    document.onpointermove = null;
  }
}

/* Populate products with selected category */

products.forEach((prod) => {
  prod.addEventListener('dblclick', (e) => {
    let x = prod.style.left;
    let y = prod.style.top;
    
  });
});
