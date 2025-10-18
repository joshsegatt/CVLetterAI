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
    ? "w-full max-w-4xl mx-auto bg-white text-gray-900 shadow-2xl overflow-hidden"
    : "w-full bg-white text-gray-900";

  return (
    <div className={containerClass} style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
      {/* Executive Header with Premium Styling */}
      <header className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Luxury Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4af37' fill-opacity='0.3'%3E%3Cpath d='M30 30m-20 0a20,20 0 1,1 40,0a20,20 0 1,1 -40,0'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        <div className="relative z-10 px-12 py-16">
          {/* Executive Profile Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {/* Premium Monogram */}
              <div className="w-28 h-28 bg-gradient-to-br from-amber-600 via-yellow-600 to-amber-700 rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl">
                <span className="text-white font-bold text-3xl tracking-wider">
                  {data.senderInfo.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              
              {/* Executive Name & Title */}
              <div>
                <h1 className="text-5xl font-bold text-white mb-3 tracking-wide">
                  {data.senderInfo.name}
                </h1>
                <p className="text-amber-300 text-xl font-medium tracking-wide">
                  Executive Professional
                </p>
              </div>
            </div>
            
            {/* Premium Badge */}
            <div className="text-right">
              <div className="inline-block bg-gradient-to-r from-amber-600 to-yellow-600 px-8 py-4 rounded-full border-2 border-white/30 shadow-lg">
                <span className="text-white font-bold text-sm tracking-[0.3em]">EXECUTIVE ELITE</span>
              </div>
            </div>
          </div>
          
          {/* Executive Contact Grid */}
          <div className="mt-12 grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-amber-300 text-sm font-bold mb-2 tracking-widest">EMAIL</div>
              <div className="text-white text-lg font-light">{data.senderInfo.email}</div>
            </div>
            <div className="text-center">
              <div className="text-amber-300 text-sm font-bold mb-2 tracking-widest">PHONE</div>
              <div className="text-white text-lg font-light">{data.senderInfo.phone}</div>
            </div>
            <div className="text-center">
              <div className="text-amber-300 text-sm font-bold mb-2 tracking-widest">LOCATION</div>
              <div className="text-white text-lg font-light">{data.senderInfo.address.split(',')[0]}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Executive Content Area */}
      <main className="px-12 py-12">
        {/* Date and Recipient with Executive Styling */}
        <div className="mb-12">
          <div className="text-right mb-10">
            <time className="text-slate-600 text-xl font-medium tracking-wide">{data.letterInfo.date}</time>
          </div>
          
          {/* Executive Divider */}
          <div className="flex items-center justify-center mb-10">
            <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-yellow-600"></div>
            <div className="mx-4 w-5 h-5 bg-gradient-to-br from-amber-600 to-yellow-600 transform rotate-45"></div>
            <div className="w-24 h-1 bg-gradient-to-l from-amber-600 to-yellow-600"></div>
          </div>
          
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-l-8 border-amber-600 p-10 rounded-r-2xl shadow-lg">
            <address className="not-italic text-slate-800 text-lg leading-relaxed space-y-3">
              <div className="font-bold text-2xl text-slate-900 mb-2">{data.recipientInfo.name}</div>
              {data.recipientInfo.title && (
                <div className="text-amber-700 font-semibold text-lg">{data.recipientInfo.title}</div>
              )}
              {data.recipientInfo.company && (
                <div className="font-bold text-xl text-slate-800">{data.recipientInfo.company}</div>
              )}
              <div className="text-slate-600 font-light">{data.recipientInfo.address}</div>
            </address>
          </div>
        </div>

        {/* Executive Subject Line */}
        <div className="mb-10 text-center">
          <div className="inline-block bg-gradient-to-r from-slate-900 to-slate-800 text-white px-12 py-5 rounded-full shadow-lg">
            <h2 className="text-2xl font-bold tracking-wide">
              RE: {data.letterInfo.subject}
            </h2>
          </div>
        </div>

        {/* Executive Salutation */}
        <div className="mb-10">
          <p className="text-3xl text-slate-800 font-bold">
            {data.letterInfo.salutation}
          </p>
        </div>

        {/* Executive Letter Body */}
        <div className="prose prose-xl prose-slate max-w-none">
          <div className="text-slate-700 leading-relaxed space-y-8">
            {data.letterInfo.body.split('\n\n').map((paragraph: string, index: number) => (
              <div key={index} className="relative">
                <p className="text-xl leading-relaxed first-letter:text-7xl first-letter:font-bold first-letter:text-amber-600 first-letter:float-left first-letter:mr-4 first-letter:mt-2">
                  {paragraph}
                </p>
                
                {/* Elegant paragraph separator */}
                {index < data.letterInfo.body.split('\n\n').length - 1 && (
                  <div className="flex justify-center mt-8 mb-6">
                    <div className="w-3 h-3 bg-amber-600 rounded-full"></div>
                    <div className="w-3 h-3 bg-amber-600 rounded-full mx-6"></div>
                    <div className="w-3 h-3 bg-amber-600 rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Executive Closing */}
        <div className="mt-20">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-slate-900 to-slate-800 text-white py-4 px-16 rounded-full shadow-lg">
              <p className="text-2xl font-bold tracking-wide">{data.letterInfo.closing}</p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <div className="inline-block">
              <div className="bg-gradient-to-r from-amber-600 to-yellow-600 h-2 w-60 mb-6 rounded-full"></div>
              <p className="text-4xl font-bold text-slate-900 tracking-wide mb-3">{data.senderInfo.name}</p>
              <p className="text-lg text-amber-700 font-semibold tracking-wide">{data.letterInfo.signature}</p>
              <div className="bg-gradient-to-r from-amber-600 to-yellow-600 h-1 w-40 mx-auto mt-4 rounded-full"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Executive Footer */}
      <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-12 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-px bg-amber-600"></div>
            <div className="w-4 h-4 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-full"></div>
            <div className="w-16 h-px bg-amber-600"></div>
          </div>
          <p className="text-white/80 text-xs tracking-[0.4em] font-bold">EXECUTIVE CORRESPONDENCE</p>
        </div>
      </footer>

      {/* Premium Preview Badge */}
      {preview && (
        <div className="absolute top-6 right-6 bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-6 py-3 rounded-full shadow-lg">
          <span className="text-sm font-bold tracking-widest">✨ EXECUTIVE ELITE</span>
        </div>
      )}
    </div>
  );
}