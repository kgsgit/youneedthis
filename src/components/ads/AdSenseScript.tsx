'use client'

import Script from 'next/script'

interface AdSenseScriptProps {
  adClientId?: string // Google AdSense 클라이언트 ID (예: ca-pub-xxxxxxxxxx)
}

export function AdSenseScript({ adClientId }: AdSenseScriptProps) {
  // AdSense ID가 없으면 렌더링하지 않음
  if (!adClientId) {
    return null
  }

  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <Script
        id="adsbygoogle-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (adsbygoogle = window.adsbygoogle || []).push({
              google_ad_client: "${adClientId}",
              enable_page_level_ads: true
            });
          `,
        }}
      />
    </>
  )
}