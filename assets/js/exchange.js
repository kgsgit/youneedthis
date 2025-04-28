// assets/js/exchange.js
document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = 'https://open.er-api.com/v6/latest';
  const fromSelect = document.getElementById('from-currency');
  const toSelect   = document.getElementById('to-currency');
  const fromAmt    = document.getElementById('from-amount');
  const toAmt      = document.getElementById('to-amount');
  const toUnit     = document.getElementById('to-unit');
  const flagFrom   = document.getElementById('flag-from');
  const flagTo     = document.getElementById('flag-to');

  // 한국어 지역명 반환을 위한 Intl.DisplayNames
  const regionNames = new Intl.DisplayNames(['ko'], { type: 'region' });

  // 국기 URL 생성
  const flagURL = code =>
    `https://flagcdn.com/${code.toLowerCase().slice(0,2)}.svg`;

  // 1) 셀렉트 박스에 통화 코드+국가명 채우기
  async function loadSymbols() {
    console.log('환율 심볼 로드 →', `${API_BASE}/USD`);
    try {
      const res  = await fetch(`${API_BASE}/USD`);
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      const codes = Object.keys(data.rates);

      fromSelect.innerHTML = '';
      toSelect.innerHTML   = '';
      for (let code of codes) {
        const countryCode = code.slice(0,2);
        const countryName = regionNames.of(countryCode) || countryCode;
        const txt = `${code} — ${countryName}`;
        const option1 = document.createElement('option');
        option1.value = code;
        option1.text  = txt;
        const option2 = option1.cloneNode(true);

        fromSelect.append(option1);
        toSelect.append(option2);
      }

      // 기본값 세팅
      fromSelect.value = 'USD';
      toSelect.value   = 'KRW';
      flagFrom.src = flagURL('USD');
      flagTo.src   = flagURL('KRW');
      calculate();

    } catch (e) {
      console.error('symbols 로드 실패 →', e);
    }
  }

  // 2) 기준통화(from)에 맞춰 환율 계산
  async function calculate() {
    const from = fromSelect.value;
    const to   = toSelect.value;
    const amt  = parseFloat(fromAmt.value) || 0;
    console.log(`계산 → ${amt} ${from}→${to}`);
    try {
      const res  = await fetch(`${API_BASE}/${from}`);
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      const rate = data.rates[to];
      if (typeof rate !== 'number') throw new Error('rate 누락');

      toAmt.textContent  = (amt * rate).toFixed(2);
      toUnit.textContent = to;
    } catch (e) {
      console.error('환율 계산 실패 →', e);
      toAmt.textContent = '-';
      toUnit.textContent = '';
    }
  }

  // 3) 이벤트 바인딩
  fromSelect.addEventListener('change', () => {
    flagFrom.src = flagURL(fromSelect.value);
    calculate();
  });
  toSelect.addEventListener('change', () => {
    flagTo.src = flagURL(toSelect.value);
    calculate();
  });
  fromAmt.addEventListener('input', calculate);

  // 4) 초기 실행
  loadSymbols();
});
