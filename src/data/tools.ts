import { Tool } from '@/types/tool'

export const tools: Tool[] = [
  // Generator 도구 (생성 도구)
  {
    id: 'qr-generator',
    category: 'generator',
    regions: ['kr', 'global'],
    name: { ko: 'QR 코드 생성기', en: 'QR Code Generator' },
    description: { 
      ko: 'URL, 텍스트를 QR코드로 변환',
      en: 'Convert URL, text to QR code'
    },
    keywords: { 
      ko: 'QR코드, 바코드, 생성기',
      en: 'QR code, generator, convert'
    },
    icon: '📱',
    component: 'QRGenerator'
  },
  {
    id: 'password-generator',
    category: 'generator',
    regions: ['kr', 'global'],
    name: { ko: '비밀번호 생성기', en: 'Password Generator' },
    description: { 
      ko: '강력한 암호 비밀번호 생성',
      en: 'Generate secure random passwords'
    },
    keywords: { 
      ko: '비밀번호생성, 보안암호, 랜덤',
      en: 'password generator, secure, random'
    },
    icon: '🔒',
    component: 'PasswordGenerator'
  },
  {
    id: 'uuid-generator',
    category: 'generator',
    regions: ['kr', 'global'],
    name: { ko: 'UUID 생성기', en: 'UUID Generator' },
    description: { 
      ko: '고유 식별자 UUID 생성',
      en: 'Generate unique identifier UUID'
    },
    keywords: { 
      ko: 'UUID, GUID, 고유식별자, 개발자',
      en: 'UUID, GUID, unique identifier, developer'
    },
    icon: '🆔',
    component: 'UUIDGenerator'
  },
  {
    id: 'lorem-generator',
    category: 'generator',
    regions: ['kr', 'global'],
    name: { ko: 'Lorem Ipsum 생성기', en: 'Lorem Ipsum Generator' },
    description: { 
      ko: '더미 텍스트 Lorem Ipsum 생성',
      en: 'Generate Lorem Ipsum dummy text'
    },
    keywords: { 
      ko: 'Lorem Ipsum, 더미텍스트, 임시텍스트',
      en: 'lorem ipsum, dummy text, placeholder'
    },
    icon: '📝',
    component: 'LoremGenerator'
  },

  // Converter 도구 (변환 도구)
  {
    id: 'korean-name-converter',
    category: 'converter',
    regions: ['kr'],
    name: { ko: '한국 이름 로마자 변환기', en: 'Korean Name Romanizer' },
    description: { 
      ko: '한글 이름을 로마자로 변환',
      en: 'Convert Korean names to Roman letters'
    },
    keywords: { 
      ko: '한글, 로마자, 이름변환, 여권',
      en: 'korean, romanize, name, passport'
    },
    icon: '🏷️',
    component: 'KoreanNameConverter'
  },
  {
    id: 'pdf-converter',
    category: 'converter',
    regions: ['kr', 'global'],
    name: { ko: 'PDF 변환기', en: 'PDF Converter' },
    description: { 
      ko: 'PDF 파일 변환, 병합, 분할',
      en: 'Convert, merge, split PDF files'
    },
    keywords: { 
      ko: 'PDF변환, 파일변환, 병합',
      en: 'pdf convert, file converter, merge'
    },
    icon: '📄',
    component: 'PDFConverter'
  },
  {
    id: 'color-converter',
    category: 'converter',
    regions: ['kr', 'global'],
    name: { ko: '컬러 변환기', en: 'Color Converter' },
    description: { 
      ko: 'RGB, HEX, HSL 컬러 변환',
      en: 'Convert RGB, HEX, HSL colors'
    },
    keywords: { 
      ko: '컬러변환, RGB, HEX, 색상코드',
      en: 'color convert, RGB, HEX, color code'
    },
    icon: '🎨',
    component: 'ColorConverter'
  },
  {
    id: 'base64-converter',
    category: 'converter',
    regions: ['kr', 'global'],
    name: { ko: 'Base64 인코딩/디코딩', en: 'Base64 Encoder/Decoder' },
    description: { 
      ko: '텍스트를 Base64로 인코딩/디코딩',
      en: 'Encode/decode text to/from Base64'
    },
    keywords: { 
      ko: 'Base64, 인코딩, 디코딩, 개발자',
      en: 'base64, encode, decode, developer'
    },
    icon: '🔀',
    component: 'Base64Converter'
  },

  // Validator 도구 (검증 도구)
  {
    id: 'resident-number-validator',
    category: 'validator',
    regions: ['kr'],
    name: { ko: '주민등록번호 검증기', en: 'Korean Resident Number Validator' },
    description: { 
      ko: '주민등록번호 유효성 검증',
      en: 'Validate Korean resident registration number'
    },
    keywords: { 
      ko: '주민등록번호, 검증, 유효성검사',
      en: 'korean resident number, validate, check'
    },
    icon: '🆔',
    component: 'ResidentValidator'
  },
  {
    id: 'business-number-validator',
    category: 'validator',
    regions: ['kr'],
    name: { ko: '사업자등록번호 검증기', en: 'Korean Business Number Validator' },
    description: { 
      ko: '사업자등록번호 유효성 검증',
      en: 'Validate Korean business registration number'
    },
    keywords: { 
      ko: '사업자등록번호, 검증, 유효성검사',
      en: 'korean business number, validate, check'
    },
    icon: '🏢',
    component: 'BusinessValidator'
  },
  {
    id: 'email-validator',
    category: 'validator',
    regions: ['kr', 'global'],
    name: { ko: '이메일 검증기', en: 'Email Validator' },
    description: { 
      ko: '이메일 주소 형식 검증',
      en: 'Validate email format'
    },
    keywords: { 
      ko: '이메일검증, 형식검사, 확인',
      en: 'email validator, format check, verify'
    },
    icon: '✉️',
    component: 'EmailValidator'
  },
  {
    id: 'phone-validator',
    category: 'validator',
    regions: ['kr', 'global'],
    name: { ko: '전화번호 검증기', en: 'Phone Number Validator' },
    description: { 
      ko: '전화번호 형식 검증',
      en: 'Validate phone number format'
    },
    keywords: { 
      ko: '전화번호검증, 휴대폰번호, 확인',
      en: 'phone validator, mobile number, format'
    },
    icon: '📞',
    component: 'PhoneValidator'
  },

  // Analyzer 도구 (분석 도구)
  {
    id: 'vat-calculator',
    category: 'analyzer',
    regions: ['kr'],
    name: { ko: '부가세 계산기', en: 'VAT Calculator' },
    description: { 
      ko: '한국 부가세 (10%) 계산',
      en: 'Calculate Korean VAT (10%)'
    },
    keywords: { 
      ko: '부가세계산, VAT, 세금계산',
      en: 'vat calculator, tax, korean'
    },
    icon: '💰',
    component: 'VATCalculator'
  },
  {
    id: 'text-counter',
    category: 'analyzer',
    regions: ['kr', 'global'],
    name: { ko: '텍스트 카운터', en: 'Text Counter' },
    description: { 
      ko: '텍스트 글자, 단어, 문단 계산',
      en: 'Count characters, words, paragraphs'
    },
    keywords: { 
      ko: '텍스트카운터, 글자수, 텍스트분석',
      en: 'character count, word count, text analysis'
    },
    icon: '📊',
    component: 'TextCounter'
  },
  {
    id: 'age-calculator',
    category: 'analyzer',
    regions: ['kr', 'global'],
    name: { ko: '나이 계산기', en: 'Age Calculator' },
    description: { 
      ko: '생년월일로 정확한 나이 계산',
      en: 'Calculate exact age from birth date'
    },
    keywords: { 
      ko: '나이계산, 생년월일, 만나이',
      en: 'age calculator, birth date, exact age'
    },
    icon: '📅',
    component: 'AgeCalculator'
  },
  {
    id: 'unit-converter',
    category: 'analyzer',
    regions: ['kr', 'global'],
    name: { ko: '단위 변환기', en: 'Unit Converter' },
    description: { 
      ko: '길이, 무게, 온도, 면적 단위 변환',
      en: 'Convert length, weight, temperature, area units'
    },
    keywords: { 
      ko: '단위변환, 길이변환, 무게변환, 온도변환',
      en: 'unit converter, length, weight, temperature'
    },
    icon: '📏',
    component: 'UnitConverter'
  }
]