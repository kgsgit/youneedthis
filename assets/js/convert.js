const initialConsonants = [
    'g', 'kk', 'n', 'd', 'tt', 'r', 'm',
    'b', 'pp', 's', 'ss', '', 'j', 'jj',
    'ch', 'k', 't', 'p', 'h'
  ];
  
  const vowels = [
    'a', 'ae', 'ya', 'yae', 'eo', 'e',
    'yeo', 'ye', 'o', 'wa', 'wae', 'oe',
    'yo', 'u', 'wo', 'we', 'wi', 'yu',
    'eu', 'ui', 'i'
  ];
  
  const finalConsonants = [
    '', 'k', 'k', 'ks', 'n', 'nj', 'nh',
    't', 'l', 'lk', 'lm', 'lp', 'ls', 'lt', 'lp', 'lh',
    'm', 'p', 'ps', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 't'
  ];
  
  function decomposeHangul(syllable) {
    const code = syllable.charCodeAt(0) - 0xAC00;
    if (code < 0 || code > 11171) return [syllable];
  
    const initial = Math.floor(code / (21 * 28));
    const vowel = Math.floor((code % (21 * 28)) / 28);
    const final = code % 28;
  
    return [initialConsonants[initial], vowels[vowel], finalConsonants[final]];
  }
  
  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  function romanize(name, mode = 'official') {
    if (!name) return '';
  
    const firstChar = name[0];
    let result = '';
  
    if (mode === 'common') {
      if (firstChar === '김') { result = 'Kim'; name = name.slice(1); }
      else if (firstChar === '박') { result = 'Park'; name = name.slice(1); }
      else if (firstChar === '이') { result = 'Lee'; name = name.slice(1); }
      else if (firstChar === '최') { result = 'Choi'; name = name.slice(1); }
      else if (firstChar === '정') { result = 'Jung'; name = name.slice(1); }
    } else {
      if (firstChar === '이') { result = 'I'; name = name.slice(1); }
      else if (firstChar === '박') { result = 'Bak'; name = name.slice(1); }
      else if (firstChar === '최') { result = 'Choe'; name = name.slice(1); }
      else if (firstChar === '정') { result = 'Jeong'; name = name.slice(1); }
      else if (firstChar === '김') { result = 'Gim'; name = name.slice(1); }
    }
  
    for (const char of name) {
      const parts = decomposeHangul(char);
  
      if (parts.length === 1) {
        result += parts[0];
        continue;
      }
  
      let [initial, vowel, final] = parts;
      result += initial + vowel + final;
    }
  
    return capitalize(result);
  }
  
  // 연결
  const input = document.getElementById('koreanNameInput');
  const convertBtn = document.getElementById('convertButton');
  const commonResult = document.getElementById('commonResult');
  const officialResult = document.getElementById('officialResult');
  const resultWrapper = document.getElementById('resultWrapper');
  const copyBtn = document.getElementById('copyButton');
  
  function convertName() {
    const koreanName = input.value.trim();
    if (koreanName) {
      const common = romanize(koreanName, 'common');
      const official = romanize(koreanName, 'official');
      commonResult.textContent = common;
      officialResult.textContent = official;
      resultWrapper.style.display = 'flex';
    }
  }
  
  // 복사
  copyBtn.addEventListener('click', () => {
    const text = commonResult.textContent;
    navigator.clipboard.writeText(text)
      .then(() => alert('관습 표기가 복사되었습니다!'))
      .catch(() => alert('복사 실패!'));
  });
  
  // 변환 트리거
  convertBtn.addEventListener('click', convertName);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      convertName();
    }
  });
  