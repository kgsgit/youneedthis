// assets/js/vat.js
document.addEventListener('DOMContentLoaded', () => {
  function addEnterKey(input, btn) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); btn.click(); }
    });
  }

  const totalInput = document.getElementById('totalInput');
  const calcTotal  = document.getElementById('calculateTotalButton');
  const resetTotal = document.getElementById('resetTotalButton');
  const supplyRes  = document.getElementById('supplyResult');
  const vatRes     = document.getElementById('vatResult');

  addEnterKey(totalInput, calcTotal);
  calcTotal.addEventListener('click', () => {
    const v = parseFloat(totalInput.value.replace(/,/g,'')) || 0;
    if (v > 0) {
      const s = Math.round(v/1.1), t = v - s;
      supplyRes.textContent = s.toLocaleString();
      vatRes.textContent    = t.toLocaleString();
    }
  });
  resetTotal.addEventListener('click', () => {
    totalInput.value = ''; supplyRes.textContent = '-'; vatRes.textContent = '-';
  });

  const supplyInput = document.getElementById('supplyInput');
  const calcSupply  = document.getElementById('calculateSupplyButton');
  const resetSupply = document.getElementById('resetSupplyButton');
  const totalRes    = document.getElementById('totalResult');
  const vatSupply   = document.getElementById('vatSupplyResult');

  addEnterKey(supplyInput, calcSupply);
  calcSupply.addEventListener('click', () => {
    const v = parseFloat(supplyInput.value.replace(/,/g,'')) || 0;
    if (v > 0) {
      const t = Math.round(v*1.1), u = t - v;
      totalRes.textContent  = t.toLocaleString();
      vatSupply.textContent = u.toLocaleString();
    }
  });
  resetSupply.addEventListener('click', () => {
    supplyInput.value = ''; totalRes.textContent = '-'; vatSupply.textContent = '-';
  });
});
