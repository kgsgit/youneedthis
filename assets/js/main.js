const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('active');
});

// 바깥 영역 클릭시 메뉴 닫기
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && e.target !== menuToggle) {
    nav.classList.remove('active');
  }
});