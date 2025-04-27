// assets/js/convert.js
const initialConsonants = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'];
const vowels            = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];
const finalConsonants   = ['','k','k','ks','n','nj','nh','t','l','lk','lm','lp','ls','lt','lp','lh','m','p','ps','t','t','ng','t','t','k','t','p','t'];

function decomposeHangul(s) {
  const code = s.charCodeAt(0) - 0xAC00;
  if (code<0||code>11171) return [s];
  const i = Math.floor(code/(21*28)), v = Math.floor((code%(21*28))/28), f = code%28;
  return [initialConsonants[i], vowels[v], finalConsonants[f]];
}
function capitalize(str){ return str? str.charAt(0).toUpperCase()+str.slice(1):''; }

function romanize(name, mode='official') {
  if (!name) return '';
  let first = name[0], res = '';
  if (mode==='common') {
    if      (first==='김'){ res='Kim'; name=name.slice(1); }
    else if (first==='박'){ res='Park';name=name.slice(1); }
    else if (first==='이'){ res='Lee'; name=name.slice(1); }
    else if (first==='최'){ res='Choi';name=name.slice(1);}
    else if (first==='정'){ res='Jung';name=name.slice(1);}
  } else {
    if      (first==='이'){ res='I';   name=name.slice(1); }
    else if (first==='박'){ res='Bak'; name=name.slice(1); }
    else if (first==='최'){ res='Choe';name=name.slice(1); }
    else if (first==='정'){ res='Jeong';name=name.slice(1);}
    else if (first==='김'){ res='Gim'; name=name.slice(1); }
  }
  for (let ch of name) {
    const parts = decomposeHangul(ch);
    if (parts.length===1) res+=parts[0];
    else {
      const [i,v,f] = parts;
      res += i+v+f;
    }
  }
  return capitalize(res);
}

const inp    = document.getElementById('koreanNameInput');
const btn    = document.getElementById('convertButton');
const common = document.getElementById('commonResult');
const offi   = document.getElementById('officialResult');
const wrap   = document.getElementById('resultWrapper');
const copy   = document.getElementById('copyButton');

function convertName(){
  const nm = inp.value.trim();
  if (!nm) return;
  common.textContent  = romanize(nm,'common');
  offi.textContent    = romanize(nm,'official');
  wrap.style.display  = 'flex';
}

btn.addEventListener('click', convertName);
inp.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); convertName(); } });
copy.addEventListener('click', ()=>{
  navigator.clipboard.writeText(common.textContent)
    .then(()=>alert('관습 표기가 복사되었습니다!'))
    .catch(()=>alert('복사 실패!'));
});
