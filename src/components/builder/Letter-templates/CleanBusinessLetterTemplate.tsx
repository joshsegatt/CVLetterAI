import { LetterData, LetterConfig } from '../../../types/builder';

interface CleanBusinessLetterTemplateProps {
  data: LetterData;
  config?: Partial<LetterConfig>;
  preview?: boolean;
}

export default function CleanBusinessLetterTemplate({ 
  data, 
  config = {}, 
  preview = false 
}: CleanBusinessLetterTemplateProps) {
  const containerClass = preview 
    ? "w-full max-w-4xl mx-auto bg-white text-gray-900 shadow-lg overflow-hidden text-xs"
    : "w-full bg-white text-gray-900";

  return (
    <div className={containerClass} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Professional Header */}
      <header className={`${preview ? 'px-4 py-3' : 'px-16 py-12'} bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200`}>
        <div className="flex justify-between items-center">
          {/* Left: Sender */}
          <div>
            <h1 className={`${preview ? 'text-sm' : 'text-3xl'} font-light text-gray-900 ${preview ? 'mb-1' : 'mb-4'} tracking-tight`}>
              {data.senderInfo.name}
            </h1>
            <div className="text-sm text-gray-600 space-y-1">
              <div>{data.senderInfo.address}</div>
              <div className="flex gap-4">
                <span>📧 {data.senderInfo.email}</span>
                <span>📱 {data.senderInfo.phone}</span>
              </div>
            </div>
          </div>
          
          {/* Right: Date */}
          <div className="text-right">
            <div className="inline-block bg-white px-6 py-3 border border-gray-200 rounded-lg">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date</div>
              <div className="text-sm font-medium text-gray-900">{data.letterInfo.date}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-16 py-12">
        
        {/* Recipient Block */}
        <div className="mb-12 p-6 bg-gray-50 rounded-lg border-l-4 border-indigo-500">
          <div className="text-gray-700">
            <div className="text-lg font-semibold text-gray-900 mb-2">{data.recipientInfo.name}</div>
            {data.recipientInfo.title && <div className="text-gray-600 mb-1">{data.recipientInfo.title}</div>}
            {data.recipientInfo.company && <div className="font-medium text-indigo-700 mb-2">{data.recipientInfo.company}</div>}
            <div className="text-gray-600">{data.recipientInfo.address}</div>
          </div>
        </div>

        {/* Subject Line */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 text-sm font-bold">RE:</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{data.letterInfo.subject}</h2>
          </div>
          <div className="w-full h-px bg-gradient-to-r from-indigo-500 via-gray-300 to-transparent"></div>
        </div>

        {/* Greeting */}
        <div className="mb-8">
          <p className="text-lg text-gray-800 font-medium">{data.letterInfo.salutation}</p>
        </div>

        {/* Letter Body */}
        <div className="mb-12">
          <div className="space-y-6">
            {data.letterInfo.body.split('\n\n').map((paragraph: string, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-indigo-100 to-transparent"></div>
                <p className="text-gray-700 leading-relaxed pl-8 text-justify">
                  {paragraph}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Closing Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div></div>
          <div>
            <p className="text-lg text-gray-800 font-medium mb-12">
              {data.letterInfo.closing}
            </p>
            
            {/* Signature Block */}
            <div className="border-l-4 border-indigo-500 pl-6">
              <div className="mb-8">
                <div className="w-48 h-px bg-gray-400 mb-4"></div>
                <div className="text-xl font-semibold text-gray-900">{data.senderInfo.name}</div>
                <div className="text-gray-600 mt-2">{data.letterInfo.signature}</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {preview && (
        <div className="absolute top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium">
          Clean Business
        </div>
      )}
    </div>
  );
}