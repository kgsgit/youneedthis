import { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { notFound } from 'next/navigation'
import ToolPageClient from '@/app/tools/[slug]/ToolPageClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = siteConfig.tools.find(t => t.id === slug)
  
  if (!tool) {
    return {
      title: 'Tool Not Found',
      description: 'The requested tool could not be found.'
    }
  }

  const toolName = tool.name.en
  const toolDescription = tool.description.en
  const toolKeywords = tool.keywords.en

  return {
    title: `${toolName} | ${siteConfig.name}`,
    description: toolDescription,
    keywords: toolKeywords,
    openGraph: {
      title: `${toolName} | ${siteConfig.name}`,
      description: toolDescription,
      url: `${siteConfig.url}/en/tools/${slug}`,
      siteName: siteConfig.name,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${toolName} | ${siteConfig.name}`,
      description: toolDescription,
    },
    alternates: {
      canonical: `${siteConfig.url}/en/tools/${slug}`,
      languages: {
        ko: `${siteConfig.url}/tools/${slug}`,
        en: `${siteConfig.url}/en/tools/${slug}`
      }
    }
  }
}

export async function generateStaticParams() {
  return siteConfig.tools.map((tool) => ({
    slug: tool.id,
  }))
}

export default async function EnglishToolPage({ params }: Props) {
  const { slug } = await params
  const tool = siteConfig.tools.find(t => t.id === slug)
  
  if (!tool) {
    notFound()
  }

  // 기존 ToolPageClient를 재사용하되 언어를 영어로 고정
  return <ToolPageClient params={{ slug }} forceLanguage="en" />
}