import ReactMarkdown from "react-markdown"
// import * as LucideIcons from "lucide-react"


interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert max-w-none prose-sm">
      <ReactMarkdown
        components={{
          h1: ({ ...props }) => <h1 className="text-2xl font-bold mt-4 mb-2 text-white" {...props} />,
          h2: ({ ...props }) => <h2 className="text-xl font-bold mt-3 mb-2 text-white" {...props} />,
          h3: ({ ...props }) => <h3 className="text-lg font-bold mt-2 mb-1 text-white" {...props} />,
          h4: ({ ...props }) => <h4 className="text-md font-bold mt-2 mb-1 text-white" {...props} />,
          p: ({ ...props }) => <p className="mb-2 text-gray-100" {...props} />,
          ul: ({ ...props }) => <ul className="list-disc list-inside mb-2 text-gray-100" {...props} />,
          ol: ({ ...props }) => <ol className="list-decimal list-inside mb-2 text-gray-100" {...props} />,
          br: () => <br />,
          div: ({ ...props }) => <div className="mb-2" {...props} />,

          li: ({ ...props }) => <li className="mb-1" {...props} />,
          code: ({ ...props }) => (
            <code className="bg-gray-700 text-gray-200 px-2 py-1 rounded text-sm font-mono" {...props} />
          ),
          pre: ({ ...props }) => (
            <pre className="bg-gray-900 border border-gray-700 rounded-lg p-3 mb-2 overflow-x-auto" {...props} />
          ),
          blockquote: ({ ...props }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-300 mb-2" {...props} />
          ),
          a: ({ ...props }) => <a className="text-blue-400 hover:text-blue-300 underline" {...props} />,
          strong: ({ ...props }) => <strong className="font-bold text-white" {...props} />,
          em: ({ ...props }) => <em className="italic text-gray-200" {...props} />,
          table: ({ ...props }) => <table className="border-collapse border border-gray-600 mb-2" {...props} />,
          th: ({ ...props }) => <th className="border border-gray-600 bg-gray-800 px-3 py-2 text-white" {...props} />,
          td: ({ ...props }) => <td className="border border-gray-600 px-3 py-2" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

