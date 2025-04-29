// /api/openai.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Only POST requests allowed' });
    }
  
    const { text } = req.body;
  
    if (!text) {
      return res.status(400).json({ message: 'No text provided' });
    }
  
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 여기에_당신의_API_KEY`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: `다음 글을 5문장으로 요약해줘: ${text}` }],
          temperature: 0.7,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const summary = data.choices?.[0]?.message?.content || '요약 실패';
        res.status(200).json({ result: summary });
      } else {
        res.status(500).json({ message: data.error?.message || 'OpenAI API Error' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message || 'Server Error' });
    }
  }
  