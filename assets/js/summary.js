// assets/js/summary.js
document.addEventListener('DOMContentLoaded', () => {
    const btn    = document.getElementById('go');
    const src    = document.getElementById('src');
    const out    = document.getElementById('out');
  
    btn.addEventListener('click', async () => {
      const text = src.value.trim();
      if (!text) {
        alert('요약할 텍스트를 입력하세요.');
        return;
      }
      btn.disabled = true;
      btn.textContent = '요약 중…';
  
      try {
        // OpenAI ChatCompletion API 호출
        const res = await fetch('/api/openai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: '다음 글을 최대 5문장으로 간결하게 요약해줘.' },
              { role: 'user', content: text }
            ],
            max_tokens: 300,
            temperature: 0.5
          })
        });
        const { choices } = await res.json();
        const summary = choices?.[0]?.message?.content?.trim() || '요약 오류가 발생했습니다.';
        
        // 문장별로 <p> 태그 래핑
        out.innerHTML = summary
          .split(/\n+/)
          .filter(s => s.trim())
          .map(s => `<p>${s.trim()}</p>`)
          .join('');
        out.style.display = 'block';
      } catch (e) {
        console.error(e);
        alert('요약 중 오류가 발생했습니다.');
      } finally {
        btn.disabled = false;
        btn.textContent = '요약하기';
      }
    });
  });
  