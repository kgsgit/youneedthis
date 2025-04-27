const menuToggle = document.getElementById('menu-toggle');
const navUl = document.querySelector('.nav ul');

menuToggle.addEventListener('click', () => {
  navUl.classList.toggle('show');
});
