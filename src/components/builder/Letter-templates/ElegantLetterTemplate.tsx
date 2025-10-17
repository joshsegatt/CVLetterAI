import { LetterData, LetterConfig } from '../../../types/builder';

interface ElegantLetterTemplateProps {
  data: LetterData;
  config?: Partial<LetterConfig>;
  preview?: boolean;
}

export default function ElegantLetterTemplate({ 
  data, 
  config = {}, 
  preview = false 
}: ElegantLetterTemplateProps) {
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
    <div className={containerClass} style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
      {/* Elegant Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        
        {/* Ornamental Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        <div className="relative z-10 px-16 py-20">
          <div className="text-center">
            {/* Ornamental Border */}
            <div className="inline-block border-4 border-double border-yellow-600 p-12 mb-8">
              <div className="relative">
                {/* Decorative corners */}
                <div className="absolute -top-6 -left-6 w-12 h-12 border-l-4 border-t-4 border-yellow-600"></div>
                <div className="absolute -top-6 -right-6 w-12 h-12 border-r-4 border-t-4 border-yellow-600"></div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 border-l-4 border-b-4 border-yellow-600"></div>
                <div className="absolute -bottom-6 -right-6 w-12 h-12 border-r-4 border-b-4 border-yellow-600"></div>
                
                <h1 className="text-6xl font-serif font-bold text-white mb-4 tracking-wide">
                  {data.senderInfo.name.split(' ')[0]}
                </h1>
                <h1 className="text-6xl font-serif font-bold text-yellow-600 tracking-wide">
                  {data.senderInfo.name.split(' ').slice(1).join(' ')}
                </h1>
              </div>
            </div>
            
            {/* Decorative divider */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-px bg-yellow-600"></div>
              <div className="w-6 h-6 border-2 border-yellow-600 bg-gray-900 rotate-45 mx-4"></div>
              <div className="w-16 h-px bg-yellow-600"></div>
            </div>
            
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-gray-300 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 border-2 border-yellow-600 bg-yellow-600/10 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">✉</span>
                </div>
                <p className="text-sm font-light">{data.senderInfo.email}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 border-2 border-yellow-600 bg-yellow-600/10 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">☏</span>
                </div>
                <p className="text-sm font-light">{data.senderInfo.phone}</p>
              </div>
              <div className="text-center md:col-span-2">
                <div className="w-12 h-12 border-2 border-yellow-600 bg-yellow-600/10 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">⚲</span>
                </div>
                <p className="text-sm font-light">{data.senderInfo.address}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Letter Content */}
      <main className="px-16 py-16">
        
        {/* Date and Recipient */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Date */}
          <div></div>
          <div className="text-right">
            <div className="inline-block">
              <div className="border-2 border-yellow-600 p-6 bg-gradient-to-br from-gray-50 to-white">
                <div className="border border-gray-300 p-4">
                  <p className="text-gray-600 text-sm font-medium uppercase tracking-wider mb-2">Date</p>
                  <p className="text-2xl font-serif font-bold text-gray-900">{data.letterInfo.date}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recipient Information */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-yellow-600/10 to-transparent border-l-4 border-yellow-600 p-8">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">{data.recipientInfo.name}</h3>
            {data.recipientInfo.title && (
              <p className="text-lg text-gray-700 font-medium mb-2">{data.recipientInfo.title}</p>
            )}
            {data.recipientInfo.company && (
              <p className="text-xl text-yellow-700 font-serif font-semibold mb-2">{data.recipientInfo.company}</p>
            )}
            <p className="text-gray-600 italic">{data.recipientInfo.address}</p>
          </div>
        </div>

        {/* Subject */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <div className="border-t-2 border-b-2 border-yellow-600 py-6 px-12">
              <h2 className="text-3xl font-serif font-bold text-gray-900 tracking-wide">
                {data.letterInfo.subject}
              </h2>
            </div>
          </div>
        </div>

        {/* Salutation */}
        <div className="mb-12">
          <p className="text-2xl font-serif text-gray-800 font-medium">
            {data.letterInfo.salutation}
          </p>
        </div>

        {/* Body */}
        <div className="prose prose-xl max-w-none mb-16">
          <div className="space-y-10">
            {data.letterInfo.body.split('\n\n').map((paragraph: string, index: number) => (
              <div key={index} className="relative">
                {/* Decorative initial letter for first paragraph */}
                {index === 0 && (
                  <span className="float-left text-8xl font-serif font-bold text-yellow-600 leading-none pr-4 pt-2">
                    {paragraph.charAt(0)}
                  </span>
                )}
                <p className={`text-gray-800 leading-relaxed text-lg font-light ${
                  index === 0 ? 'pt-4' : ''
                }`} style={{ textAlign: 'justify', textIndent: index === 0 ? '0' : '2rem' }}>
                  {index === 0 ? paragraph.slice(1) : paragraph}
                </p>
                
                {/* Decorative elements between paragraphs */}
                {index < data.letterInfo.body.split('\n\n').length - 1 && (
                  <div className="flex justify-center mt-8 mb-6">
                    <div className="w-2 h-2 bg-yellow-600 rotate-45"></div>
                    <div className="w-2 h-2 bg-yellow-600 rotate-45 mx-4"></div>
                    <div className="w-2 h-2 bg-yellow-600 rotate-45"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Closing and Signature */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div></div>
          <div>
            {/* Closing */}
            <div className="mb-12">
              <p className="text-2xl font-serif text-gray-800 font-medium mb-8">
                {data.letterInfo.closing}
              </p>
              
              {/* Signature Area */}
              <div className="relative">
                <div className="border-t-2 border-yellow-600 pt-8 pb-4">
                  <div className="relative">
                    {/* Decorative signature flourish */}
                    <div className="absolute -left-8 top-0 w-16 h-16 border border-yellow-600 rounded-full opacity-20"></div>
                    
                    <p className="text-3xl font-serif font-bold text-gray-900 mb-2">
                      {data.senderInfo.name}
                    </p>
                    <p className="text-lg text-gray-600 italic">
                      {data.letterInfo.signature}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Elegant Footer */}
        <div className="mt-20 pt-8 border-t border-gray-300">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <div className="w-20 h-px bg-yellow-600"></div>
              <div className="w-4 h-4 border border-yellow-600 bg-yellow-600 rotate-45 mx-6"></div>
              <div className="w-20 h-px bg-yellow-600"></div>
            </div>
          </div>
        </div>
      </main>

      {preview && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-gray-900 to-black text-yellow-400 px-6 py-3 rounded text-sm font-bold tracking-wider">
          ✨ ELEGANT
        </div>
      )}
    </div>
  );
}