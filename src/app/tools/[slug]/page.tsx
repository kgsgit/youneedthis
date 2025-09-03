import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { siteConfig } from '@/config/site'
import ToolPageClient from './ToolPageClient'

interface ToolPageProps {
  params: Promise<{
    slug: string
  }>
}

// 메타데이터 생성 함수
export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params
  const tool = siteConfig.tools.find((t) => t.id === slug)
  
  if (!tool) {
    return {
      title: '도구를 찾을 수 없습니다',
      description: '요청하신 도구를 찾을 수 없습니다.'
    }
  }

  const title = typeof tool.name === 'string' ? tool.name : tool.name.ko
  const description = typeof tool.description === 'string' ? tool.description : tool.description.ko
  const keywords = typeof tool.keywords === 'string' ? tool.keywords : tool.keywords.ko

  return {
    title,
    description,
    keywords: `${keywords}, 온라인 도구, 무료 도구, ${title}`,
    alternates: {
      canonical: `${siteConfig.url}/tools/${slug}`
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/tools/${slug}`,
      type: 'website',
      images: [
        {
          url: `${siteConfig.url}/images/logo_s.svg`,
          width: 400,
          height: 400,
          alt: `${title} - YouNeedThis`,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteConfig.url}/images/logo_s.svg`]
    },
    robots: {
      index: true,
      follow: true
    }
  }
}

// 정적 경로 생성 (SEO 향상)
export async function generateStaticParams() {
  return siteConfig.tools.map((tool) => ({
    slug: tool.id,
  }))
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params
  const tool = siteConfig.tools.find((t) => t.id === slug)
  
  if (!tool) {
    notFound()
  }

  return <ToolPageClient params={{ slug }} />
}