const animatables = document.querySelectorAll('[data-animation-name]');
animatables.forEach((animatable) => (animatable.style.opacity = '0'));
const observer = new IntersectionObserver(
  function (entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const animName = entry.target.dataset.animationName;
        const animDuration = entry.target.dataset.animationDuration || '2000ms';
        const animDelay = entry.target.dataset.animationDelay || '10ms';
        entry.target.style.animation = `${animName} ${animDuration} ease ${animDelay} forwards`;
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);
animatables.forEach((anim) => {
  observer.observe(anim);
});
