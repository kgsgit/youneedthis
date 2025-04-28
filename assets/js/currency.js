// assets/js/currency.js
document.addEventListener('DOMContentLoaded', () => {
    const fromSelect   = document.getElementById('from-currency');
    const toSelect     = document.getElementById('to-currency');
    const fromAmount   = document.getElementById('from-amount');
    const toAmount     = document.getElementById('to-amount');
    const toUnit       = document.getElementById('to-currency-unit');
    const flagFromImg  = document.getElementById('flag-from');
    const flagToImg    = document.getElementById('flag-to');
    const API_BASE     = 'https://api.exchangerate.host';
  
    // 국가 코드를 이용해 국가별 국기 SVG URL 생성
    const flagURL = code => `https://flagcdn.com/${code.toLowerCase()}.svg`;
  
    // 통화 목록 로드
    async function loadCurrencies() {
      try {
        const res = await fetch(`${API_BASE}/symbols`);
        if (!res.ok) throw new Error('심볼 로딩 실패');
        const data = await res.json();
        const symbols = data.symbols;
        for (let [code, { description }] of Object.entries(symbols)) {
          const text = `${description} (${code})`;
          fromSelect.add(new Option(text, code));
          toSelect.add(new Option(text, code));
        }
        // 기본값 USD → KRW
        fromSelect.value = 'USD';
        toSelect.value   = 'KRW';
        flagFromImg.src  = flagURL('US');
        flagToImg.src    = flagURL('KR');
        calculate();  // 첫 계산
      } catch (err) {
        toAmount.textContent = '로드 실패';
        toUnit.textContent   = '';
        console.error(err);
      }
    }
  
    // 환율 계산
    async function calculate() {
      const from = fromSelect.value;
      const to   = toSelect.value;
      const amount = parseFloat(fromAmount.value) || 0;
      if (amount <= 0) {
        toAmount.textContent = '-';
        toUnit.textContent   = '';
        return;
      }
      toAmount.textContent = '⏳';
      try {
        const res = await fetch(`${API_BASE}/convert?from=${from}&to=${to}&amount=${amount}`);
        if (!res.ok) throw new Error('환율 조회 실패');
        const data = await res.json();
        const result = data.result;
        const formatted = Number(result).toLocaleString(undefined, { maximumFractionDigits: 2 });
        toAmount.textContent = formatted;
        toUnit.textContent   = to;
      } catch (err) {
        toAmount.textContent = '오류';
        toUnit.textContent   = '';
        console.error(err);
      }
    }
  
    // 이벤트 바인딩
    fromSelect.addEventListener('change', () => {
      const code = fromSelect.value.slice(0,2);
      flagFromImg.src = flagURL(code);
      calculate();
    });
    toSelect.addEventListener('change', () => {
      const code = toSelect.value.slice(0,2);
      flagToImg.src = flagURL(code);
      calculate();
    });
    fromAmount.addEventListener('input', calculate);
  
    // 초기 로드
    loadCurrencies();
  });
  