import { LetterData, LetterConfig } from '../../../types/builder';

interface ModernLetterTemplateProps {
  data: LetterData;
  config?: Partial<LetterConfig>;
  preview?: boolean;
}

export default function ModernLetterTemplate({ 
  data, 
  config = {}, 
  preview = false 
}: ModernLetterTemplateProps) {
  const defaultConfig: LetterConfig = {
    template: 'formal',
    tone: 'formal',
    letterhead: true,
    ...config
  };

  const containerClass = preview 
    ? "w-full max-w-4xl mx-auto bg-white text-gray-900 shadow-2xl border border-gray-300 overflow-hidden"
    : "w-full bg-white text-gray-900";

  return (
    <div className={containerClass}>
      {/* Modern Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-blue-500/10"></div>
        
        {/* Geometric pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-transparent transform rotate-45 translate-x-48 -translate-y-48"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent transform rotate-45 translate-x-32 -translate-y-32"></div>
        </div>
        
        <div className="relative z-10 px-16 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Sender Info */}
            <div>
              <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
                {data.senderInfo.name}
              </h1>
              <div className="w-24 h-1 bg-blue-500 mb-8"></div>
              
              <div className="space-y-3 text-gray-300">
                {data.senderInfo.email && (
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-500/20 border border-blue-500 flex items-center justify-center">
                      <span className="text-blue-400 text-sm">@</span>
                    </div>
                    <span className="text-lg">{data.senderInfo.email}</span>
                  </div>
                )}
                {data.senderInfo.phone && (
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-500/20 border border-blue-500 flex items-center justify-center">
                      <span className="text-blue-400 text-sm">☏</span>
                    </div>
                    <span className="text-lg">{data.senderInfo.phone}</span>
                  </div>
                )}
                {data.senderInfo.address && (
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-500/20 border border-blue-500 flex items-center justify-center">
                      <span className="text-blue-400 text-sm">⚲</span>
                    </div>
                    <span className="text-lg">{data.senderInfo.address}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Date & Recipient */}
            <div className="text-right">
              <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-lg">
                <div className="mb-6">
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Date</p>
                  <p className="text-white text-2xl font-bold">{data.letterInfo.date}</p>
                </div>
                
                {data.recipientInfo.name && (
                  <div>
                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">To</p>
                    <p className="text-white text-xl font-semibold">{data.recipientInfo.name}</p>
                    {data.recipientInfo.title && <p className="text-gray-300 text-lg">{data.recipientInfo.title}</p>}
                    {data.recipientInfo.company && <p className="text-gray-300 text-lg font-medium">{data.recipientInfo.company}</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Letter Body */}
      <main className="px-16 py-12">
        
        {/* Subject Line */}
        {data.letterInfo.subject && (
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                RE:
              </div>
              <h2 className="text-3xl font-bold text-gray-900">{data.letterInfo.subject}</h2>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-blue-500 via-gray-300 to-transparent"></div>
          </div>
        )}

        {/* Greeting */}
        {data.letterInfo.salutation && (
          <div className="mb-10">
            <p className="text-2xl text-gray-800 font-medium">
              {data.letterInfo.salutation}
            </p>
          </div>
        )}

        {/* Body Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="space-y-8">
            {data.letterInfo.body.split('\n\n').map((paragraph: string, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-transparent opacity-30"></div>
                <p className="text-gray-800 leading-relaxed text-lg pl-8">
                  {paragraph}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Closing & Signature */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div></div>
          <div>
            {data.letterInfo.closing && (
              <p className="text-xl text-gray-800 mb-8 font-medium">
                {data.letterInfo.closing}
              </p>
            )}
            
            {/* Signature Area */}
            <div className="border-l-4 border-blue-500 pl-8">
              <div className="mb-8">
                <div className="w-64 h-px bg-gray-400 mb-4"></div>
                <p className="text-2xl font-bold text-gray-900">{data.senderInfo.name}</p>
                <p className="text-lg text-gray-600 mt-2">{data.letterInfo.signature}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Note: Attachments would be handled separately in the application */}
      </main>

      {preview && (
        <div className="absolute top-4 right-4 bg-slate-800 text-blue-400 px-6 py-3 rounded text-sm font-bold tracking-wider">
          ⚡ MODERN
        </div>
      )}
    </div>
  );
}