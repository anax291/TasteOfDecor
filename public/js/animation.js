const animatables = document.querySelectorAll('[data-animation-name]');
animatables.forEach((animatable) => (animatable.style.opacity = '0'));
const observer = new IntersectionObserver(
  function (entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const animName = entry.target.dataset.animationName;
        const animDuration = entry.target.dataset.animationDuration;
        const animDelay = entry.target.dataset.animationDelay || '10ms';
        entry.target.style.animation = `${animName} 2000ms ease ${animDelay} forwards`;
        console.log(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);
animatables.forEach((anim) => {
  observer.observe(anim);
});
