// assets/js/ip.js

let map, marker;

function initMap() {
  if (typeof L === 'undefined') return;
  map = L.map('map').setView([37.5665, 126.9780], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  marker = L.marker([37.5665, 126.9780]).addTo(map);
}

async function lookupIP(ip) {
  const token = '353ab7e1d08969';
  const url = ip
    ? `https://ipinfo.io/${ip}/json?token=${token}`
    : `https://ipinfo.io/json?token=${token}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.statusText);
    const d = await res.json();
    const loc = d.loc ? d.loc.split(',') : null;

    document.getElementById('infoBox').style.display = 'block';
    document.getElementById('ipAddr').textContent = d.ip || '-';
    document.getElementById('location').textContent =
      d.country && d.region && d.city
        ? `${d.country}, ${d.region}, ${d.city}`
        : '-';
    document.getElementById('isp').textContent = d.org || '-';
    document.getElementById('coords').textContent =
      loc
        ? `${parseFloat(loc[0]).toFixed(5)}, ${parseFloat(loc[1]).toFixed(5)}`
        : '-';
    document.getElementById('device').textContent = detectDevice();

    if (marker && loc) {
      marker.setLatLng([+loc[0], +loc[1]]);
      map.setView([+loc[0], +loc[1]], 13);
    }
  } catch (err) {
    alert('조회 실패: ' + err.message);
  }
}

function detectDevice() {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('android')) return '모바일(Android)';
  if (ua.includes('iphone') || ua.includes('ipad')) return '모바일(iOS)';
  if (ua.includes('windows')) return 'PC(Windows)';
  if (ua.includes('macintosh')) return 'PC(Mac)';
  return '알 수 없음';
}

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  document.getElementById('btnLookup').addEventListener('click', () => {
    lookupIP(document.getElementById('ipInput').value.trim());
  });
  document.getElementById('btnMyIP').addEventListener('click', () => {
    lookupIP('');
  });
  document.getElementById('ipInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      lookupIP(e.target.value.trim());
    }
  });
});