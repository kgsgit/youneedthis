import type { Metadata } from 'next'
import ImageMosaicClient from './ImageMosaicClient'

// SEO 메타데이터 생성
export const metadata: Metadata = {
  title: '이미지 모자이크 도구 - YouNeedThis',
  description: '이미지에 모자이크 효과를 적용하여 개인정보나 민감한 부분을 안전하게 가려보세요. 픽셀화, 블러 효과 지원.',
  keywords: '모자이크, 픽셀화, 블러, 개인정보보호, 이미지편집, 얼굴가리기, 민감정보, 프라이버시, 이미지처리, 사진편집',
  alternates: {
    canonical: 'https://youneedthis.kr/tools/image-mosaic'
  },
  openGraph: {
    title: '이미지 모자이크 도구 - YouNeedThis',
    description: '이미지에 모자이크 효과를 적용하여 개인정보나 민감한 부분을 안전하게 가려보세요',
    url: 'https://youneedthis.kr/tools/image-mosaic',
    type: 'website',
    images: [{
      url: 'https://youneedthis.kr/images/logo_s.svg',
      width: 400,
      height: 400,
      alt: '이미지 모자이크 도구 - YouNeedThis'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: '이미지 모자이크 도구 - YouNeedThis',
    description: '이미지에 모자이크 효과를 적용하여 개인정보나 민감한 부분을 안전하게 가려보세요',
    images: ['https://youneedthis.kr/images/logo_s.svg']
  },
  robots: {
    index: true,
    follow: true
  }
}

export default function ImageMosaicPage() {
  return <ImageMosaicClient />
}