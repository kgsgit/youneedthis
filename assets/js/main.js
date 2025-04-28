// assets/js/main.js

// 공통 컴포넌트 삽입 로직
async function includeHTML() {
  const parts = [
    { id: 'header-placeholder', url: '/header.html' },
    { id: 'ads-placeholder',    url: '/ads-slot.html' },
    { id: 'footer-placeholder', url: '/footer.html' }
  ];
  for (const {id, url} of parts) {
    const el = document.getElementById(id);
    if (!el) continue;
    try {
      const res = await fetch(url);
      if (res.ok) el.innerHTML = await res.text();
    } catch (e) {
      console.error(`Include ${url} failed:`, e);
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // 공통 컴포넌트 로드
  await includeHTML();

  // 메뉴 토글 기능
  const menuToggle = document.getElementById('menu-toggle');
  const navList    = document.querySelector('.nav ul');
  if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => navList.classList.toggle('show'));
    document.addEventListener('click', e => {
      if (!navList.contains(e.target) && e.target !== menuToggle) {
        navList.classList.remove('show');
      }
    });
  }
});
