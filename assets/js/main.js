// assets/js/main.js

document.addEventListener('DOMContentLoaded', () => {
  // 메뉴 토글 기능
  const menuToggle = document.getElementById('menu-toggle');
  const navList    = document.querySelector('.nav ul');

  if (menuToggle && navList) {
    // 햄버거 클릭 시 메뉴 보이기/숨기기
    menuToggle.addEventListener('click', e => {
      e.stopPropagation();
      navList.classList.toggle('show');
    });
    // 바디 클릭 시 메뉴 닫기
    document.addEventListener('click', e => {
      if (!navList.contains(e.target) && e.target !== menuToggle) {
        navList.classList.remove('show');
      }
    });
  }
});
