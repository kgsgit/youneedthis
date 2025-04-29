// 불용어(간단한 한국어/영어 혼합)
const STOP_WORDS = [
  "이", "그", "저", "의", "가", "을", "를", "는", "도", "에", "으로", "에서",
  "the", "and", "is", "in", "at", "of", "to", "a", "for", "on", "that", "this"
];

// 문장 단위로 잘라내기
function splitSentences(text) {
  return text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
}

// 단어 빈도 계산
function computeWordFreq(text) {
  const freq = {};
  text
    .toLowerCase()
    .replace(/[\r\n]+/g, " ")
    .split(/[\s\.,!?;:"'()]+/)
    .forEach(word => {
      if (word && !STOP_WORDS.includes(word)) {
        freq[word] = (freq[word] || 0) + 1;
      }
    });
  return freq;
}

// 요약: 상위 N개 문장 선택
function summarizeText(text, maxSentences = 5) {
  const sentences = splitSentences(text);
  const wordFreq = computeWordFreq(text);

  const scored = sentences.map(s => {
    const words = s
      .toLowerCase()
      .replace(/[\r\n]+/g, " ")
      .split(/[\s\.,!?;:"'()]+/);
    let score = 0;
    words.forEach(w => {
      if (wordFreq[w]) score += wordFreq[w];
    });
    return { sentence: s.trim(), score };
  });

  // 점수 내림차순 정렬 후 상위 maxSentences 선택
  const selected = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences)
    .map(item => item.sentence);

  return selected.join(" ");
}


// 버튼 클릭 이벤트
document.getElementById("summarizeBtn").addEventListener("click", () => {
  const input = document.getElementById("inputText").value.trim();
  const output = document.getElementById("outputText");

  if (!input) {
    output.innerText = "요약할 텍스트를 입력해주세요.";
    return;
  }

  output.innerText = "요약 중…";
  setTimeout(() => {
    const result = summarizeText(input, 5);
    output.innerText = result || "요약할 수 있는 내용이 부족합니다.";
  }, 100);  // 잠깐 대기
});
