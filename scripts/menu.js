const menuBtn = document.querySelector('.menu-btn');
const sideNav = document.querySelector('.side-nav');
const overlay = document.querySelector('.side-nav-overlay');

menuBtn.addEventListener('click', () => {
  sideNav.classList.toggle('active');
  overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
  sideNav.classList.remove('active');
  overlay.classList.remove('active');
});
