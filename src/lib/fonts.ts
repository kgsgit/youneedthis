import localFont from 'next/font/local'

export const kakaoSmallSans = localFont({
  src: [
    {
      path: '../../public/fonts/KakaoSmallSans-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/KakaoSmallSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/KakaoSmallSans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-kakao-small',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
  display: 'swap',
})

export const kakaoBigSans = localFont({
  src: [
    {
      path: '../../public/fonts/KakaoBigSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/KakaoBigSans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/KakaoBigSans-ExtraBold.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-kakao-big',
  fallback: ['KakaoSmallSans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
  display: 'swap',
})