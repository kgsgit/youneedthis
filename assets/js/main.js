// assets/js/main.js

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const navList    = document.querySelector('nav.nav ul');

  if (!menuToggle || !navList) return;

  menuToggle.addEventListener('click', () => {
    navList.classList.toggle('show');
    console.log('hamburger clicked, show=', navList.classList.contains('show'));
  });
});
