// assets/js/exchange.js
document.addEventListener('DOMContentLoaded', () => {
  const API = 'https://api.exchangerate.host';
  const proxyUrl = url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  const fromSelect = document.getElementById('from-currency');
  const toSelect   = document.getElementById('to-currency');
  const fromAmt    = document.getElementById('from-amount');
  const toAmt      = document.getElementById('to-amount');
  const toUnit     = document.getElementById('to-unit');
  const flagFrom   = document.getElementById('flag-from');
  const flagTo     = document.getElementById('flag-to');

  const flagURL = code => `https://flagcdn.com/${code.toLowerCase()}.svg`;

  async function fetchJSON(url) {
    const res = await fetch(proxyUrl(url));
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  }

  async function loadSymbols() {
    try {
      const data = await fetchJSON(`${API}/symbols`);
      for (const [code, { description }] of Object.entries(data.symbols)) {
        fromSelect.add(new Option(`${description} (${code})`, code));
        toSelect.add(new Option(`${description} (${code})`, code));
      }
      fromSelect.value = 'USD';
      toSelect.value   = 'KRW';
      flagFrom.src     = flagURL('US');
      flagTo.src       = flagURL('KR');
      calculate();
    } catch (e) {
      console.error(e);
      toAmt.textContent = '로드 실패';
      toUnit.textContent = '';
    }
  }

  async function calculate() {
    const from = fromSelect.value;
    const to   = toSelect.value;
    const amt  = parseFloat(fromAmt.value) || 0;
    if (amt <= 0) {
      toAmt.textContent = '-';
      toUnit.textContent = '';
      return;
    }
    toAmt.textContent = '⏳';
    try {
      const data = await fetchJSON(`${API}/convert?from=${from}&to=${to}&amount=${amt}`);
      if (data.result == null) throw new Error('No result');
      const formatted = Number(data.result).toLocaleString(undefined, { maximumFractionDigits: 2 });
      toAmt.textContent = formatted;
      toUnit.textContent = to;
    } catch (e) {
      console.error(e);
      toAmt.textContent = '오류';
      toUnit.textContent = '';
    }
  }

  fromSelect.addEventListener('change', () => {
    flagFrom.src = flagURL(fromSelect.value.slice(0, 2));
    calculate();
  });
  toSelect.addEventListener('change', () => {
    flagTo.src = flagURL(toSelect.value.slice(0, 2));
    calculate();
  });
  fromAmt.addEventListener('input', calculate);

  loadSymbols();
});
