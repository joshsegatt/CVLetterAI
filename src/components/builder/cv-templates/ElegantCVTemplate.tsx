import { CVData, CVConfig } from '../../../types/builder';

interface ElegantCVTemplateProps {
  data: CVData;
  config?: Partial<CVConfig>;
  preview?: boolean;
}

export default function ElegantCVTemplate({ 
  data, 
  config = {}, 
  preview = false 
}: ElegantCVTemplateProps) {
  const defaultConfig: CVConfig = {
    template: 'elegant',
    primaryColor: '#1f2937',
    accentColor: '#d4af37',
    fontFamily: 'Playfair Display',
    fontSize: 'medium',
    spacing: 'relaxed',
    ...config
  };

  const containerClass = preview 
    ? "w-full max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-white text-gray-800 shadow-2xl rounded-xl overflow-hidden border border-gray-200"
    : "w-full bg-white text-gray-800";

  return (
    <div className={containerClass}>
      {/* Elegant Header */}
      <header className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-12 py-10">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-serif font-bold text-white mb-3 tracking-wide">
              {data.personal.firstName} {data.personal.lastName}
            </h1>
            <div className="w-24 h-0.5 bg-yellow-400 mx-auto mb-4"></div>
            <p className="text-xl text-gray-200 font-light italic max-w-3xl mx-auto leading-relaxed">
              {data.personal.summary}
            </p>
          </div>
          
          {/* Contact Info - Elegant Layout */}
          <div className="flex flex-wrap justify-center gap-8 text-gray-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                <span className="text-gray-900 text-sm font-semibold">@</span>
              </div>
              <span className="font-light">{data.personal.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                <span className="text-gray-900 text-sm font-semibold">☎</span>
              </div>
              <span className="font-light">{data.personal.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                <span className="text-gray-900 text-sm font-semibold">📍</span>
              </div>
              <span className="font-light">{data.personal.location}</span>
            </div>
            {data.personal.linkedin && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                  <span className="text-gray-900 text-sm font-semibold">in</span>
                </div>
                <span className="font-light">LinkedIn Profile</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-12 py-10">
        
        {/* Experience Section */}
        {data.experience.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center mb-8">
              <h2 className="text-3xl font-serif font-bold text-gray-900 mr-4">
                Professional Experience
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-yellow-400 to-transparent"></div>
            </div>
            
            <div className="space-y-10">
              {data.experience.map((exp, index) => (
                <div key={exp.id || index} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-6 top-0 w-3 h-3 bg-yellow-400 rounded-full border-4 border-white shadow-lg"></div>
                  {index < data.experience.length - 1 && (
                    <div className="absolute -left-4 top-6 w-px h-full bg-gray-200"></div>
                  )}
                  
                  <div className="bg-gradient-to-r from-gray-50 to-white p-8 rounded-xl shadow-sm border border-gray-100 ml-4">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-1">
                          {exp.position}
                        </h3>
                        <p className="text-xl text-yellow-600 font-medium mb-2">{exp.company}</p>
                        <p className="text-gray-600 italic">{exp.location}</p>
                      </div>
                      <div className="mt-4 lg:mt-0 lg:text-right">
                        <div className="inline-block bg-yellow-100 px-4 py-2 rounded-full">
                          <span className="text-gray-800 font-medium text-sm">
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <ul className="space-y-3">
                      {exp.description.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section - Premium Layout */}
        {data.skills.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center mb-8">
              <h2 className="text-3xl font-serif font-bold text-gray-900 mr-4">Core Competencies</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-yellow-400 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {['Technical', 'Soft', 'Language', 'Tool'].map(category => {
                const categorySkills = data.skills.filter(skill => skill.category === category);
                if (categorySkills.length === 0) return null;
                
                return (
                  <div key={category} className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-serif font-semibold text-gray-800 mb-6 text-center">
                      {category} Skills
                    </h3>
                    <div className="space-y-4">
                      {categorySkills.map((skill, index) => (
                        <div key={skill.id || index}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700 font-medium">{skill.name}</span>
                            <span className="text-yellow-600 text-sm font-semibold">{skill.level}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${(['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Native', 'Fluent'].indexOf(skill.level) + 1) * 16.67}%` 
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Education Section */}
        {data.education.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center mb-8">
              <h2 className="text-3xl font-serif font-bold text-gray-900 mr-4">Education</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-yellow-400 to-transparent"></div>
            </div>
            
            <div className="grid gap-6">
              {data.education.map((edu, index) => (
                <div key={edu.id || index} className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
                    <div>
                      <h3 className="text-xl font-serif font-semibold text-gray-900 mb-1">{edu.degree}</h3>
                      <p className="text-yellow-600 font-medium text-lg">{edu.institution}</p>
                      {edu.field && <p className="text-gray-600 italic">Specialization: {edu.field}</p>}
                    </div>
                    <div className="mt-4 lg:mt-0 text-right">
                      <div className="inline-block bg-yellow-100 px-4 py-2 rounded-full mb-2">
                        <span className="text-gray-800 font-medium text-sm">
                          {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                        </span>
                      </div>
                      {edu.gpa && (
                        <div>
                          <span className="text-gray-700 font-semibold">
                            {edu.gpa}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {preview && (
        <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-90 text-yellow-400 px-4 py-2 rounded-lg text-sm font-semibold">
          ✨ Elegant Template
        </div>
      )}
    </div>
  );
}