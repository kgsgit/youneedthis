import Link from 'next/link'

interface Tool {
  id: string
  name: { ko: string; en: string }
  description: { ko: string; en: string }
  icon: string
  regions: string[]
}

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={`/tools/${tool.id}`}>
      <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
            <span className="text-2xl">{tool.icon}</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-lg">
              {tool.name.ko}
            </h4>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-2">
          {tool.description.ko}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {tool.regions.includes('kr') && (
              <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                한국
              </span>
            )}
            {tool.regions.includes('global') && (
              <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full font-medium">
                글로벌
              </span>
            )}
          </div>
          
          <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-blue-50 transition-colors">
            <span className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all text-sm">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}