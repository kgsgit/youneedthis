import { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { notFound } from 'next/navigation'
import ToolPageClient from '@/app/tools/[slug]/ToolPageClient'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = siteConfig.tools.find(t => t.id === params.slug)
  
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
      url: `${siteConfig.url}/en/tools/${params.slug}`,
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
      canonical: `${siteConfig.url}/en/tools/${params.slug}`,
      languages: {
        ko: `${siteConfig.url}/tools/${params.slug}`,
        en: `${siteConfig.url}/en/tools/${params.slug}`
      }
    }
  }
}

export async function generateStaticParams() {
  return siteConfig.tools.map((tool) => ({
    slug: tool.id,
  }))
}

export default function EnglishToolPage({ params }: Props) {
  const tool = siteConfig.tools.find(t => t.id === params.slug)
  
  if (!tool) {
    notFound()
  }

  // 기존 ToolPageClient를 재사용하되 언어를 영어로 고정
  return <ToolPageClient params={params} forceLanguage="en" />
}