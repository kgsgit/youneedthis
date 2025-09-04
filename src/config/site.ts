// import { tools } from '@/data/tools'
// import { sites } from '@/data/sites'

export const siteConfig = {
  name: "YouNeedThis",
  description: {
    ko: "생활을 편리하게 만드는 실용적인 도구 모음",
    en: "Practical tools that make life more convenient"
  },
  url: "https://youneedthis.kr",
  
  toolCategories: [
    {
      id: "converter", 
      name: { ko: "변환 도구", en: "Converter" },
      description: { ko: "형식을 변환합니다", en: "Convert formats" },
      icon: "bi-arrow-repeat",
      color: "#f0f8f0"
    },
    {
      id: "generator", 
      name: { ko: "생성 도구", en: "Generator" },
      description: { ko: "새로운 콘텐츠를 생성합니다", en: "Generate content" },
      icon: "bi-stars",
      color: "#f0f6ff"
    },
    {
      id: "validator",
      name: { ko: "검증 도구", en: "Validator" },
      description: { ko: "유효성을 검증합니다", en: "Validate data" },
      icon: "bi-check-circle", 
      color: "#fff8f0"
    },
    {
      id: "analyzer",
      name: { ko: "분석 도구", en: "Analyzer" },
      description: { ko: "데이터를 분석합니다", en: "Analyze data" },
      icon: "bi-graph-up",
      color: "#f8f0ff"
    },
    {
      id: "image",
      name: { ko: "이미지 도구", en: "Image Tools" },
      description: { ko: "이미지 편집 및 처리 도구들", en: "Image editing and processing tools" },
      icon: "bi-image",
      color: "#fff0f8"
    },
    {
      id: "developer",
      name: { ko: "개발자 도구", en: "Developer Tools" },
      description: { ko: "개발에 유용한 도구들", en: "Useful tools for development" },
      icon: "bi-code-slash",
      color: "#f0f0f0"
    }
  ],

  siteCategories: [
    {
      id: "ai-automation",
      name: { ko: "AI & 자동화 도구", en: "AI & Automation" },
      description: { 
        ko: "인공지능과 자동화 관련 최고의 도구들",
        en: "Best AI and automation tools"
      },
      icon: "bi-robot"
    },
    {
      id: "design-uiux",
      name: { ko: "디자인 & UI/UX", en: "Design & UI/UX" },
      description: {
        ko: "디자인 작업을 위한 필수 도구들", 
        en: "Essential tools for design work"
      },
      icon: "bi-palette"
    },
    {
      id: "development",
      name: { ko: "개발 & 코딩", en: "Development & Coding" },
      description: {
        ko: "개발자를 위한 필수 도구들",
        en: "Essential tools for developers"
      },
      icon: "bi-code-slash"
    },
    {
      id: "analytics-marketing",
      name: { ko: "분석 & 마케팅", en: "Analytics & Marketing" },
      description: {
        ko: "데이터 분석과 마케팅 도구들",
        en: "Analytics and marketing tools"
      },
      icon: "bi-graph-up-arrow"
    },
    {
      id: "content-creation",
      name: { ko: "콘텐츠 제작", en: "Content Creation" },
      description: {
        ko: "영상, 음성, 글쓰기 관련 도구들",
        en: "Video, audio, and writing tools"
      },
      icon: "bi-camera-video"
    },
    {
      id: "learning-skills",
      name: { ko: "학습 & 스킬업", en: "Learning & Skills" },
      description: {
        ko: "온라인 학습과 자기계발 플랫폼",
        en: "Online learning and skill development"
      },
      icon: "bi-book"
    },
    {
      id: "productivity",
      name: { ko: "생산성 & 협업", en: "Productivity & Collaboration" },
      description: {
        ko: "업무 효율성을 높이는 도구들",
        en: "Tools to boost work efficiency"
      },
      icon: "bi-lightning"
    },
    {
      id: "developer-tools",
      name: { ko: "개발자 도구", en: "Developer Tools" },
      description: {
        ko: "API, 데이터베이스, 배포 관련 도구들",
        en: "API, database, and deployment tools"
      },
      icon: "bi-wrench"
    },
    {
      id: "startup-business",
      name: { ko: "창업 & 비즈니스", en: "Startup & Business" },
      description: {
        ko: "창업과 사업 운영 관련 도구들",
        en: "Tools for startups and business operations"
      },
      icon: "bi-lightbulb"
    },
    {
      id: "trends-inspiration",
      name: { ko: "트렌드 & 영감", en: "Trends & Inspiration" },
      description: {
        ko: "디자인 영감과 트렌드 정보",
        en: "Design inspiration and trend information"
      },
      icon: "bi-star"
    }
  ],

  tools: [
    {
      id: "image-mosaic",
      category: "image",
      regions: ["kr", "global"],
      name: { ko: "이미지 모자이크", en: "Image Mosaic" },
      description: { 
        ko: "이미지에 모자이크 효과를 적용하여 개인정보 보호",
        en: "Apply mosaic effects to images for privacy protection"
      },
      keywords: { 
        ko: "모자이크, 픽셀화, 블러, 개인정보보호, 이미지편집, 얼굴가리기, 민감정보, 프라이버시, 이미지처리, 사진편집, 신원보호, 마스킹, 흐리게, 가림처리",
        en: "mosaic, pixelate, blur, privacy protection, image editing, face blur, sensitive information, privacy, image processing, photo editing, anonymize, masking, censoring"
      },
      icon: "bi-grid-3x3",
      component: "ImageMosaic"
    },
    {
      id: "image-editor",
      category: "image",
      regions: ["kr", "global"],
      name: { ko: "그림판", en: "Paint" },
      description: { 
        ko: "브러시, 텍스트, 도형 그리기 등 그림 그리기 도구",
        en: "Brush, text, shapes and drawing tools"
      },
      keywords: { 
        ko: "그림판, 브러시, 텍스트, 이미지편집, 드로잉, 그리기, 페인트, 스케치, 디지털아트, 일러스트, 캔버스, 색칠하기, 도형그리기, 선그리기, 픽셀아트, 디자인, 창작, 미술, 아트웍, 포토샵",
        en: "paint, brush, text, image editor, drawing, sketch, digital art, illustration, canvas, coloring, shapes, lines, pixel art, design, creative, art, artwork, photoshop alternative"
      },
      icon: "bi-palette",
      component: "ImageEditor"
    },
    {
      id: "qr-generator",
      category: "generator",
      regions: ["kr", "global"],
      name: { ko: "QR 코드 생성기", en: "QR Code Generator" },
      description: { 
        ko: "URL, 텍스트를 QR코드로 변환",
        en: "Convert URL, text to QR code"
      },
      keywords: { 
        ko: "QR코드, 큐알코드, 생성기, 바코드, URL변환, 텍스트변환, 링크QR, 명함QR, WiFi QR, 연락처QR, 메뉴QR, 결제QR, 스캔코드, 모바일코드, 디지털코드",
        en: "QR code, generator, convert, barcode, URL QR, text QR, link QR, business card QR, WiFi QR, contact QR, menu QR, payment QR, scan code, mobile code, digital code"
      },
      icon: "bi-qr-code",
      component: "QRGenerator"
    },
    {
      id: "password-generator",
      category: "generator",
      regions: ["kr", "global"],
      name: { ko: "비밀번호 생성기", en: "Password Generator" },
      description: { 
        ko: "안전한 랜덤 비밀번호 생성",
        en: "Generate secure random passwords"
      },
      keywords: { 
        ko: "비밀번호생성, 패스워드, 보안, 랜덤비밀번호, 강력한비밀번호, 특수문자, 숫자, 대소문자, 암호생성, 계정보안, 해킹방지, 보안강화, 길이조절, 복잡성, 안전한암호",
        en: "password generator, secure, random, strong password, special characters, numbers, uppercase, lowercase, security, account safety, hacking prevention, length control, complexity, safe password"
      },
      icon: "bi-shield-lock",
      component: "PasswordGenerator"
    },
    {
      id: "uuid-generator",
      category: "generator",
      regions: ["kr", "global"],
      name: { ko: "UUID 생성기", en: "UUID Generator" },
      description: { 
        ko: "고유 식별자 UUID 생성",
        en: "Generate unique identifier UUID"
      },
      keywords: { 
        ko: "UUID, GUID, 고유식별자, 개발자, 유니크ID, 랜덤ID, 개발도구, API키, 데이터베이스ID, 시스템ID, 프로그래밍, 코딩, 개발환경, 식별코드, 자동생성",
        en: "UUID, GUID, unique identifier, developer, unique ID, random ID, dev tools, API key, database ID, system ID, programming, coding, development, identifier code, auto generate"
      },
      icon: "bi-hash",
      component: "UUIDGenerator"
    },
    {
      id: "lorem-generator",
      category: "generator",
      regions: ["kr", "global"],
      name: { ko: "Lorem Ipsum 생성기", en: "Lorem Ipsum Generator" },
      description: { 
        ko: "더미 텍스트 Lorem Ipsum 생성",
        en: "Generate Lorem Ipsum dummy text"
      },
      keywords: { 
        ko: "Lorem Ipsum, 더미텍스트, 샘플텍스트, 가짜텍스트, 테스트텍스트, 디자인용텍스트, 채우기텍스트, 프로토타입, 목업, 임시텍스트, 라틴어, 레이아웃테스트",
        en: "lorem ipsum, dummy text, placeholder, fake text, test text, design text, filler text, prototype, mockup, temporary text, latin text, layout testing"
      },
      icon: "bi-file-text",
      component: "LoremGenerator"
    },
    {
      id: "markdown-link-generator",
      category: "generator",
      regions: ["kr", "global"],
      name: { ko: "마크다운 링크 생성기", en: "Markdown Link Generator" },
      description: { 
        ko: "URL을 마크다운 링크 형식으로 변환",
        en: "Convert URLs to Markdown link format"
      },
      keywords: { 
        ko: "마크다운, 링크생성, URL변환, 마크다운링크, 블로그, 깃허브, 개발자도구, README, 문서작성, 링크포맷, 웹링크, 하이퍼링크, 텍스트링크, 문서편집, 기술문서",
        en: "markdown, link generator, URL convert, markdown link, blog, github, developer tool, README, documentation, link format, web link, hyperlink, text link, document editing, technical writing"
      },
      icon: "bi-link-45deg",
      component: "MarkdownLinkGenerator"
    },
    {
      id: "korean-name-converter",
      category: "converter",
      regions: ["kr"],
      name: { ko: "한글 이름 로마자 변환기", en: "Korean Name Romanizer" },
      description: { 
        ko: "한국 이름을 로마자로 변환",
        en: "Convert Korean names to Roman letters"
      },
      keywords: { 
        ko: "한글, 로마자, 이름변환, 여권, 영문이름, 성명변환, 국제여행, 비자신청, 해외여행, 공식문서, 영어표기, 한국이름, 외국인등록, 출입국, 항공권예약",
        en: "korean, romanize, name, passport, english name, name conversion, international travel, visa application, overseas travel, official documents, english notation, korean name, foreign registration"
      },
      icon: "bi-translate",
      component: "KoreanNameConverter"
    },
    {
      id: "pdf-converter",
      category: "converter",
      regions: ["kr", "global"],
      name: { ko: "PDF 변환기", en: "PDF Converter" },
      description: { 
        ko: "PDF 파일 변환, 합치기, 나누기",
        en: "Convert, merge, split PDF files"
      },
      keywords: { 
        ko: "PDF변환, 파일변환, 합치기, 나누기, 압축, 워드변환, 엑셀변환, 이미지변환, 문서변환, 파일합치기, PDF분할, PDF압축, 문서편집, 포맷변환, 파일통합, PDF도구",
        en: "pdf convert, file converter, merge, split, compress, word to pdf, excel to pdf, image to pdf, document convert, file merge, pdf split, pdf compress, document edit, format conversion, file combine, pdf tools"
      },
      icon: "bi-file-pdf",
      component: "PDFConverter"
    },
    {
      id: "color-converter",
      category: "converter",
      regions: ["kr", "global"],
      name: { ko: "색상 변환기", en: "Color Converter" },
      description: { 
        ko: "RGB, HEX, HSL 색상 변환",
        en: "Convert RGB, HEX, HSL colors"
      },
      keywords: { 
        ko: "색상변환, RGB, HEX, 컬러코드, HSL, CMYK, 색깔변환, 컬러팔레트, 색상표, 디자인컬러, 웹컬러, CSS컬러, 색상추출, 컬러피커, 색상조합, 팬톤컬러",
        en: "color convert, RGB, HEX, color code, HSL, CMYK, color palette, color chart, design color, web color, CSS color, color picker, color extraction, color combination, pantone color"
      },
      icon: "bi-palette",
      component: "ColorConverter"
    },
    {
      id: "base64-converter",
      category: "converter",
      regions: ["kr", "global"],
      name: { ko: "Base64 인코딩/디코딩", en: "Base64 Encoder/Decoder" },
      description: { 
        ko: "텍스트를 Base64로 인코딩/디코딩",
        en: "Encode/decode text to/from Base64"
      },
      keywords: { 
        ko: "Base64, 인코딩, 디코딩, 개발자, 암호화, 복호화, 텍스트변환, 이미지인코딩, 데이터변환, 웹개발, API개발, 프로그래밍, 코딩, 개발도구, 문자열변환",
        en: "base64, encode, decode, developer, encryption, decryption, text conversion, image encoding, data conversion, web development, API development, programming, coding, dev tools, string conversion"
      },
      icon: "bi-file-binary",
      component: "Base64Converter"
    },
    {
      id: "resident-number-validator",
      category: "validator",
      regions: ["kr"],
      name: { ko: "주민등록번호 검증기", en: "Korean Resident Number Validator" },
      description: { 
        ko: "주민등록번호 유효성 검사",
        en: "Validate Korean resident registration number"
      },
      keywords: { 
        ko: "주민등록번호, 검증, 유효성검사, 주민번호확인, 신분확인, 개인정보, 한국주민번호, 생년월일확인, 성별확인, 지역확인, 번호체크, 형식검증",
        en: "korean resident number, validate, check, ID number, identity verification, personal info, birth date check, gender check, region check, number verification, format validation"
      },
      icon: "bi-person-badge",
      component: "ResidentValidator"
    },
    {
      id: "business-number-validator",
      category: "validator",
      regions: ["kr"],
      name: { ko: "사업자등록번호 검증기", en: "Korean Business Number Validator" },
      description: { 
        ko: "사업자등록번호 유효성 검사",
        en: "Validate Korean business registration number"
      },
      keywords: { 
        ko: "사업자등록번호, 검증, 유효성검사, 사업자번호확인, 법인번호, 사업체확인, 세무서등록, 기업정보, 한국사업자, 사업자조회, 번호체크, 형식검증",
        en: "korean business number, validate, check, business registration, corporate number, company verification, tax office registration, company info, business lookup, number check, format validation"
      },
      icon: "bi-building",
      component: "BusinessValidator"
    },
    {
      id: "email-validator",
      category: "validator",
      regions: ["kr", "global"],
      name: { ko: "이메일 검증기", en: "Email Validator" },
      description: { 
        ko: "이메일 형식 유효성 검사",
        en: "Validate email address format"
      },
      keywords: { 
        ko: "이메일검증, 유효성검사, 형식확인, 메일주소확인, 이메일체크, 메일형식, 도메인확인, 계정확인, 올바른이메일, 이메일정규식, 주소검증, 메일검사",
        en: "email validator, format check, verify, email address check, mail format, domain verification, account verification, valid email, email regex, address validation, email testing"
      },
      icon: "bi-envelope-check",
      component: "EmailValidator"
    },
    {
      id: "phone-validator",
      category: "validator",
      regions: ["kr", "global"],
      name: { ko: "전화번호 형식 검증기", en: "Phone Number Validator" },
      description: { 
        ko: "전화번호 형식 유효성 검사",
        en: "Validate phone number format"
      },
      keywords: { 
        ko: "전화번호검증, 휴대폰번호, 형식확인, 핸드폰번호, 연락처확인, 번호형식, 국가번호, 지역번호, 모바일번호, 번호체크, 연락처검증, 통신사확인",
        en: "phone validator, mobile number, format, cell phone, contact verification, number format, country code, area code, phone check, contact validation, carrier check, telephone validation"
      },
      icon: "bi-telephone-check",
      component: "PhoneValidator"
    },
    {
      id: "vat-calculator",
      category: "analyzer",
      regions: ["kr"],
      name: { ko: "부가세 계산기", en: "Korean VAT Calculator" },
      description: { 
        ko: "한국 부가세 (10%) 계산",
        en: "Calculate Korean VAT (10%)"
      },
      keywords: { 
        ko: "부가세계산, VAT, 세금계산, 부가가치세, 10퍼센트, 세전가격, 세후가격, 공급가액, 세액계산, 한국세금, 사업자세금, 매출세액, 매입세액, 세무계산",
        en: "vat calculator, tax, korean, value added tax, 10 percent, before tax, after tax, supply amount, tax calculation, korean tax, business tax, sales tax, purchase tax, tax computation"
      },
      icon: "bi-calculator",
      component: "VATCalculator"
    },
    {
      id: "ip-tracker",
      category: "analyzer", 
      regions: ["kr", "global"],
      name: { ko: "IP 추적기", en: "IP Tracker" },
      description: { 
        ko: "IP 주소로 위치, 통신사, 기기 종류를 즉시 확인",
        en: "Instantly check location, ISP, and device type by IP address"
      },
      keywords: { 
        ko: "IP추적, 위치확인, 통신사조회, 아이피주소, 지도, 아이피확인, 위치추적, 지역확인, 네트워크정보, 인터넷주소, 사용자위치, 국가확인, 도시확인, ISP확인, 접속위치",
        en: "ip tracker, location lookup, isp check, ip address, map, ip geolocation, location tracking, region check, network info, internet address, user location, country check, city check, connection location"
      },
      icon: "bi-geo-alt",
      component: "IPTracker"
    },
    {
      id: "text-counter",
      category: "analyzer",
      regions: ["kr", "global"],
      name: { ko: "글자수 세기", en: "Text Counter" },
      description: { 
        ko: "텍스트 글자수, 단어수, 문단수 계산",
        en: "Count characters, words, paragraphs"
      },
      keywords: { 
        ko: "글자수세기, 단어수, 텍스트분석, 문자수계산, 바이트수, 줄수, 문단수, 공백포함, 공백제외, 문서분석, 글길이, 텍스트길이, 원고지계산, 리포트작성",
        en: "character count, word count, text analysis, character calculation, byte count, line count, paragraph count, with spaces, without spaces, document analysis, text length, manuscript calculation, report writing"
      },
      icon: "bi-type",
      component: "TextCounter"
    },
    {
      id: "age-calculator",
      category: "analyzer",
      regions: ["kr", "global"],
      name: { ko: "나이 계산기", en: "Age Calculator" },
      description: { 
        ko: "생년월일로 정확한 나이 계산",
        en: "Calculate exact age from birth date"
      },
      keywords: { 
        ko: "나이계산, 생년월일, 만나이, 한국나이, 연나이, 개월수, 일수, 나이변환, 출생일계산, 생일계산, 몇살, 나이확인, 연령계산, 생년월일계산",
        en: "age calculator, birth date, exact age, korean age, years old, months, days, age conversion, birth calculation, birthday calculation, how old, age verification, age computation"
      },
      icon: "bi-calendar-date",
      component: "AgeCalculator"
    },
    {
      id: "unit-converter",
      category: "analyzer",
      regions: ["kr", "global"],
      name: { ko: "단위 변환기", en: "Unit Converter" },
      description: { 
        ko: "길이, 무게, 온도, 면적 단위 변환",
        en: "Convert length, weight, temperature, area units"
      },
      keywords: { 
        ko: "단위변환, 길이변환, 무게변환, 온도변환, 미터변환, 킬로그램변환, 섭씨온도, 화씨온도, 인치변환, 파운드변환, 면적변환, 부피변환, 속도변환, 압력변환, 에너지변환",
        en: "unit converter, length, weight, temperature, meter conversion, kilogram conversion, celsius, fahrenheit, inch conversion, pound conversion, area conversion, volume conversion, speed conversion, pressure conversion, energy conversion"
      },
      icon: "bi-rulers",
      component: "UnitConverter"
    }
  ],

  sites: [
    // AI & Automation (8개)
    {
      id: "chatgpt",
      category: "ai-automation",
      name: {
        ko: "ChatGPT",
        en: "ChatGPT"
      },
      description: {
        ko: "OpenAI에서 개발한 대화형 AI 모델",
        en: "Conversational AI by OpenAI"
      },
      url: "https://chat.openai.com",
      thumbnail: "bi-chat-dots",
      customThumbnail: "", // 추후 관리자가 업로드할 수 있음
      isPaid: true,
      rating: 4.8,
      tags: {
        ko: ["AI", "챗봇", "텍스트 생성", "인공지능", "대화AI", "글쓰기도우미", "OpenAI", "GPT", "코딩도우미", "번역", "요약", "창작글쓰기", "비즈니스도구", "자동응답", "언어모델", "LLM"],
        en: ["AI", "Chatbot", "Text Generation", "Artificial Intelligence", "Conversational AI", "Writing Assistant", "OpenAI", "GPT", "Coding Help", "Translation", "Summarization", "Creative Writing", "Business Tool", "Auto Response", "Language Model", "LLM"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "claude",
      category: "ai-automation",
      name: {
        ko: "Claude",
        en: "Claude"
      },
      description: {
        ko: "Anthropic의 안전한 AI 어시스턴트",
        en: "Safe AI assistant by Anthropic"
      },
      url: "https://claude.ai",
      thumbnail: "bi-robot",
      isPaid: true,
      rating: 4.7,
      tags: {
        ko: ["AI", "어시스턴트", "안전", "인공지능", "Anthropic", "대화AI", "윤리AI", "안전한AI", "글쓰기도우미", "분석AI", "연구지원", "코딩도우미", "유해성방지", "신뢰성", "전문AI"],
        en: ["AI", "Assistant", "Safety", "Artificial Intelligence", "Anthropic", "Conversational AI", "Ethical AI", "Safe AI", "Writing Assistant", "Analysis AI", "Research Support", "Coding Help", "Harmlessness", "Reliability", "Professional AI"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "midjourney",
      category: "ai-automation",
      name: {
        ko: "Midjourney",
        en: "Midjourney"
      },
      description: {
        ko: "텍스트로 고품질 이미지를 생성하는 AI",
        en: "AI that generates high-quality images from text"
      },
      url: "https://www.midjourney.com",
      thumbnail: "bi-image",
      isPaid: true,
      rating: 4.6,
      tags: {
        ko: ["AI", "이미지생성", "창작", "인공지능아트", "이미지AI", "그림생성", "디지털아트", "아트워크", "이러스트", "디자인AI", "프롱프트아트", "텍스트투Image", "창의적AI", "예술AI", "Discord봇"],
        en: ["AI", "Image Generation", "Creative", "AI Art", "Image AI", "Picture Generation", "Digital Art", "Artwork", "Illustration", "Design AI", "Prompt Art", "Text to Image", "Creative AI", "Art AI", "Discord Bot"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "zapier",
      category: "ai-automation",
      name: {
        ko: "Zapier",
        en: "Zapier"
      },
      description: {
        ko: "앱과 워크플로우 자동화 플랫폼",
        en: "Connect apps and automate workflows"
      },
      url: "https://zapier.com",
      thumbnail: "bi-lightning",
      isPaid: true,
      rating: 4.5,
      tags: {
        ko: ["자동화", "워크플로우", "통합", "업무자동화", "앱연결", "비즈니스자동화", "API연결", "생산성향상", "직업효율성", "노코드", "웹훅", "전자메일자동화", "데이터동기화", "SaaS연결"],
        en: ["Automation", "Workflow", "Integration", "Work Automation", "App Connection", "Business Automation", "API Connection", "Productivity", "Work Efficiency", "No-Code", "Webhooks", "Email Automation", "Data Sync", "SaaS Integration"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "make",
      category: "ai-automation",
      name: {
        ko: "Make (Integromat)",
        en: "Make (Integromat)"
      },
      description: {
        ko: "시각적 자동화 플랫폼으로 복잡한 워크플로우 구축",
        en: "Visual automation platform for complex workflows"
      },
      url: "https://www.make.com",
      thumbnail: "bi-link",
      isPaid: true,
      rating: 4.4,
      tags: {
        ko: ["자동화", "시각적", "통합", "비주얼자동화", "Integromat", "드래그앤드롭", "업무자동화", "플로우차트", "노코드", "워크플로우엔진", "시나리오자동화", "비즈니스프로세스", "API오케스트레이션", "생산성도구"],
        en: ["Automation", "Visual", "Integration", "Visual Automation", "Integromat", "Drag and Drop", "Work Automation", "Flow Chart", "No-Code", "Workflow Engine", "Scenario Automation", "Business Process", "API Orchestration", "Productivity Tool"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "perplexity",
      category: "ai-automation",
      name: {
        ko: "Perplexity",
        en: "Perplexity"
      },
      description: {
        ko: "AI 기반 검색 엔진 및 연구 도구",
        en: "AI-powered search engine and research tool"
      },
      url: "https://www.perplexity.ai",
      thumbnail: "bi-search",
      isPaid: false,
      rating: 4.5,
      tags: {
        ko: ["AI", "검색", "연구", "AI검색엔진", "인공지능검색", "실시간정보", "연구도구", "정보찾기", "참고자료", "학술검색", "인터넷검색", "대화형검색", "AI리서치", "데이터분석", "지식베이스"],
        en: ["AI", "Search", "Research", "AI Search Engine", "AI-powered Search", "Real-time Info", "Research Tool", "Information Finding", "References", "Academic Search", "Internet Search", "Conversational Search", "AI Research", "Data Analysis", "Knowledge Base"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "runway",
      category: "ai-automation",
      name: {
        ko: "Runway",
        en: "Runway"
      },
      description: {
        ko: "AI로 비디오 편집 및 생성",
        en: "AI-powered video editing and generation"
      },
      url: "https://runwayml.com",
      thumbnail: "bi-camera-video",
      isPaid: true,
      rating: 4.3,
      tags: {
        ko: ["AI", "비디오", "편집", "AI비디오생성", "비디오AI", "영상편집", "영상제작", "컴퓨터비전", "단편영상", "광고영상", "소셜미디어비디오", "ML비디오", "창작AI", "비디오자동화", "영상기술"],
        en: ["AI", "Video", "Editing", "AI Video Generation", "Video AI", "Video Editing", "Video Production", "Computer Vision", "Short Videos", "Commercial Videos", "Social Media Videos", "ML Video", "Creative AI", "Video Automation", "Video Technology"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "gamma",
      category: "ai-automation",
      name: {
        ko: "Gamma",
        en: "Gamma"
      },
      description: {
        ko: "AI로 프레젠테이션 생성",
        en: "AI-powered presentation generator"
      },
      url: "https://gamma.app",
      thumbnail: "bi-graph-up",
      isPaid: true,
      rating: 4.2,
      tags: {
        ko: ["AI", "프레젠테이션", "생성기", "AI프레젠테이션", "PPT생성", "슬라이드생성", "자동PPT제작", "비즈니스프레젠테이션", "발표자료", "업무자료", "마케팅자료", "교육자료", "밀데크생성", "인포그래픽AI", "디자인자동화"],
        en: ["AI", "Presentation", "Generator", "AI Presentation", "PPT Generation", "Slide Generation", "Auto PPT Creation", "Business Presentation", "Presentation Materials", "Work Documents", "Marketing Materials", "Educational Materials", "Pitch Deck", "Infographic AI", "Design Automation"]
      },
      regions: ["kr", "global"]
    },

    // Design & UI/UX (8개)
    {
      id: "figma",
      category: "design-uiux",
      name: {
        ko: "Figma",
        en: "Figma"
      },
      description: {
        ko: "클라우드 기반 협업 디자인 도구",
        en: "Cloud-based collaborative design tool"
      },
      url: "https://www.figma.com",
      thumbnail: "🎨",
      isPaid: true,
      rating: 4.8,
      tags: {
        ko: ["디자인", "협업", "프로토타입", "UI디자인", "UX디자인", "인터페이스디자인", "벡터디자인", "팀협업", "디자인시스템", "웹디자인", "모바일디자인", "앞드자인", "사용자경험", "인터랙션디자인", "디자인툴"],
        en: ["Design", "Collaboration", "Prototype", "UI Design", "UX Design", "Interface Design", "Vector Design", "Team Collaboration", "Design System", "Web Design", "Mobile Design", "App Design", "User Experience", "Interaction Design", "Design Tool"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "framer",
      category: "design-uiux", 
      name: {
        ko: "Framer",
        en: "Framer"
      },
      description: {
        ko: "고급 프로토타이핑 및 디자인 도구",
        en: "Advanced prototyping and design tool"
      },
      url: "https://www.framer.com",
      thumbnail: "🎨",
      isPaid: true,
      rating: 4.6,
      tags: {
        ko: ["프로토타입", "애니메이션", "웹사이트", "고급프로토타입", "인터랙션디자인", "모션디자인", "웹사이트빌더", "노코드", "애니메이션툴", "마이크로인터렉션", "UI애니메이션", "디자인툴", "비주얼디자인", "웹개발"],
        en: ["Prototype", "Animation", "Website", "Advanced Prototyping", "Interaction Design", "Motion Design", "Website Builder", "No-Code", "Animation Tool", "Micro Interactions", "UI Animation", "Design Tool", "Visual Design", "Web Development"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "adobe-xd",
      category: "design-uiux",
      name: {
        ko: "Adobe XD",
        en: "Adobe XD"
      }, 
      description: {
        ko: "Adobe의 UX/UI 디자인 및 프로토타이핑 도구",
        en: "Adobe's UX/UI design and prototyping tool"
      },
      url: "https://www.adobe.com/products/xd.html",
      thumbnail: "🔷",
      isPaid: true,
      rating: 4.4,
      tags: {
        ko: ["UX", "UI", "Adobe", "UX디자인", "UI디자인", "인터페이스디자인", "프로토타이핑툴", "어도비XD", "사용자경험디자인", "인터랙션디자인", "모바일디자인", "웹디자인", "앱디자인", "와이어프레임", "디자인툴"],
        en: ["UX", "UI", "Adobe", "UX Design", "UI Design", "Interface Design", "Prototyping Tool", "Adobe XD", "User Experience Design", "Interaction Design", "Mobile Design", "Web Design", "App Design", "Wireframe", "Design Tool"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "canva",
      category: "design-uiux",
      name: {
        ko: "Canva",
        en: "Canva"
      },
      description: {
        ko: "누구나 쉽게 사용할 수 있는 온라인 디자인 도구",
        en: "Easy-to-use online design tool for everyone"
      },
      url: "https://www.canva.com",
      thumbnail: "🎨",
      isPaid: true,
      rating: 4.7,
      tags: {
        ko: ["그래픽디자인", "템플릿", "소셜", "온라인디자인", "소셜미디어디자인", "포스터디자인", "로고디자인", "명함디자인", "인스타그램디자인", "브랜드디자인", "마케팅자료", "디자인템플릿", "초보자디자인", "쉽고빠른디자인"],
        en: ["Graphic Design", "Template", "Social", "Online Design", "Social Media Design", "Poster Design", "Logo Design", "Business Card Design", "Instagram Design", "Brand Design", "Marketing Materials", "Design Templates", "Beginner Design", "Quick Design"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "dribbble",
      category: "design-uiux",
      name: {
        ko: "Dribbble",
        en: "Dribbble"
      },
      description: {
        ko: "디자인 영감과 포트폴리오 공유 플랫폼",
        en: "Design inspiration and portfolio sharing platform"
      },
      url: "https://dribbble.com",
      thumbnail: "🎨",
      isPaid: true,
      rating: 4.5,
      tags: {
        ko: ["포트폴리오", "영감", "커뮤니티", "디자인영감", "작품공유", "디자이너커뮤니티", "크리에이티브샤디어", "디자인쇼케이스", "아트워크공유", "디자인트렌드", "속재도구", "디자인영감찾기", "속재도구", "작품전시"],
        en: ["Portfolio", "Inspiration", "Community", "Design Inspiration", "Work Sharing", "Designer Community", "Creative Sharing", "Design Showcase", "Artwork Sharing", "Design Trends", "Speed Tools", "Design Inspiration Hunt", "Speed Tools", "Work Exhibition"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "behance",
      category: "design-uiux",
      name: {
        ko: "Behance",
        en: "Behance"
      },
      description: {
        ko: "Adobe의 창작자 포트폴리오 플랫폼",
        en: "Adobe's creative portfolio platform"
      },
      url: "https://www.behance.net",
      thumbnail: "🎨",
      isPaid: false,
      rating: 4.4,
      tags: {
        ko: ["포트폴리오", "창작", "크리에이티브", "Adobe포트폴리오", "크리에이티브커뮤니티", "작품공유", "비헨야스", "예술가커뮤니티", "디자이너포트폴리오", "사진작가", "일러스트레이터", "그래픽디자이너", "예술작품", "창의적영감", "디자인영감"],
        en: ["Portfolio", "Creative", "Creative", "Adobe Portfolio", "Creative Community", "Work Sharing", "Behance", "Artist Community", "Designer Portfolio", "Photographer", "Illustrator", "Graphic Designer", "Art Work", "Creative Inspiration", "Design Inspiration"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "unsplash",
      category: "design-uiux",
      name: {
        ko: "Unsplash",
        en: "Unsplash"
      },
      description: {
        ko: "고품질 무료 스톡 사진 플랫폼",
        en: "High-quality free stock photo platform"
      },
      url: "https://unsplash.com",
      thumbnail: "📷",
      isPaid: false,
      rating: 4.6,
      tags: {
        ko: ["스톡사진", "무료", "고품질", "무료사진", "로열티프리", "저작권프리", "고해상도사진", "브이로그사진", "웹사이트사진", "마케팅사진", "비즈니스사진", "상업적이용가능", "크리에이티브커먼즈", "사진자료"],
        en: ["Stock Photo", "Free", "High Quality", "Free Photos", "Royalty Free", "Copyright Free", "High Resolution Photos", "Blog Photos", "Website Photos", "Marketing Photos", "Business Photos", "Commercial Use", "Creative Commons", "Photo Resources"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "coolors",
      category: "design-uiux",
      name: {
        ko: "Coolors",
        en: "Coolors"
      },
      description: {
        ko: "색상 팔레트 생성 및 관리 도구",
        en: "Color palette generator and manager"
      },
      url: "https://coolors.co",
      thumbnail: "🎨",
      isPaid: true,
      rating: 4.5,
      tags: {
        ko: ["색상", "팔레트", "컬러코드", "색상조합", "컬러팔레트생성기", "디자인컬러", "HEX코드", "RGB컬러", "색상표", "카드색상", "브랜드컬러", "컬러영감", "색채조합", "그라디언트컬러", "컬러비전"],
        en: ["Color", "Palette", "Color Code", "Color Combination", "Color Palette Generator", "Design Colors", "HEX Code", "RGB Colors", "Color Chart", "Card Colors", "Brand Colors", "Color Inspiration", "Color Harmony", "Gradient Colors", "Color Vision"]
      },
      regions: ["kr", "global"]
    },

    // Development & Coding (8개)
    {
      id: "github",
      category: "development",
      name: {
        ko: "GitHub",
        en: "GitHub"
      },
      description: {
        ko: "개발자를 위한 버전 관리 및 협업 플랫폼",
        en: "Version control and collaboration platform for developers"
      },
      url: "https://github.com",
      thumbnail: "💻",
      isPaid: true,
      rating: 4.9,
      tags: {
        ko: ["버전관리", "Git", "협업", "코드저장소", "오픈소스", "개발협업", "코드리뷰", "개발자커뮤니티", "레포지토리", "깃허브", "코드호스팅", "프로젝트관리", "CI/CD", "개발툴", "소스코드관리"],
        en: ["Version Control", "Git", "Collaboration", "Code Repository", "Open Source", "Dev Collaboration", "Code Review", "Developer Community", "Repository", "GitHub", "Code Hosting", "Project Management", "CI/CD", "Development Tool", "Source Code Management"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "vscode",
      category: "development",
      name: {
        ko: "VS Code",
        en: "VS Code"
      },
      description: {
        ko: "Microsoft의 무료 코드 에디터",
        en: "Microsoft's free code editor"
      },
      url: "https://code.visualstudio.com",
      thumbnail: "📝",
      isPaid: false,
      rating: 4.8,
      tags: {
        ko: ["에디터", "개발환경", "Microsoft", "코드에디터", "VS코드", "개발도구", "프로그래밍에디터", "확장프로그램", "코드에디터", "IntelliSense", "디버깅", "신택스하이라이팅", "자동완성", "무료에디터", "IDE"],
        en: ["Editor", "Development Environment", "Microsoft", "Code Editor", "VS Code", "Development Tool", "Programming Editor", "Extensions", "Code Editor", "IntelliSense", "Debugging", "Syntax Highlighting", "Auto Complete", "Free Editor", "IDE"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "vercel",
      category: "development",
      name: {
        ko: "Vercel",
        en: "Vercel"
      },
      description: {
        ko: "프론트엔드 앱 배포 및 호스팅 플랫폼",
        en: "Frontend app deployment and hosting platform"
      },
      url: "https://vercel.com",
      thumbnail: "bi-lightning",
      isPaid: true,
      rating: 4.7,
      tags: {
        ko: ["배포", "호스팅", "Next.js", "프론트엔드배포", "웹사이트배포", "클라우드호스팅", "CDN", "서버리스", "자동배포", "Jamstack", "React배포", "Vue배포", "정적사이트", "무료호스팅", "웹호스팅"],
        en: ["Deployment", "Hosting", "Next.js", "Frontend Deployment", "Website Deployment", "Cloud Hosting", "CDN", "Serverless", "Auto Deployment", "Jamstack", "React Deployment", "Vue Deployment", "Static Site", "Free Hosting", "Web Hosting"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "netlify",
      category: "development",
      name: {
        ko: "Netlify",
        en: "Netlify"
      },
      description: {
        ko: "정적 사이트 배포 및 관리 플랫폼",
        en: "Static site deployment and management platform"
      },
      url: "https://www.netlify.com",
      thumbnail: "🌐",
      isPaid: true,
      rating: 4.6,
      tags: {
        ko: ["정적사이트", "JAMstack", "배포", "웹사이트호스팅", "정적웹사이트", "Git기반배포", "무료호스팅", "클라우드배포", "웹개발", "HTML호스팅", "React호스팅", "Vue호스팅", "CDN호스팅", "네트라이파이", "자동배포"],
        en: ["Static Site", "JAMstack", "Deployment", "Website Hosting", "Static Website", "Git-based Deployment", "Free Hosting", "Cloud Deployment", "Web Development", "HTML Hosting", "React Hosting", "Vue Hosting", "CDN Hosting", "Netlify", "Auto Deployment"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "stackoverflow",
      category: "development",
      name: {
        ko: "Stack Overflow",
        en: "Stack Overflow"
      },
      description: {
        ko: "개발자를 위한 질문답변 커뮤니티",
        en: "Q&A community for developers"
      },
      url: "https://stackoverflow.com",
      thumbnail: "❓",
      isPaid: false,
      rating: 4.5,
      tags: {
        ko: ["Q&A", "커뮤니티", "문제해결", "개발자커뮤니티", "코딩도움", "프로그래밍Q&A", "기술질문", "코드리뷰", "버그해결", "스택오버플로우", "개발지식공유", "프로그래머커뮤니티", "기술문제해결", "코딩문제", "에러해결"],
        en: ["Q&A", "Community", "Problem Solving", "Developer Community", "Coding Help", "Programming Q&A", "Technical Questions", "Code Review", "Bug Solving", "Stack Overflow", "Dev Knowledge Sharing", "Programmer Community", "Technical Problem Solving", "Coding Issues", "Error Resolution"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "codepen",
      category: "development",
      name: {
        ko: "CodePen",
        en: "CodePen"
      },
      description: {
        ko: "온라인 코드 에디터 및 쇼케이스 플랫폼",
        en: "Online code editor and showcase platform"
      },
      url: "https://codepen.io",
      thumbnail: "✏️",
      isPaid: true,
      rating: 4.4,
      tags: {
        ko: ["온라인에디터", "HTML", "CSS", "JS", "웹개발에디터", "코드펜", "브라우저에디터", "프론트엔드에디터", "JavaScript에디터", "온라인IDE", "라이브코딩", "코드수석장", "실시간미리보기", "웹코딩", "프롯엔드데모"],
        en: ["Online Editor", "HTML", "CSS", "JS", "Web Development Editor", "CodePen", "Browser Editor", "Frontend Editor", "JavaScript Editor", "Online IDE", "Live Coding", "Code Playground", "Real-time Preview", "Web Coding", "Frontend Demo"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "replit",
      category: "development",
      name: {
        ko: "Replit",
        en: "Replit"
      },
      description: {
        ko: "브라우저에서 코딩부터 배포까지",
        en: "Code and deploy from your browser"
      },
      url: "https://replit.com",
      thumbnail: "🖥️",
      isPaid: true,
      rating: 4.3,
      tags: {
        ko: ["온라인IDE", "협업", "배포", "리플릿", "브라우저에디터", "클라우드IDE", "코드호스팅", "실시간코딩", "온라인코딩", "웹기반IDE", "팀코딩", "라이브코드에디터", "공유코드에디터", "인스턴트배포", "멀티플레이어코딩"],
        en: ["Online IDE", "Collaboration", "Deployment", "Replit", "Browser Editor", "Cloud IDE", "Code Hosting", "Real-time Coding", "Online Coding", "Web-based IDE", "Team Coding", "Live Code Editor", "Shared Code Editor", "Instant Deployment", "Multiplayer Coding"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "postman",
      category: "development",
      name: {
        ko: "Postman",
        en: "Postman"
      },
      description: {
        ko: "API 개발 및 테스트 플랫폼",
        en: "API development and testing platform"
      },
      url: "https://www.postman.com",
      thumbnail: "📡",
      isPaid: true,
      rating: 4.6,
      tags: {
        ko: ["API", "테스트", "개발도구", "API테스트", "REST API", "HTTP클라이언트", "API개발", "웹API", "API디버깅", "포스트맨", "API문서화", "API모니터링", "GraphQL테스트", "API자동화", "백엔드테스트"],
        en: ["API", "Testing", "Development Tool", "API Testing", "REST API", "HTTP Client", "API Development", "Web API", "API Debugging", "Postman", "API Documentation", "API Monitoring", "GraphQL Testing", "API Automation", "Backend Testing"]
      },
      regions: ["kr", "global"]
    },

    // Analytics & Marketing (8개)
    {
      id: "google-analytics",
      category: "analytics-marketing",
      name: {
        ko: "Google Analytics",
        en: "Google Analytics"
      },
      description: {
        ko: "웹사이트 트래픽 분석 도구",
        en: "Website traffic analysis tool"
      },
      url: "https://analytics.google.com",
      thumbnail: "bi-graph-up",
      isPaid: false,
      rating: 4.6,
      tags: {
        ko: ["웹분석", "트래픽", "Google", "데이터분석", "웹사이트분석", "사용자분석", "구글애널리틱스", "방문자분석", "페이지뷰", "컨버전추적", "ROI측정", "마케팅성과", "비즈니스인텔리전스", "웹통계", "SEO분석"],
        en: ["Web Analytics", "Traffic", "Google", "Data Analytics", "Website Analytics", "User Analytics", "Google Analytics", "Visitor Analytics", "Page Views", "Conversion Tracking", "ROI Measurement", "Marketing Performance", "Business Intelligence", "Web Statistics", "SEO Analytics"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "hotjar",
      category: "analytics-marketing",
      name: {
        ko: "Hotjar",
        en: "Hotjar"
      },
      description: {
        ko: "사용자 행동 분석 및 히트맵 도구",
        en: "User behavior analytics and heatmap tool"
      },
      url: "https://www.hotjar.com",
      thumbnail: "🔥",
      isPaid: true,
      rating: 4.4,
      tags: {
        ko: ["사용자분석", "히트맵", "UX", "사용자경험분석", "행동분석", "클릭분석", "마우스움직임", "스크롬분석", "세션녹화", "사이트분석", "웹사이트최적화", "A/B테스트", "컨버전최적화", "대시보드", "데이터시각화"],
        en: ["User Analytics", "Heatmap", "UX", "User Experience Analytics", "Behavior Analytics", "Click Analysis", "Mouse Movement", "Scroll Analysis", "Session Recording", "Site Analytics", "Website Optimization", "A/B Testing", "Conversion Optimization", "Dashboard", "Data Visualization"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "mailchimp",
      category: "analytics-marketing",
      name: {
        ko: "Mailchimp",
        en: "Mailchimp"
      },
      description: {
        ko: "이메일 마케팅 자동화 플랫폼",
        en: "Email marketing automation platform"
      },
      url: "https://mailchimp.com",
      thumbnail: "📧",
      isPaid: true,
      rating: 4.3,
      tags: {
        ko: ["이메일마케팅", "자동화", "뉴스레터", "메일캐페인", "마케팅자동화", "기업메일", "고객관리", "이메일발송", "마케팅퍼널", "리드수집", "세그먼테이션", "마케팅대시보드", "전자상거래연동", "CRM"],
        en: ["Email Marketing", "Automation", "Newsletter", "Email Campaign", "Marketing Automation", "Business Email", "Customer Management", "Email Delivery", "Marketing Funnel", "Lead Generation", "Segmentation", "Marketing Dashboard", "E-commerce Integration", "CRM"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "hootsuite",
      category: "analytics-marketing",
      name: {
        ko: "Hootsuite",
        en: "Hootsuite"
      },
      description: {
        ko: "소셜미디어 관리 및 스케줄링 도구",
        en: "Social media management and scheduling tool"
      },
      url: "https://hootsuite.com",
      thumbnail: "🐦",
      isPaid: true,
      rating: 4.2,
      tags: {
        ko: ["소셜미디어", "스케줄링", "관리", "소셜미디어관리", "인스타그램관리", "페이스북관리", "트위터관리", "콘텐츠스케줄링", "마케팅캐맨페인", "소셜미디어전략", "컴뮤니티관리", "브랜드모니터링", "영향력버케팅", "소셜대시보드"],
        en: ["Social Media", "Scheduling", "Management", "Social Media Management", "Instagram Management", "Facebook Management", "Twitter Management", "Content Scheduling", "Marketing Campaigns", "Social Media Strategy", "Community Management", "Brand Monitoring", "Influencer Marketing", "Social Dashboard"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "semrush",
      category: "analytics-marketing",
      name: {
        ko: "SEMrush",
        en: "SEMrush"
      },
      description: {
        ko: "SEO 및 디지털 마케팅 분석 도구",
        en: "SEO and digital marketing analytics tool"
      },
      url: "https://www.semrush.com",
      thumbnail: "bi-search",
      isPaid: true,
      rating: 4.5,
      tags: {
        ko: ["SEO", "키워드", "경쟁분석", "SEO도구", "검색엔진최적화", "키워드연구", "백링크분석", "SERP추적", "사이트감사", "소셜미디어마케팅", "테크니컬SEO", "컨텐츠마케팅", "웹마스터도구", "마케팅인텔리전스", "디지털마케팅"],
        en: ["SEO", "Keyword", "Competitive Analysis", "SEO Tools", "Search Engine Optimization", "Keyword Research", "Backlink Analysis", "SERP Tracking", "Site Audit", "Social Media Marketing", "Technical SEO", "Content Marketing", "Webmaster Tools", "Marketing Intelligence", "Digital Marketing"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "hubspot",
      category: "analytics-marketing",
      name: {
        ko: "HubSpot",
        en: "HubSpot"
      },
      description: {
        ko: "CRM 및 인바운드 마케팅 플랫폼",
        en: "CRM and inbound marketing platform"
      },
      url: "https://www.hubspot.com",
      thumbnail: "🎯",
      isPaid: true,
      rating: 4.4,
      tags: {
        ko: ["CRM", "마케팅", "세일즈", "고객관계관리", "인바운드마케팅", "마케팅자동화", "품의세일즈", "리드세이터", "세일즈퍼널", "마케팅플랫폼", "이메일마케팅연동", "세일즈대시보드", "마케팅ROI", "업무자동화"],
        en: ["CRM", "Marketing", "Sales", "Customer Relationship Management", "Inbound Marketing", "Marketing Automation", "Sales Pipeline", "Lead Generation", "Sales Funnel", "Marketing Platform", "Email Marketing Integration", "Sales Dashboard", "Marketing ROI", "Business Automation"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "mixpanel",
      category: "analytics-marketing",
      name: {
        ko: "Mixpanel",
        en: "Mixpanel"
      },
      description: {
        ko: "이벤트 기반 사용자 분석 도구",
        en: "Event-based user analytics tool"
      },
      url: "https://mixpanel.com",
      thumbnail: "📈",
      isPaid: true,
      rating: 4.3,
      tags: {
        ko: ["이벤트분석", "사용자추적", "분석", "빅데이터분석", "사용자행동분석", "프로덕트애널리틱스", "앱분석", "컨버전분석", "코호트분석", "AB테스트", "제품인사이트", "마코프분석", "성장해킹", "리텔션분석"],
        en: ["Event Analytics", "User Tracking", "Analytics", "Big Data Analytics", "User Behavior Analytics", "Product Analytics", "App Analytics", "Conversion Analytics", "Cohort Analysis", "A/B Testing", "Product Insights", "Funnel Analysis", "Growth Hacking", "Retention Analysis"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "buffer",
      category: "analytics-marketing",
      name: {
        ko: "Buffer",
        en: "Buffer"
      },
      description: {
        ko: "소셜미디어 콘텐츠 스케줄링 도구",
        en: "Social media content scheduling tool"
      },
      url: "https://buffer.com",
      thumbnail: "📅",
      isPaid: true,
      rating: 4.2,
      tags: {
        ko: ["소셜미디어", "스케줄링", "콘텐츠", "소셜미디어스케줄러", "콘텐츠발행", "포스트예약", "소셜미디어기획", "브랜드관리", "콘텐츠전략", "소셜미디어컴팩니", "영향력마케팅", "커뮤니티관리", "소셜대시보드", "크로스포스팅"],
        en: ["Social Media", "Scheduling", "Content", "Social Media Scheduler", "Content Publishing", "Post Scheduling", "Social Media Planning", "Brand Management", "Content Strategy", "Social Media Campaign", "Influencer Marketing", "Community Management", "Social Dashboard", "Cross Posting"]
      },
      regions: ["kr", "global"]
    },

    // Content Creation (8개)
    {
      id: "youtube",
      category: "content-creation",
      name: {
        ko: "YouTube",
        en: "YouTube"
      },
      description: {
        ko: "동영상 공유 및 크리에이터 플랫폼",
        en: "Video sharing and creator platform"
      },
      url: "https://www.youtube.com",
      thumbnail: "📹",
      isPaid: false,
      rating: 4.7,
      tags: {
        ko: ["동영상", "크리에이터", "스트리밍", "동영상공유", "유튜버", "콘텐츠제작", "온라인방송", "로그", "교육영상", "엔터테인먼트", "비즈니스마케팅", "브이로그", "소셜미디어마케팅", "예술공유", "컴뮤니티플랫폼"],
        en: ["Video", "Creator", "Streaming", "Video Sharing", "YouTuber", "Content Creation", "Online Broadcasting", "Vlog", "Educational Videos", "Entertainment", "Business Marketing", "Vlogging", "Social Media Marketing", "Art Sharing", "Community Platform"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "adobe-premiere",
      category: "content-creation",
      name: {
        ko: "Adobe Premiere Pro",
        en: "Adobe Premiere Pro"
      },
      description: {
        ko: "전문 동영상 편집 소프트웨어",
        en: "Professional video editing software"
      },
      url: "https://www.adobe.com/products/premiere.html",
      thumbnail: "🎬",
      isPaid: true,
      rating: 4.5,
      tags: {
        ko: ["동영상편집", "전문", "Adobe", "프로편집", "비디오에디터", "Adobe프리미어", "영상편집소프트웨어", "영상효과", "영상제작", "영상자르기", "영상합치기", "색보정", "오디오편집", "대한미디어", "영상전문가"],
        en: ["Video Editing", "Professional", "Adobe", "Pro Editing", "Video Editor", "Adobe Premiere", "Video Editing Software", "Video Effects", "Video Production", "Video Cutting", "Video Merging", "Color Grading", "Audio Editing", "Broadcast Media", "Video Professional"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "davinci-resolve",
      category: "content-creation",
      name: {
        ko: "DaVinci Resolve",
        en: "DaVinci Resolve"
      },
      description: {
        ko: "무료 전문 동영상 편집 및 컬러 그레이딩",
        en: "Free professional video editing and color grading"
      },
      url: "https://www.blackmagicdesign.com/products/davinciresolve",
      thumbnail: "🎨",
      isPaid: false,
      rating: 4.6,
      tags: {
        ko: ["동영상편집", "컬러그레이딩", "무료", "무료비디오편집", "다빈치리졸브", "전문영상편집", "블랙매직", "협레잡영상편집", "오픈소스비디오", "4K비디오편집", "영상효과", "동영상자르기", "영상배경바꾸기", "예술영상편집"],
        en: ["Video Editing", "Color Grading", "Free", "Free Video Editing", "DaVinci Resolve", "Professional Video Editing", "Blackmagic", "Broadcast Video Editing", "Open Source Video", "4K Video Editing", "Video Effects", "Video Cutting", "Background Change", "Artistic Video Editing"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "obs-studio",
      category: "content-creation",
      name: {
        ko: "OBS Studio",
        en: "OBS Studio"
      },
      description: {
        ko: "무료 스트리밍 및 화면 녹화 소프트웨어",
        en: "Free streaming and screen recording software"
      },
      url: "https://obsproject.com",
      thumbnail: "📺",
      isPaid: false,
      rating: 4.4,
      tags: {
        ko: ["스트리밍", "녹화", "라이브", "방송소프트웨어", "화면녹화", "게임방송", "온라인방송", "라이브스트리밍", "OBS스튜디오", "무료방송도구", "오프라인녹화", "영상자료", "대한미디어방송", "유튜브방송", "트위치방송"],
        en: ["Streaming", "Recording", "Live", "Broadcasting Software", "Screen Recording", "Game Streaming", "Online Broadcasting", "Live Streaming", "OBS Studio", "Free Broadcasting Tool", "Offline Recording", "Video Materials", "Broadcast Media", "YouTube Streaming", "Twitch Streaming"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "audacity",
      category: "content-creation",
      name: {
        ko: "Audacity",
        en: "Audacity"
      },
      description: {
        ko: "무료 오디오 편집 소프트웨어",
        en: "Free audio editing software"
      },
      url: "https://www.audacityteam.org",
      thumbnail: "🎵",
      isPaid: false,
      rating: 4.3,
      tags: {
        ko: ["오디오편집", "팟캐스트", "무료", "음성편집", "소리편집", "음악작업", "음성녹음", "무료에디터", "오디시티", "음성효과", "음성노이즈제거", "음성배경기", "라디오제작", "내레이션", "음성녹화"],
        en: ["Audio Editing", "Podcast", "Free", "Voice Editing", "Sound Editing", "Music Production", "Audio Recording", "Free Editor", "Audacity", "Audio Effects", "Noise Removal", "Audio Background", "Radio Production", "Narration", "Voice Recording"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "loom",
      category: "content-creation",
      name: {
        ko: "Loom",
        en: "Loom"
      },
      description: {
        ko: "화면 녹화 및 영상 메시지 도구",
        en: "Screen recording and video messaging tool"
      },
      url: "https://www.loom.com",
      thumbnail: "bi-camera-video",
      isPaid: true,
      rating: 4.5,
      tags: {
        ko: ["화면녹화", "영상메시지", "교육", "화면공유", "룸앱", "비디오커뮤니케이션", "온라인학습", "튜토리얼제작", "업무메시지", "시연녹화", "프레젠테이션녹화", "강의녹화", "오프라인커뮤니케이션", "비대면소통", "전문강의"],
        en: ["Screen Recording", "Video Message", "Education", "Screen Sharing", "Loom App", "Video Communication", "Online Learning", "Tutorial Creation", "Work Message", "Demo Recording", "Presentation Recording", "Lecture Recording", "Offline Communication", "Non-face Communication", "Professional Lectures"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "tiktok",
      category: "content-creation",
      name: {
        ko: "TikTok",
        en: "TikTok"
      },
      description: {
        ko: "짧은 동영상 공유 플랫폼",
        en: "Short video sharing platform"
      },
      url: "https://www.tiktok.com",
      thumbnail: "🎵",
      isPaid: false,
      rating: 4.2,
      tags: {
        ko: ["숏폼", "소셜미디어", "엔터테인먼트", "숏폼비디오", "틱톡영상", "짧은동영상", "바이럴비디오", "소셜미디어콘텐츠", "모바일비디오", "트렌드영상", "인플루언서마케팅", "챙영상", "대중문화", "사용자제작콘텐츠", "바이럴컨텐츠"],
        en: ["Short Form", "Social Media", "Entertainment", "Short Form Video", "TikTok Video", "Short Videos", "Viral Videos", "Social Media Content", "Mobile Video", "Trend Videos", "Influencer Marketing", "Challenge Videos", "Pop Culture", "User Generated Content", "Viral Content"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "twitch",
      category: "content-creation",
      name: {
        ko: "Twitch",
        en: "Twitch"
      },
      description: {
        ko: "게임 및 라이브 스트리밍 플랫폼",
        en: "Gaming and live streaming platform"
      },
      url: "https://www.twitch.tv",
      thumbnail: "🎮",
      isPaid: false,
      rating: 4.1,
      tags: {
        ko: ["스트리밍", "게임", "라이브", "게임방송", "라이브스트리밍", "게이머방송", "오락스트리밍", "엠빜", "게임커뮤니티", "전자스포츠", "esports", "게임컴팩니", "라이브게임", "스트리머", "인플루언서게이밍"],
        en: ["Streaming", "Gaming", "Live", "Game Broadcasting", "Live Streaming", "Gamer Broadcasting", "Twitch Streaming", "Twitch", "Gaming Community", "Esports", "Esports", "Game Campaign", "Live Gaming", "Streamer", "Influencer Gaming"]
      },
      regions: ["kr", "global"]
    },

    // Learning & Skills (8개)
    {
      id: "coursera",
      category: "learning-skills",
      name: {
        ko: "Coursera",
        en: "Coursera"
      },
      description: {
        ko: "세계 유명 대학의 온라인 강의 플랫폼",
        en: "Online courses from top universities worldwide"
      },
      url: "https://www.coursera.org",
      thumbnail: "🎓",
      isPaid: true,
      rating: 4.6,
      tags: {
        ko: ["온라인강의", "대학", "인증", "온라인교육", "고등교육", "대학강의", "전문강의", "스타퍼드대학", "아이비리그", "취업교육", "전문스킬", "학위과정", "MOOC", "전문자격증", "학습참여증"],
        en: ["Online Course", "University", "Certification", "Online Education", "Higher Education", "University Lecture", "Professional Course", "Stanford University", "Ivy League", "Career Education", "Professional Skills", "Degree Program", "MOOC", "Professional Certification", "Participation Certificate"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "udemy",
      category: "learning-skills",
      name: {
        ko: "Udemy",
        en: "Udemy"
      },
      description: {
        ko: "실무 중심의 온라인 강의 마켓플레이스",
        en: "Practical online course marketplace"
      },
      url: "https://www.udemy.com",
      thumbnail: "📚",
      isPaid: true,
      rating: 4.4,
      tags: {
        ko: ["실무강의", "기술", "자격증", "온라인강의마켓플레이스", "비즈니스강의", "직업교육", "마케팅강의", "프로그래밍강의", "디자인강의", "사이드프로젝트", "전문개발", "취업준비", "기술스택", "실전경험", "캐리어전환"],
        en: ["Practical Course", "Technology", "Certification", "Online Course Marketplace", "Business Course", "Vocational Training", "Marketing Course", "Programming Course", "Design Course", "Side Project", "Professional Development", "Job Preparation", "Tech Stack", "Real Experience", "Career Change"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "khan-academy",
      category: "learning-skills",
      name: {
        ko: "Khan Academy",
        en: "Khan Academy"
      },
      description: {
        ko: "무료 교육 콘텐츠 플랫폼",
        en: "Free educational content platform"
      },
      url: "https://www.khanacademy.org",
      thumbnail: "🏫",
      isPaid: false,
      rating: 4.7,
      tags: {
        ko: ["무료교육", "수학", "과학", "칸아카데미", "무료온라인강의", "초중고교육", "기초교육", "학습지원", "개인맞춤학습", "인터랙티브학습", "언어학습", "역사학습", "컴퓨터과학", "예술교육", "학습진단"],
        en: ["Free Education", "Mathematics", "Science", "Khan Academy", "Free Online Course", "K-12 Education", "Basic Education", "Learning Support", "Personalized Learning", "Interactive Learning", "Language Learning", "History Learning", "Computer Science", "Art Education", "Learning Assessment"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "duolingo",
      category: "learning-skills",
      name: {
        ko: "Duolingo",
        en: "Duolingo"
      },
      description: {
        ko: "게임화된 언어 학습 앱",
        en: "Gamified language learning app"
      },
      url: "https://www.duolingo.com",
      thumbnail: "🦜",
      isPaid: true,
      rating: 4.5,
      tags: {
        ko: ["언어학습", "게임화", "모바일", "언어교환", "외국어학습", "두오링고", "영어학습", "중국어학습", "일본어학습", "토이플대비", "비즈니스영어", "대화형학습", "발음교정", "문법학습", "언어공부앱"],
        en: ["Language Learning", "Gamification", "Mobile", "Language Exchange", "Foreign Language", "Duolingo", "English Learning", "Chinese Learning", "Japanese Learning", "TOEFL Prep", "Business English", "Conversational Learning", "Pronunciation Training", "Grammar Learning", "Language Study App"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "codecademy",
      category: "learning-skills",
      name: {
        ko: "Codecademy",
        en: "Codecademy"
      },
      description: {
        ko: "인터랙티브 코딩 교육 플랫폼",
        en: "Interactive coding education platform"
      },
      url: "https://www.codecademy.com",
      thumbnail: "💻",
      isPaid: true,
      rating: 4.3,
      tags: {
        ko: ["코딩교육", "프로그래밍", "인터랙티브", "코드아카데미", "인터랙티브코딩", "웹개발교육", "Python학습", "JavaScript학습", "오라인코딩부트캐프", "초보자코딩", "HTML/CSS학습", "데이터과학교육", "컴퓨터과학기초", "개발자취업준비", "실전코딩"],
        en: ["Coding Education", "Programming", "Interactive", "Codecademy", "Interactive Coding", "Web Development Education", "Python Learning", "JavaScript Learning", "Online Coding Bootcamp", "Beginner Coding", "HTML/CSS Learning", "Data Science Education", "Computer Science Basics", "Developer Job Prep", "Practical Coding"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "linkedin-learning",
      category: "learning-skills",
      name: {
        ko: "LinkedIn Learning",
        en: "LinkedIn Learning"
      },
      description: {
        ko: "비즈니스 및 기술 스킬 교육 플랫폼",
        en: "Business and technology skills learning platform"
      },
      url: "https://www.linkedin.com/learning",
      thumbnail: "💼",
      isPaid: true,
      rating: 4.4,
      tags: {
        ko: ["비즈니스", "기술스킬", "LinkedIn", "비즈니스교육", "전문개발", "리더십훈련", "마케팅교육", "네트워킹", "캐리어개발", "업무효율성", "소프트스킬", "기업교육", "상사과정", "기술업데이트", "전문가네트워킹"],
        en: ["Business", "Technical Skills", "LinkedIn", "Business Education", "Professional Development", "Leadership Training", "Marketing Education", "Networking", "Career Development", "Work Efficiency", "Soft Skills", "Corporate Training", "Corporate Course", "Technical Update", "Professional Networking"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "masterclass",
      category: "learning-skills",
      name: {
        ko: "MasterClass",
        en: "MasterClass"
      },
      description: {
        ko: "전문가들의 프리미엄 온라인 클래스",
        en: "Premium online classes from experts"
      },
      url: "https://www.masterclass.com",
      thumbnail: "⭐",
      isPaid: true,
      rating: 4.5,
      tags: {
        ko: ["전문가", "프리미엄", "창의성", "전문가강의", "마스터클래스", "예술강의", "캐리어강의", "라이프스킬", "리더십강의", "인생지도", "성공멘토링", "창작기법", "예술가강의", "비즈니스강의", "할리우드마스터"],
        en: ["Expert", "Premium", "Creativity", "Expert Lectures", "MasterClass", "Art Lectures", "Career Lectures", "Life Skills", "Leadership Lectures", "Life Guidance", "Success Mentoring", "Creative Writing", "Artist Lectures", "Business Lectures", "Hollywood Master"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "skillshare",
      category: "learning-skills",
      name: {
        ko: "Skillshare",
        en: "Skillshare"
      },
      description: {
        ko: "창의적 스킬 중심의 온라인 학습 커뮤니티",
        en: "Creative skills online learning community"
      },
      url: "https://www.skillshare.com",
      thumbnail: "🎨",
      isPaid: true,
      rating: 4.2,
      tags: {
        ko: ["창의성", "디자인", "커뮤니티", "크리에이티브스킬", "디자인교육", "예술교육", "스킬셰어", "일러스트레이션교육", "사진강의", "마케팅디자인", "브랜드디자인", "영상제작강의", "포트폴리오제작", "충창스킬", "창작커뮤니티"],
        en: ["Creativity", "Design", "Community", "Creative Skills", "Design Education", "Art Education", "Skillshare", "Illustration Education", "Photography Course", "Marketing Design", "Brand Design", "Video Production Course", "Portfolio Creation", "Creative Skills", "Creative Community"]
      },
      regions: ["kr", "global"]
    },

    // Productivity & Collaboration (8개)
    {
      id: "notion",
      category: "productivity",
      name: {
        ko: "Notion",
        en: "Notion"
      },
      description: {
        ko: "올인원 워크스페이스 및 생산성 도구",
        en: "All-in-one workspace and productivity tool"
      },
      url: "https://www.notion.so",
      thumbnail: "📝",
      isPaid: true,
      rating: 4.7,
      tags: {
        ko: ["워크스페이스", "노트", "협업"],
        en: ["Workspace", "Notes", "Collaboration"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "slack",
      category: "productivity",
      name: {
        ko: "Slack",
        en: "Slack"
      },
      description: {
        ko: "팀 커뮤니케이션 및 협업 플랫폼",
        en: "Team communication and collaboration platform"
      },
      url: "https://slack.com",
      thumbnail: "💬",
      isPaid: true,
      rating: 4.5,
      tags: {
        ko: ["팀커뮤니케이션", "협업", "메신저"],
        en: ["Team Communication", "Collaboration", "Messenger"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "trello",
      category: "productivity",
      name: {
        ko: "Trello",
        en: "Trello"
      },
      description: {
        ko: "칸반 보드 기반 프로젝트 관리 도구",
        en: "Kanban board-based project management tool"
      },
      url: "https://trello.com",
      thumbnail: "📋",
      isPaid: true,
      rating: 4.4,
      tags: {
        ko: ["프로젝트관리", "칸반", "할일관리"],
        en: ["Project Management", "Kanban", "Task Management"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "asana",
      category: "productivity",
      name: {
        ko: "Asana",
        en: "Asana"
      },
      description: {
        ko: "팀 프로젝트 관리 및 업무 추적 도구",
        en: "Team project management and task tracking tool"
      },
      url: "https://asana.com",
      thumbnail: "bi-graph-up",
      isPaid: true,
      rating: 4.3,
      tags: {
        ko: ["프로젝트관리", "팀협업", "업무추적"],
        en: ["Project Management", "Team Collaboration", "Task Tracking"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "monday",
      category: "productivity",
      name: {
        ko: "Monday.com",
        en: "Monday.com"
      },
      description: {
        ko: "시각적 프로젝트 관리 플랫폼",
        en: "Visual project management platform"
      },
      url: "https://monday.com",
      thumbnail: "📅",
      isPaid: true,
      rating: 4.4,
      tags: {
        ko: ["프로젝트관리", "시각적", "워크플로우"],
        en: ["Project Management", "Visual", "Workflow"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "zoom",
      category: "productivity",
      name: {
        ko: "Zoom",
        en: "Zoom"
      },
      description: {
        ko: "화상 회의 및 웨비나 플랫폼",
        en: "Video conferencing and webinar platform"
      },
      url: "https://zoom.us",
      thumbnail: "📹",
      isPaid: true,
      rating: 4.2,
      tags: {
        ko: ["화상회의", "웨비나", "원격근무"],
        en: ["Video Conference", "Webinar", "Remote Work"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "microsoft-teams",
      category: "productivity",
      name: {
        ko: "Microsoft Teams",
        en: "Microsoft Teams"
      },
      description: {
        ko: "Microsoft의 팀 협업 및 커뮤니케이션 플랫폼",
        en: "Microsoft's team collaboration and communication platform"
      },
      url: "https://www.microsoft.com/microsoft-teams",
      thumbnail: "🔷",
      isPaid: true,
      rating: 4.1,
      tags: {
        ko: ["팀협업", "Microsoft", "Office365"],
        en: ["Team Collaboration", "Microsoft", "Office365"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "google-workspace",
      category: "productivity",
      name: {
        ko: "Google Workspace",
        en: "Google Workspace"
      },
      description: {
        ko: "Google의 클라우드 기반 생산성 도구 모음",
        en: "Google's cloud-based productivity suite"
      },
      url: "https://workspace.google.com",
      thumbnail: "🔵",
      isPaid: true,
      rating: 4.5,
      tags: {
        ko: ["클라우드", "생산성", "Google"],
        en: ["Cloud", "Productivity", "Google"]
      },
      regions: ["kr", "global"]
    },

    // Developer Tools (8개)
    {
      id: "docker",
      category: "developer",
      name: {
        ko: "Docker",
        en: "Docker"
      },
      description: {
        ko: "컨테이너 기반 가상화 플랫폼",
        en: "Container-based virtualization platform"
      },
      url: "https://www.docker.com",
      thumbnail: "🐳",
      isPaid: true,
      rating: 4.6,
      tags: {
        ko: ["컨테이너", "가상화", "DevOps"],
        en: ["Container", "Virtualization", "DevOps"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "aws",
      category: "developer",
      name: {
        ko: "Amazon Web Services",
        en: "Amazon Web Services"
      },
      description: {
        ko: "아마존의 클라우드 컴퓨팅 서비스",
        en: "Amazon's cloud computing services"
      },
      url: "https://aws.amazon.com",
      thumbnail: "☁️",
      isPaid: true,
      rating: 4.5,
      tags: {
        ko: ["클라우드", "AWS", "인프라"],
        en: ["Cloud", "AWS", "Infrastructure"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "firebase",
      category: "developer",
      name: {
        ko: "Firebase",
        en: "Firebase"
      },
      description: {
        ko: "Google의 앱 개발 플랫폼",
        en: "Google's app development platform"
      },
      url: "https://firebase.google.com",
      thumbnail: "🔥",
      isPaid: true,
      rating: 4.4,
      tags: {
        ko: ["백엔드", "실시간DB", "Google"],
        en: ["Backend", "Real-time DB", "Google"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "heroku",
      category: "developer",
      name: {
        ko: "Heroku",
        en: "Heroku"
      },
      description: {
        ko: "간단한 앱 배포 및 호스팅 플랫폼",
        en: "Simple app deployment and hosting platform"
      },
      url: "https://www.heroku.com",
      thumbnail: "💜",
      isPaid: true,
      rating: 4.2,
      tags: {
        ko: ["배포", "호스팅", "PaaS"],
        en: ["Deployment", "Hosting", "PaaS"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "mongodb",
      category: "developer",
      name: {
        ko: "MongoDB",
        en: "MongoDB"
      },
      description: {
        ko: "NoSQL 문서 지향 데이터베이스",
        en: "NoSQL document-oriented database"
      },
      url: "https://www.mongodb.com",
      thumbnail: "🍃",
      isPaid: true,
      rating: 4.3,
      tags: {
        ko: ["NoSQL", "데이터베이스", "문서DB"],
        en: ["NoSQL", "Database", "Document DB"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "redis",
      category: "developer",
      name: {
        ko: "Redis",
        en: "Redis"
      },
      description: {
        ko: "인메모리 데이터 구조 저장소",
        en: "In-memory data structure store"
      },
      url: "https://redis.io",
      thumbnail: "🔴",
      isPaid: false,
      rating: 4.5,
      tags: {
        ko: ["캐시", "인메모리", "키-값"],
        en: ["Cache", "In-Memory", "Key-Value"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "jenkins",
      category: "developer",
      name: {
        ko: "Jenkins",
        en: "Jenkins"
      },
      description: {
        ko: "CI/CD 자동화 서버",
        en: "CI/CD automation server"
      },
      url: "https://www.jenkins.io",
      thumbnail: "🔧",
      isPaid: false,
      rating: 4.1,
      tags: {
        ko: ["CI/CD", "자동화", "빌드"],
        en: ["CI/CD", "Automation", "Build"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "kubernetes",
      category: "developer",
      name: {
        ko: "Kubernetes",
        en: "Kubernetes"
      },
      description: {
        ko: "컨테이너 오케스트레이션 플랫폼",
        en: "Container orchestration platform"
      },
      url: "https://kubernetes.io",
      thumbnail: "⚙️",
      isPaid: false,
      rating: 4.4,
      tags: {
        ko: ["컨테이너", "오케스트레이션", "클러스터"],
        en: ["Container", "Orchestration", "Cluster"]
      },
      regions: ["kr", "global"]
    },

    // Startup & Business (8개)
    {
      id: "stripe",
      category: "startup-business",
      name: {
        ko: "Stripe",
        en: "Stripe"
      },
      description: {
        ko: "온라인 결제 처리 플랫폼",
        en: "Online payment processing platform"
      },
      url: "https://stripe.com",
      thumbnail: "💳",
      isPaid: false,
      rating: 4.6,
      tags: {
        ko: ["결제", "전자상거래", "API", "온라인결제", "결제시스템", "전자결제", "온라인쇼핑결제", "신용카드결제", "모바일결제", "결제게이트웨이", "전자상거래솔루션", "결제처리", "비즈니스결제", "스트라이프결제", "온라인비즈니스"],
        en: ["Payment", "E-commerce", "API"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "shopify",
      category: "startup-business",
      name: {
        ko: "Shopify",
        en: "Shopify"
      },
      description: {
        ko: "전자상거래 웹사이트 구축 플랫폼",
        en: "E-commerce website building platform"
      },
      url: "https://www.shopify.com",
      thumbnail: "🛒",
      isPaid: true,
      rating: 4.4,
      tags: {
        ko: ["전자상거래", "온라인쇼핑몰", "드롭쉽핑"],
        en: ["E-commerce", "Online Store", "Dropshipping"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "typeform",
      category: "startup-business",
      name: {
        ko: "Typeform",
        en: "Typeform"
      },
      description: {
        ko: "인터랙티브 설문조사 및 폼 빌더",
        en: "Interactive survey and form builder"
      },
      url: "https://www.typeform.com",
      thumbnail: "📋",
      isPaid: true,
      rating: 4.3,
      tags: {
        ko: ["설문조사", "폼", "데이터수집"],
        en: ["Survey", "Form", "Data Collection"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "airtable",
      category: "startup-business",
      name: {
        ko: "Airtable",
        en: "Airtable"
      },
      description: {
        ko: "스프레드시트와 데이터베이스의 결합",
        en: "Combination of spreadsheet and database"
      },
      url: "https://airtable.com",
      thumbnail: "🗂️",
      isPaid: true,
      rating: 4.4,
      tags: {
        ko: ["데이터베이스", "스프레드시트", "협업"],
        en: ["Database", "Spreadsheet", "Collaboration"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "intercom",
      category: "startup-business",
      name: {
        ko: "Intercom",
        en: "Intercom"
      },
      description: {
        ko: "고객 소통 및 지원 플랫폼",
        en: "Customer communication and support platform"
      },
      url: "https://www.intercom.com",
      thumbnail: "💬",
      isPaid: true,
      rating: 4.2,
      tags: {
        ko: ["고객지원", "채팅", "CRM"],
        en: ["Customer Support", "Chat", "CRM"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "calendly",
      category: "startup-business",
      name: {
        ko: "Calendly",
        en: "Calendly"
      },
      description: {
        ko: "자동 일정 예약 및 조율 도구",
        en: "Automated scheduling and appointment tool"
      },
      url: "https://calendly.com",
      thumbnail: "📅",
      isPaid: true,
      rating: 4.5,
      tags: {
        ko: ["일정관리", "예약", "미팅"],
        en: ["Schedule Management", "Booking", "Meeting"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "quickbooks",
      category: "startup-business",
      name: {
        ko: "QuickBooks",
        en: "QuickBooks"
      },
      description: {
        ko: "소기업을 위한 회계 소프트웨어",
        en: "Accounting software for small businesses"
      },
      url: "https://quickbooks.intuit.com",
      thumbnail: "bi-graph-up",
      isPaid: true,
      rating: 4.3,
      tags: {
        ko: ["회계", "재정관리", "소기업"],
        en: ["Accounting", "Financial Management", "Small Business"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "docusign",
      category: "startup-business",
      name: {
        ko: "DocuSign",
        en: "DocuSign"
      },
      description: {
        ko: "전자 서명 및 문서 관리 플랫폼",
        en: "Electronic signature and document management platform"
      },
      url: "https://www.docusign.com",
      thumbnail: "✍️",
      isPaid: true,
      rating: 4.4,
      tags: {
        ko: ["전자서명", "계약", "문서관리"],
        en: ["Electronic Signature", "Contract", "Document Management"]
      },
      regions: ["kr", "global"]
    },

    // Trends & Inspiration (8개)
    {
      id: "pinterest",
      category: "trends-inspiration",
      name: {
        ko: "Pinterest",
        en: "Pinterest"
      },
      description: {
        ko: "비주얼 발견 및 영감 플랫폼",
        en: "Visual discovery and inspiration platform"
      },
      url: "https://www.pinterest.com",
      thumbnail: "📌",
      isPaid: false,
      rating: 4.5,
      tags: {
        ko: ["영감", "시각적", "아이디어"],
        en: ["Inspiration", "Visual", "Ideas"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "awwwards",
      category: "trends-inspiration",
      name: {
        ko: "Awwwards",
        en: "Awwwards"
      },
      description: {
        ko: "웹 디자인 어워드 및 영감 사이트",
        en: "Web design awards and inspiration site"
      },
      url: "https://www.awwwards.com",
      thumbnail: "🏆",
      isPaid: true,
      rating: 4.6,
      tags: {
        ko: ["웹디자인", "어워드", "영감"],
        en: ["Web Design", "Awards", "Inspiration"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "designspiration",
      category: "trends-inspiration",
      name: {
        ko: "Designspiration",
        en: "Designspiration"
      },
      description: {
        ko: "디자인 영감 및 아이디어 컬렉션",
        en: "Design inspiration and idea collection"
      },
      url: "https://www.designspiration.com",
      thumbnail: "✨",
      isPaid: false,
      rating: 4.3,
      tags: {
        ko: ["디자인영감", "컬렉션", "창의성"],
        en: ["Design Inspiration", "Collection", "Creativity"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "muzli",
      category: "trends-inspiration",
      name: {
        ko: "Muzli",
        en: "Muzli"
      },
      description: {
        ko: "디자이너를 위한 일일 영감 및 트렌드",
        en: "Daily inspiration and trends for designers"
      },
      url: "https://muz.li",
      thumbnail: "🎨",
      isPaid: false,
      rating: 4.4,
      tags: {
        ko: ["디자인트렌드", "영감", "뉴스레터"],
        en: ["Design Trends", "Inspiration", "Newsletter"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "product-hunt",
      category: "trends-inspiration",
      name: {
        ko: "Product Hunt",
        en: "Product Hunt"
      },
      description: {
        ko: "새로운 제품 발견 및 트렌드 플랫폼",
        en: "New product discovery and trends platform"
      },
      url: "https://www.producthunt.com",
      thumbnail: "🚀",
      isPaid: false,
      rating: 4.2,
      tags: {
        ko: ["제품런칭", "스타트업", "트렌드"],
        en: ["Product Launch", "Startup", "Trends"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "mobbin",
      category: "trends-inspiration",
      name: {
        ko: "Mobbin",
        en: "Mobbin"
      },
      description: {
        ko: "모바일 앱 UI 디자인 참고 자료",
        en: "Mobile app UI design reference library"
      },
      url: "https://mobbin.com",
      thumbnail: "📱",
      isPaid: true,
      rating: 4.5,
      tags: {
        ko: ["모바일UI", "앱디자인", "레퍼런스"],
        en: ["Mobile UI", "App Design", "Reference"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "css-design-awards",
      category: "trends-inspiration",
      name: {
        ko: "CSS Design Awards",
        en: "CSS Design Awards"
      },
      description: {
        ko: "웹 디자인 및 개발 어워드 사이트",
        en: "Web design and development awards site"
      },
      url: "https://www.cssdesignawards.com",
      thumbnail: "🏅",
      isPaid: false,
      rating: 4.1,
      tags: {
        ko: ["CSS", "웹디자인", "어워드"],
        en: ["CSS", "Web Design", "Awards"]
      },
      regions: ["kr", "global"]
    },
    {
      id: "siteinspire",
      category: "trends-inspiration",
      name: {
        ko: "SiteInspire",
        en: "SiteInspire"
      },
      description: {
        ko: "웹사이트 디자인 영감 갤러리",
        en: "Website design inspiration gallery"
      },
      url: "https://www.siteinspire.com",
      thumbnail: "🌟",
      isPaid: false,
      rating: 4.0,
      tags: {
        ko: ["웹사이트", "디자인갤러리", "영감"],
        en: ["Website", "Design Gallery", "Inspiration"]
      },
      regions: ["kr", "global"]
    }
  ]
};