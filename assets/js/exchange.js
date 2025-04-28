document.addEventListener('DOMContentLoaded', () => {
  const amountInput   = document.getElementById('amount');
  const fromSelect    = document.getElementById('from-currency');
  const toSelect      = document.getElementById('to-currency');
  const convertButton = document.getElementById('convert');
  const swapButton    = document.getElementById('swap');
  const loadingDiv    = document.getElementById('loading');
  const resultDiv     = document.getElementById('result');

  amountInput.addEventListener('input', () => {
    let v = amountInput.value.replace(/,/g, '');
    if (!isNaN(v) && v !== '') {
      amountInput.value = Number(v).toLocaleString();
    }
  });

  amountInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      convertCurrency();
    }
  });

  async function fetchWithProxy(url) {
    const proxy = 'https://api.allorigins.win/raw?url=';
    return fetch(proxy + encodeURIComponent(url))
      .then(res => {
        if (!res.ok) throw new Error('Proxy error: ' + res.status);
        return res.json();
      });
  }

  async function loadCurrencies() {
    try {
      const data = await fetchWithProxy('https://api.exchangerate.host/symbols');
      const symbols = data.symbols;
      fromSelect.innerHTML = '';
      toSelect.innerHTML   = '';
      for (const code of Object.keys(symbols)) {
        const desc = symbols[code].description;
        fromSelect.add(new Option(`${code} — ${desc}`, code));
        toSelect.add(new Option(`${code} — ${desc}`, code));
      }
      fromSelect.value = 'USD';
      toSelect.value   = 'KRW';
    } catch (err) {
      console.error('Load currencies failed:', err);
      resultDiv.textContent = '통화 목록 불러오기 실패';
    }
  }

  swapButton.addEventListener('click', () => {
    [fromSelect.value, toSelect.value] = [toSelect.value, fromSelect.value];
  });

  async function convertCurrency() {
    const raw    = amountInput.value.replace(/,/g, '');
    const amount = parseFloat(raw);
    if (isNaN(amount) || amount <= 0) {
      alert('올바른 금액을 입력하세요.');
      return;
    }
    loadingDiv.style.display = 'block';
    resultDiv.textContent    = '';
    try {
      const data = await fetchWithProxy(`https://api.exchangerate.host/convert?from=${fromSelect.value}&to=${toSelect.value}&amount=${amount}`);
      if (data.result != null) {
        const formatted = Number(data.result).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        resultDiv.textContent = `${amount.toLocaleString()} ${fromSelect.value} → ${formatted} ${toSelect.value}`;
      } else {
        throw new Error('No result');
      }
    } catch (err) {
      console.error('Convert currency failed:', err);
      resultDiv.textContent = '변환 실패. 네트워크를 확인하세요.';
    } finally {
      loadingDiv.style.display = 'none';
    }
  }

  convertButton.addEventListener('click', convertCurrency);

  loadCurrencies();
});
