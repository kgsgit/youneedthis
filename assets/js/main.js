// assets/js/main.js

const menuToggle = document.getElementById('menu-toggle');
const navUl = document.querySelector('.nav ul');

menuToggle.addEventListener('click', e => {
  e.stopPropagation();
  navUl.classList.toggle('show');
});

document.addEventListener('click', e => {
  if (!navUl.contains(e.target) && e.target !== menuToggle) {
    navUl.classList.remove('show');
  }
});
