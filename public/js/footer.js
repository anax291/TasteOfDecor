const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.3/css/all.css"
    integrity="sha384-SZXxX4whJ79/gErwcOYf+zWLeJdY/qpuqC4cAa9rOGUstPomtqpuNWT9wdPEn2fk" crossorigin="anonymous">
  <link rel="stylesheet" href="./css/footer.css">
  <footer class="footer">
    <div class="cursor" id="cursor"></div>
    <div class="container">
      <div class="grid">
        <div class="col col1">
          <h1 class="name">Taste Of Decor</h1>
          <p>We create possibilities for the connected world.</p>
          <p class="tagline">Be Bold</p>
        </div>
        <div class="col col2">
          <h3 class="col-title">Explore</h3>
          <a href="#" class="wrap">
            <div class="inner">
              <div class="top">Home</div>
              <div class="bottom">Home</div>
            </div>
          </a>
          <a href="#" class="wrap">
            <div class="inner">
              <div class="top">About</div>
              <div class="bottom">About</div>
            </div>
          </a>
          <a href="#" class="wrap">
            <div class="inner">
              <div class="top">Capabilities</div>
              <div class="bottom">Capabilities</div>
            </div>
          </a>
          <a href="#" class="wrap">
            <div class="inner">
              <div class="top">Career</div>
              <div class="bottom">Career</div>
            </div>
          </a>
        </div>
        <div class="col col3">
          <h3 class="col-title">Visit</h3>
          <a href="#" class="wrap">
            <div class="inner">
              <div class="top">03333107559</div>
              <div class="bottom">03333107559</div>
            </div>
          </a>
          <a href="#" class="wrap">
            <div class="inner">
              <div class="top">support@tod.com</div>
              <div class="bottom">support@tod.com</div>
            </div>
          </a>
          <a href="#" class="wrap">
            <div class="inner">
              <div class="top">St.45/1 Italy</div>
              <div class="bottom">St.45/1 Italy</div>
            </div>
          </a>
        </div>
        <div class="col col4">
          <h3 class="col-title">Legal</h3>
          <a href="#" class="wrap">
            <div class="inner">
              <div class="top">Terms</div>
              <div class="bottom">Terms</div>
            </div>
          </a>
          <a href="#" class="wrap">
            <div class="inner">
              <div class="top">Policy</div>
              <div class="bottom">Policy</div>
            </div>
          </a>
          <a href="#" class="wrap">
            <div class="inner">
              <div class="top">Privacy</div>
              <div class="bottom">Privacy</div>
            </div>
          </a>
        </div>
      </div>
      <div class="social-links">
        <a href="#" class="icon facebook">
          <i class="fab fa-facebook-f"></i>
        </a>
        <a href="#" class="icon whatsapp">
          <i class="fab fa-whatsapp"></i>
        </a>
        <a href="#" class="icon instagram">
          <i class="fab fa-instagram"></i>
        </a>
        <a href="#" class="icon linkedin">
          <i class="fab fa-linkedin"></i>
        </a>
        <a href="#" class="icon youtube">
          <i class="fab fa-youtube"></i>
        </a>
        </div>
    </div>
  </footer>
`;

export class CustomFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  showCursor() {
    const cursor = this.shadowRoot.querySelector('#cursor');
    cursor.style.display = 'block';
  }

  hideCursor() {
    const cursor = this.shadowRoot.querySelector('#cursor');
    cursor.style.display = 'none';
  }

  updateCursorPosition(e) {
    const cursor = this.shadowRoot.querySelector('#cursor');
    cursor.style.left = e.pageX + 'px';
    cursor.style.top = e.pageY + 'px';
  }
  addClass() {
    const cursor = this.shadowRoot.querySelector('#cursor');
    if (!cursor.classList.contains('active')) {
      cursor.classList.add('active');
    }
  }
  removeClass() {
    const cursor = this.shadowRoot.querySelector('#cursor');
    cursor.classList.remove('active');
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector('.footer')
      .addEventListener('mousemove', (e) => {
        this.updateCursorPosition(e);
      });
    this.shadowRoot.querySelectorAll('.wrap').forEach((wrap) => {
      wrap.addEventListener('mouseenter', (e) => {
        this.addClass();
      });
    });
    this.shadowRoot.querySelectorAll('.wrap').forEach((wrap) => {
      wrap.addEventListener('mouseleave', (e) => {
        this.removeClass();
      });
    });
    this.shadowRoot
      .querySelector('.footer')
      .addEventListener('mouseleave', (e) => this.hideCursor());
    this.shadowRoot
      .querySelector('.footer')
      .addEventListener('mouseenter', (e) => this.showCursor());
  }
}

window.customElements.define('custom-footer', CustomFooter);