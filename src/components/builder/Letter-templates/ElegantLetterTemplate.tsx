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
    ? "w-full max-w-4xl mx-auto bg-white text-gray-900 shadow-2xl overflow-hidden text-xs"
    : "w-full bg-white text-gray-900";

  return (
    <div className={containerClass} style={{ fontFamily: 'Georgia, serif' }}>
      {/* Elegant Minimalist Header */}
      <header className={`${preview ? 'px-4 py-6' : 'px-16 py-12'} bg-white border-b-2 border-gray-900`}>
        <div className="flex justify-between items-start">
          {/* Left: Sender Info */}
          <div>
            <h1 className={`${preview ? 'text-lg' : 'text-4xl'} font-serif font-bold text-gray-900 ${preview ? 'mb-2' : 'mb-6'} tracking-tight`}>
              {data.senderInfo.name}
            </h1>
            <div className={`${preview ? 'text-xs space-y-1' : 'text-sm space-y-2'} text-gray-700`}>
              <div>{data.senderInfo.address}</div>
              <div>{data.senderInfo.email}</div>
              <div>{data.senderInfo.phone}</div>
            </div>
          </div>
          
          {/* Right: Elegant Badge */}
          <div className="text-right">
            <div className={`inline-block border border-gray-900 ${preview ? 'px-3 py-1' : 'px-6 py-3'} bg-gray-900 text-white`}>
              <span className={`${preview ? 'text-xs' : 'text-sm'} font-serif tracking-wider`}>EXECUTIVE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Clean Executive Content */}
      <main className={`${preview ? 'px-4 py-6' : 'px-16 py-12'}`}>
        {/* Date */}
        <div className={`text-right ${preview ? 'mb-6' : 'mb-12'}`}>
          <time className={`text-gray-700 ${preview ? 'text-xs' : 'text-lg'} font-medium`}>{data.letterInfo.date}</time>
        </div>

        {/* Recipient */}
        <div className={`${preview ? 'mb-6' : 'mb-12'}`}>
          <address className={`not-italic text-gray-800 ${preview ? 'text-xs leading-relaxed space-y-1' : 'text-lg leading-relaxed space-y-2'}`}>
            <div className="font-bold">{data.recipientInfo.name}</div>
            {data.recipientInfo.title && (
              <div className="font-medium">{data.recipientInfo.title}</div>
            )}
            {data.recipientInfo.company && (
              <div className="font-semibold">{data.recipientInfo.company}</div>
            )}
            <div>{data.recipientInfo.address}</div>
          </address>
        </div>

        {/* Subject */}
        <div className={`${preview ? 'mb-4' : 'mb-8'}`}>
          <h2 className={`font-serif font-bold text-gray-900 ${preview ? 'text-xs' : 'text-xl'} border-b border-gray-300 ${preview ? 'pb-1' : 'pb-2'}`}>
            Subject: {data.letterInfo.subject}
          </h2>
        </div>

        {/* Salutation */}
        <div className={`${preview ? 'mb-4' : 'mb-8'}`}>
          <p className={`font-serif ${preview ? 'text-xs' : 'text-lg'} text-gray-800`}>
            {data.letterInfo.salutation}
          </p>
        </div>

        {/* Body */}
        <div className={`prose ${preview ? 'prose-xs' : 'prose-lg'} prose-gray max-w-none ${preview ? 'mb-4' : 'mb-12'}`}>
          <div className={`text-gray-800 leading-relaxed ${preview ? 'space-y-2' : 'space-y-6'}`}>
            {data.letterInfo.body.split('\n\n').map((paragraph: string, index: number) => (
              <p key={index} className={`${preview ? 'text-xs' : 'text-base'}`}>
                {preview ? paragraph.slice(0, 100) + (paragraph.length > 100 ? '...' : '') : paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Signature */}
        <div className="flex justify-end">
          <div className="text-right">
            <p className={`font-serif ${preview ? 'text-xs mb-2' : 'text-lg mb-6'} text-gray-800`}>
              {data.letterInfo.closing}
            </p>
            <div className={`border-t border-gray-900 ${preview ? 'pt-2' : 'pt-6'} ${preview ? 'w-20' : 'w-40'}`}>
              <p className={`font-serif font-bold text-gray-900 ${preview ? 'text-xs' : 'text-xl'}`}>
                {data.senderInfo.name}
              </p>
              {data.letterInfo.signature && (
                <p className={`text-gray-600 italic ${preview ? 'text-xs' : 'text-sm'}`}>
                  {data.letterInfo.signature}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Clean Preview Badge */}
      {preview && (
        <div className="absolute top-4 right-4 bg-gray-900 text-white px-3 py-1 text-xs font-serif tracking-wider">
          EXECUTIVE
        </div>
      )}
    </div>
  );
}