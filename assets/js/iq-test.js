// — 문항 데이터 (20문항 예시, 이미지 경로는 .svg)
const questions = [
    { q:"1) 다음 수열의 빈칸에 들어갈 값은? 2, 5, 10, 17, 26, __",       a:["36","37","38","39"], c:2, w:3 },
    { q:"2) 도형 중 나머지 하나와 다른 유형 고르기",                img:"/assets/img/iq/matrix1.svg", a:["A","B","C","D"], c:3, w:4 },
    { q:"3) 단어유추: 새 : 짖다 = 소 : __",                           a:["울다","뛰다","먹다","날다"], c:0, w:2 },
    { q:"4) 패턴 추리: ◆■▲◆■▲__",                                    a:["◆","■","▲","◆"], c:0, w:1 },
    { q:"5) 3×3 매트릭스 빈칸 채우기",                               img:"/assets/img/iq/matrix2.svg", a:["A","B","C","D"], c:1, w:4 },
    { q:"6) 평균 속력: 120km를 1.5시간에 이동 시",                   a:["70km/h","80km/h","90km/h","100km/h"], c:2, w:2 },
    { q:"7) 3D 상자 회전 모양 일치 찾기",                            img:"/assets/img/iq/3dbox.svg",   a:["A","B","C","D"], c:1, w:4 },
    { q:"8) 피보나치 수열 다음 값: 1,1,2,3,5,8,__",                  a:["11","12","13","21"], c:3, w:3 },
    { q:"9) 논리 오류: '모든 포유류는 동물이다...고래는 물고기다.'", a:["전건 긍정","후건 긍정","전건 부정","후건 부정"], c:1, w:2 },
    { q:"10) 대칭 중심에 올 도형은?",                              img:"/assets/img/iq/symmetry.svg",a:["A","B","C","D"], c:2, w:4 },
    { q:"11) 3시 15분 시계바늘 각도는?",                           a:["7.5°","30°","37.5°","45°"], c:0, w:2 },
    { q:"12) 문자열 규칙: ABACABACAB__",                            a:["A","B","C","D"], c:0, w:1 },
    { q:"13) 회전된 화살표 모양과 일치하는 것은?",                  img:"/assets/img/iq/arrow.svg",    a:["A","B","C","D"], c:2, w:3 },
    { q:"14) 단어유추: 손 : 장갑 = 발 : __",                        a:["돌","양말","신발","스카프"], c:1, w:2 },
    { q:"15) 소수 판별: 97은 소수인가?",                             a:["예","아니오","",""],          c:0, w:1 },
    { q:"16) 도형 회전: 아래 도형을 90° 돌렸을 때 모습은?",         img:"/assets/img/iq/rotate.svg",   a:["A","B","C","D"], c:3, w:4 },
    { q:"17) 수열: 4,9,16,25,__",                                    a:["30","35","36","49"],         c:2, w:2 },
    { q:"18) 비율: 3:5 = 9:__",                                     a:["10","12","14","15"],         c:1, w:2 },
    { q:"19) 논리 퍼즐: '만약 A라면 B...A가 아니다' 결론 오류는?",    a:["전건 긍정","후건 긍정","전건 부정","후건 부정"], c:2, w:3 },
    { q:"20) 다음 중 대칭 중심이 없는 도형은?",                     img:"/assets/img/iq/nosym.svg",    a:["A","B","C","D"], c:1, w:3 },
  ];
  
  let current = 0;
  let answers = Array(questions.length).fill(null);
  let totalTime = 20 * 60;
  let timerInterval;
  
  // DOM 요소
  const startBtn    = document.getElementById('startBtn');
  const quizArea    = document.getElementById('quizArea');
  const timerEl     = document.getElementById('time');
  const qText       = document.getElementById('qText');
  const qImg        = document.getElementById('qImg');
  const form        = document.getElementById('answerForm');
  const prevBtn     = document.getElementById('prevBtn');
  const nextBtn     = document.getElementById('nextBtn');
  const submitBtn   = document.getElementById('submitBtn');
  const resultBlock = document.getElementById('resultBlock');
  const restartDiv  = document.getElementById('restartDiv');
  const restartBtn  = document.getElementById('restartBtn');
  
  // 시작 버튼 클릭
  startBtn.onclick = () => {
    startBtn.style.display = 'none';
    quizArea.style.display = 'block';
    document.getElementById('totalQuestions').textContent = questions.length;
    renderQuestion();
    startTimer();
  };
  
  // 타이머
  function startTimer() {
    timerInterval = setInterval(() => {
      totalTime--;
      const m = Math.floor(totalTime/60), s = totalTime%60;
      timerEl.textContent = `${m}:${s.toString().padStart(2,'0')}`;
      if (totalTime <= 0) {
        clearInterval(timerInterval);
        showResults();
      }
    }, 1000);
  }
  
  // 문제 렌더링
  function renderQuestion() {
    const item = questions[current];
    qText.textContent = item.q;
    if (item.img) {
      qImg.src = item.img;
      qImg.style.display = 'block';
    } else {
      qImg.style.display = 'none';
    }
    form.innerHTML = item.a.map((opt,i) => `
      <label style="display:block;margin:8px 0;">
        <input type="radio" name="answer" value="${i}" ${answers[current]===i?'checked':''} required> ${opt}
      </label>
    `).join('');
  
    prevBtn.style.visibility = current ? 'visible' : 'hidden';
    nextBtn.style.display   = (current < questions.length - 1) ? 'inline-block' : 'none';
    submitBtn.style.display = (current === questions.length - 1) ? 'inline-block' : 'none';
  }
  
  // 답 저장
  function saveAnswer() {
    const sel = form.answer.value;
    if (sel !== undefined) answers[current] = parseInt(sel);
  }
  
  // 네비게이션 버튼 이벤트
  prevBtn.onclick = () => {
    saveAnswer();
    current--;
    renderQuestion();
  };
  nextBtn.onclick = () => {
    if (!form.answer.value) return alert('답을 선택해주세요.');
    saveAnswer();
    current++;
    renderQuestion();
  };
  submitBtn.onclick = e => {
    e.preventDefault();
    if (!form.answer.value) return alert('답을 선택해주세요.');
    saveAnswer();
    showResults();
  };
  
  // 결과 계산 및 표시
  function showResults() {
    clearInterval(timerInterval);
    let score=0, weight=0;
    questions.forEach((q,i) => {
      if (answers[i] === q.c) score += q.w;
      weight += q.w;
    });
    const iq = Math.round((score/weight)*60 + 70);
    const pct = iq>130?'상위 2%':iq>120?'상위 8%':iq>110?'상위 25%':'평균 이하';
  
    resultBlock.innerHTML = `
      <h2>테스트 완료</h2>
      <p>당신의 추정 IQ는 <strong>${iq}</strong>점이며, ${pct}입니다.</p>
    `;
    document.getElementById('navButtons').style.display = 'none';
    document.getElementById('questionBlock').style.display = 'none';
    resultBlock.style.display = 'block';
    restartDiv.style.display = 'block';
  }
  
  // 다시 테스트하기
  restartBtn.onclick = () => {
    clearInterval(timerInterval);
    current = 0;
    answers = Array(questions.length).fill(null);
    totalTime = 20 * 60;
    resultBlock.style.display = 'none';
    restartDiv.style.display = 'none';
    document.getElementById('navButtons').style.display = 'flex';
    document.getElementById('questionBlock').style.display = 'block';
    renderQuestion();
    startTimer();
  };
  