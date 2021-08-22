const track = document.querySelector('.carousel__track');
const slides = Array.from(track.children);
const nextBtn = document.querySelector('.carousel__btn--right');
const prevBtn = document.querySelector('.carousel__btn--left');
const dotsNav = document.querySelector('.carousel__nav');
const dots = Array.from(dotsNav.children);

window.addEventListener('resize', function () {
  // track size to know how much to move
  const slideWidth = slides[0].getBoundingClientRect().width;

  // arrange the slides next to one another
  slides.forEach((slide, index) => {
    slide.style.left = slideWidth * index + 'px';
  });
});
document.addEventListener('DOMContentLoaded', function () {
  const slideWidth = slides[0].getBoundingClientRect().width;
  slides.forEach((slide, index) => {
    slide.style.left = slideWidth * index + 'px';
  });
  if (document.hasFocus) {
    setInterval(moveToNextSlide, 6000);
  }
});

//when click left, move slides to left.
prevBtn.addEventListener('click', (e) => {
  const currentSlide = track.querySelector('.current-slide');
  const prevSlide =
    currentSlide.previousElementSibling || slides[slides.length - 1];
  const currentDot = dotsNav.querySelector('.current-slide');
  const prevDot = currentDot.previousElementSibling || dots[dots.length - 1];
  moveToSlide(track, currentSlide, prevSlide);
  updateDots(currentDot, prevDot);
});

// wheni click right, move slides to right.
nextBtn.addEventListener('click', (e) => {
  const currentSlide = track.querySelector('.current-slide');
  const nextSlide = currentSlide.nextElementSibling || slides[0];
  const currentDot = dotsNav.querySelector('.current-slide');
  const nextDot = currentDot.nextElementSibling || dots[0];
  moveToSlide(track, currentSlide, nextSlide);
  updateDots(currentDot, nextDot);
});

// when i click nav indicator, move to that slide
dotsNav.addEventListener('click', (e) => {
  const targetDot = e.target.closest('button');
  if (!targetDot) return;
  const currentSlide = track.querySelector('.current-slide');
  const currentDot = dotsNav.querySelector('.current-slide');
  const targetIndex = dots.findIndex((dot) => dot === targetDot);
  const targetSlide = slides[targetIndex];
  moveToSlide(track, currentSlide, targetSlide);
  updateDots(currentDot, targetDot);
});

// function to move carousel
const moveToSlide = (track, currentSlide, targetSlide) => {
  track.style.transform = `translateX(-${targetSlide.style.left})`;
  currentSlide.classList.remove('current-slide');
  targetSlide.classList.add('current-slide');
};
// function to update Dots
const updateDots = (currentDot, targetDot) => {
  currentDot.classList.remove('current-slide');
  targetDot.classList.add('current-slide');
};
// funtion to move to next slide
const moveToNextSlide = () => {
  const currentSlide = track.querySelector('.current-slide');
  const nextSlide = currentSlide.nextElementSibling || slides[0];
  const currentDot = dotsNav.querySelector('.current-slide');
  const nextDot = currentDot.nextElementSibling || dots[0];
  moveToSlide(track, currentSlide, nextSlide);
  updateDots(currentDot, nextDot);
};
