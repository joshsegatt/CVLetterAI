import { LetterData, LetterConfig } from '../../../types/builder';

interface MinimalModernLetterTemplateProps {
  data: LetterData;
  config?: Partial<LetterConfig>;
  preview?: boolean;
}

export default function MinimalModernLetterTemplate({ 
  data, 
  config = {}, 
  preview = false 
}: MinimalModernLetterTemplateProps) {
  const containerClass = preview 
    ? "w-full max-w-4xl mx-auto bg-white text-gray-900 shadow-lg overflow-hidden text-xs"
    : "w-full bg-white text-gray-900";

  return (
    <div className={containerClass} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Clean Letterhead */}
      <header className={`${preview ? 'px-4 py-3' : 'px-16 py-12'} border-b border-gray-100`}>
        <div className="flex justify-between items-start">
          {/* Sender Info */}
          <div>
            <h1 className={`${preview ? 'text-sm' : 'text-2xl'} font-semibold text-gray-900 ${preview ? 'mb-2' : 'mb-6'} tracking-tight`}>
              {data.senderInfo.name}
            </h1>
            <div className="space-y-2 text-sm text-gray-600">
              <div>{data.senderInfo.address}</div>
              <div className="flex gap-6">
                <span>{data.senderInfo.email}</span>
                <span>{data.senderInfo.phone}</span>
              </div>
            </div>
          </div>
          
          {/* Date */}
          <div className="text-right">
            <div className="text-sm text-gray-600">{data.letterInfo.date}</div>
          </div>
        </div>
      </header>

      {/* Letter Content */}
      <main className="px-16 py-12">
        
        {/* Recipient */}
        <div className="mb-12">
          <div className="text-gray-700">
            <div className="font-semibold">{data.recipientInfo.name}</div>
            {data.recipientInfo.title && <div>{data.recipientInfo.title}</div>}
            {data.recipientInfo.company && <div>{data.recipientInfo.company}</div>}
            <div>{data.recipientInfo.address}</div>
          </div>
        </div>

        {/* Subject */}
        <div className="mb-8">
          <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Subject</div>
          <h2 className="text-xl font-medium text-gray-900">{data.letterInfo.subject}</h2>
        </div>

        {/* Salutation */}
        <div className="mb-8">
          <p className="text-gray-800 font-medium">{data.letterInfo.salutation}</p>
        </div>

        {/* Body */}
        <div className="mb-12">
          <div className="prose prose-lg max-w-none">
            {data.letterInfo.body.split('\n\n').map((paragraph: string, index: number) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-6 text-justify">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Closing */}
        <div className="flex justify-end">
          <div className="text-right">
            <p className="text-gray-800 font-medium mb-12">
              {data.letterInfo.closing}
            </p>
            
            {/* Signature */}
            <div>
              <div className="w-48 h-px bg-gray-300 mb-4"></div>
              <div className="font-semibold text-gray-900">{data.senderInfo.name}</div>
              <div className="text-sm text-gray-600 mt-1">{data.letterInfo.signature}</div>
            </div>
          </div>
        </div>
      </main>

      {preview && (
        <div className="absolute top-4 right-4 bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm font-medium">
          Modern Minimal
        </div>
      )}
    </div>
  );
}