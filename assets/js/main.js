const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  nav.querySelector('ul').classList.toggle('show');
});

// 화면 다른 곳 클릭하면 닫기
document.addEventListener('click', (e) => {
  const isClickInside = nav.contains(e.target) || menuToggle.contains(e.target);
  if (!isClickInside) {
    nav.querySelector('ul').classList.remove('show');
  }
});
