import { LetterData, LetterConfig } from '../../../types/builder';

interface LinkedInLetterTemplateProps {
  data: LetterData;
  config?: Partial<LetterConfig>;
  preview?: boolean;
}

export default function LinkedInLetterTemplate({ 
  data, 
  config = {}, 
  preview = false 
}: LinkedInLetterTemplateProps) {
  const defaultConfig: LetterConfig = {
    template: 'formal',
    tone: 'formal',
    letterhead: true,
    ...config
  };

  const containerClass = preview 
    ? "w-full max-w-4xl mx-auto bg-white text-gray-900 shadow-2xl rounded-xl border border-gray-200 overflow-hidden transform transition-transform hover:scale-105"
    : "w-full bg-white text-gray-900";

  return (
    <div className={containerClass}>
      {/* LinkedIn-style Header */}
      <header className="relative">
        {/* Header Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800"></div>
        
        {/* Profile Section */}
        <div className="px-8 pb-8 relative">
          {/* Profile Picture Placeholder */}
          <div className="absolute -top-16 left-8">
            <div className="w-32 h-32 bg-gray-200 border-4 border-white rounded-full flex items-center justify-center shadow-xl">
              <div className="text-3xl font-bold text-gray-600">
                {data.senderInfo.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>
          
          {/* Sender Information */}
          <div className="ml-40 pt-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {data.senderInfo.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Professional Cover Letter
            </p>
            
            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              {data.senderInfo.email && (
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">📧</span>
                  </div>
                  <span className="text-gray-700">{data.senderInfo.email}</span>
                </div>
              )}
              
              {data.senderInfo.phone && (
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">📱</span>
                  </div>
                  <span className="text-gray-700">{data.senderInfo.phone}</span>
                </div>
              )}
              
              {data.senderInfo.address && (
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">📍</span>
                  </div>
                  <span className="text-gray-700">{data.senderInfo.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 pb-8 space-y-8">
        
        {/* Date and Recipient */}
        <section className="border-b border-gray-200 pb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            {/* Date */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-blue-600 font-medium mb-1">Date</div>
              <div className="text-lg font-semibold text-blue-900">
                {data.letterInfo.date ? new Date(data.letterInfo.date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long', 
                  year: 'numeric'
                }) : 'Today'}
              </div>
            </div>
            
            {/* Recipient */}
            <div className="bg-gray-50 rounded-lg p-4 flex-1 max-w-md">
              <div className="text-sm text-gray-600 font-medium mb-2">Recipient</div>
              <div className="space-y-1">
                {data.recipientInfo.name && (
                  <div className="font-semibold text-gray-900">{data.recipientInfo.name}</div>
                )}
                {data.recipientInfo.title && (
                  <div className="text-gray-700">{data.recipientInfo.title}</div>
                )}
                {data.recipientInfo.company && (
                  <div className="text-blue-600 font-medium">{data.recipientInfo.company}</div>
                )}
                {data.recipientInfo.address && (
                  <div className="text-gray-600 text-sm">{data.recipientInfo.address}</div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Subject Line */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Subject</h2>
          <p className="text-lg text-gray-800 font-medium">
            {data.letterInfo.subject || `Application for ${data.recipientInfo.company ? `position at ${data.recipientInfo.company}` : 'your advertised position'}`}
          </p>
        </section>

        {/* Letter Content */}
        <section className="space-y-6">
          {/* Salutation */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-lg text-gray-800">
              {data.letterInfo.salutation || `Dear ${data.recipientInfo.name || 'Hiring Manager'},`}
            </p>
          </div>

          {/* Body */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="prose prose-lg max-w-none">
              {data.letterInfo.body ? (
                <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
                  {data.letterInfo.body}
                </div>
              ) : (
                <div className="space-y-4 text-gray-800 leading-relaxed">
                  <p>
                    I am writing to express my strong interest in the position advertised at your esteemed organization. 
                    With my background and experience, I am confident that I would be a valuable addition to your team.
                  </p>
                  <p>
                    My professional experience has equipped me with the skills and knowledge necessary to excel in this role. 
                    I am particularly drawn to this opportunity because it aligns perfectly with my career aspirations and allows me to contribute meaningfully to your organization's success.
                  </p>
                  <p>
                    I would welcome the opportunity to discuss how my experience and enthusiasm can benefit your team. 
                    Thank you for your time and consideration.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Closing */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="space-y-4">
              <p className="text-lg text-gray-800">
                {data.letterInfo.closing || 'Yours sincerely,'}
              </p>
              
              {/* Signature Area */}
              <div className="pt-8 pb-4">
                <div className="border-b-2 border-gray-300 w-64 mb-2"></div>
                <p className="text-lg font-semibold text-gray-900">
                  {data.senderInfo.name}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer with Professional Touch */}
        <footer className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              Professional cover letter generated by CVLetterAI
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <span>💼</span>
                <span>Professional Communication</span>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {preview && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-xl">
          LinkedIn Professional Style
        </div>
      )}
    </div>
  );
}