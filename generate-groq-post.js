// generate-groq-post.js
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const dayjs = require("dayjs");

// 🔑 Groq API Key (Peter님의 키로 교체됨)
const GROQ_API_KEY = "";

// 📝 사용자 주제 입력 (CLI에서 받기)
const userTopic = process.argv[2] || "GPT로 블로그 자동 생성하기";

// 📄 저장할 위치
const outputDir = path.join(__dirname, "src", "posts");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// 🧠 프롬프트
const prompt = `"${userTopic}"라는 주제로 한국어 블로그 글을 작성해줘. 
내용은 마크다운 형식으로, 소제목과 단락 구분을 포함해줘. 글은 유익하고 친절한 톤이면 좋겠어.`;

async function generatePost() {
  try {
    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: "당신은 블로그 작가입니다." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      },
      {
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const content = res.data.choices[0].message.content.trim();
    const today = dayjs().format("YYYY-MM-DD");
    const fileName = `${today}-${userTopic.replace(/\s+/g, "-")}.md`;

    const frontmatter = `---
title: ${userTopic}
description: ${userTopic}에 대한 블로그 포스트입니다.
date: ${today}
layout: base.njk
tags: blog
---\n\n`;

    fs.writeFileSync(path.join(outputDir, fileName), frontmatter + content);
    console.log(`✅ 블로그 파일 생성 완료: ${fileName}`);
  } catch (err) {
    console.error("❌ 생성 실패:", err.message);
  }
}

generatePost();
