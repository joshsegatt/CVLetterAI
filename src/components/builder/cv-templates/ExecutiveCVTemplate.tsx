import { CVData, CVConfig } from '../../../types/builder';

interface ExecutiveCVTemplateProps {
  data: CVData;
  config?: Partial<CVConfig>;
  preview?: boolean;
}

export default function ExecutiveCVTemplate({ 
  data, 
  config = {}, 
  preview = false 
}: ExecutiveCVTemplateProps) {
  const defaultConfig: CVConfig = {
    template: 'executive',
    primaryColor: '#0f1419',
    accentColor: '#c9a96e',
    fontFamily: 'Georgia',
    fontSize: 'medium',
    spacing: 'relaxed',
    ...config
  };

  const containerClass = preview 
    ? "w-full max-w-4xl mx-auto bg-white text-gray-900 shadow-2xl border border-gray-300 overflow-hidden"
    : "w-full bg-white text-gray-900";

  return (
    <div className={containerClass}>
      {/* Executive Header - Luxury Design */}
      <header className="relative">
        {/* Premium background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"></div>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(201,169,110,0.3) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
        
        <div className="relative z-10 px-16 py-16">
          {/* Luxury border */}
          <div className="border-2 border-yellow-600 p-12 relative">
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-600 transform rotate-45"></div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-600 transform rotate-45"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-yellow-600 transform rotate-45"></div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-yellow-600 transform rotate-45"></div>
            
            <div className="text-center">
              <h1 className="text-6xl font-serif font-bold text-white mb-4 tracking-wider">
                {data.personal.firstName.toUpperCase()}
              </h1>
              <h1 className="text-6xl font-serif font-bold text-yellow-600 mb-8 tracking-wider">
                {data.personal.lastName.toUpperCase()}
              </h1>
              
              <div className="w-32 h-0.5 bg-yellow-600 mx-auto mb-8"></div>
              
              <p className="text-2xl text-gray-200 font-light italic max-w-4xl mx-auto leading-relaxed">
                {data.personal.summary}
              </p>
            </div>
          </div>
          
          {/* Executive Contact Bar */}
          <div className="mt-12 bg-gradient-to-r from-transparent via-yellow-600 to-transparent h-px"></div>
          <div className="mt-8 flex flex-wrap justify-center gap-12 text-gray-300">
            {[
              { icon: '✉', value: data.personal.email },
              { icon: '☏', value: data.personal.phone },
              { icon: '⚲', value: data.personal.location },
              { icon: '⚐', value: data.personal.linkedin ? 'LinkedIn Profile' : null }
            ].filter(item => item.value).map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-10 h-10 border border-yellow-600 flex items-center justify-center text-yellow-600 font-bold text-lg">
                  {item.icon}
                </div>
                <span className="font-light text-lg">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Executive Content */}
      <div className="px-16 py-12">
        
        {/* Experience Section - Executive Style */}
        {data.experience.length > 0 && (
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                EXECUTIVE EXPERIENCE
              </h2>
              <div className="w-48 h-1 bg-gradient-to-r from-transparent via-yellow-600 to-transparent mx-auto"></div>
            </div>
            
            <div className="space-y-12">
              {data.experience.map((exp, index) => (
                <div key={exp.id || index} className="relative">
                  <div className="bg-gradient-to-r from-gray-50 to-white border-l-4 border-yellow-600 shadow-lg">
                    <div className="p-10">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Position & Company */}
                        <div className="lg:col-span-2">
                          <h3 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                            {exp.position}
                          </h3>
                          <div className="flex items-center mb-4">
                            <div className="w-4 h-4 bg-yellow-600 mr-4"></div>
                            <p className="text-2xl text-yellow-700 font-semibold">{exp.company}</p>
                          </div>
                          <p className="text-gray-600 text-lg italic mb-6">{exp.location}</p>
                        </div>
                        
                        {/* Duration */}
                        <div className="text-right">
                          <div className="inline-block border-2 border-yellow-600 px-6 py-4">
                            <div className="text-gray-800 font-bold text-lg">
                              {exp.startDate}
                            </div>
                            <div className="text-yellow-600 font-bold text-xl my-2">━</div>
                            <div className="text-gray-800 font-bold text-lg">
                              {exp.current ? 'Present' : exp.endDate}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Achievements */}
                      <div className="mt-8 space-y-4">
                        {exp.description.map((item, i) => (
                          <div key={i} className="flex items-start gap-4">
                            <div className="w-6 h-6 border border-yellow-600 flex items-center justify-center mt-0.5 flex-shrink-0">
                              <div className="w-2 h-2 bg-yellow-600"></div>
                            </div>
                            <p className="text-gray-800 leading-relaxed text-lg">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Executive Skills Matrix */}
        {data.skills.length > 0 && (
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                CORE COMPETENCIES
              </h2>
              <div className="w-48 h-1 bg-gradient-to-r from-transparent via-yellow-600 to-transparent mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {['Technical', 'Soft', 'Language', 'Tool'].map(category => {
                const categorySkills = data.skills.filter(skill => skill.category === category);
                if (categorySkills.length === 0) return null;
                
                return (
                  <div key={category} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg">
                    <div className="bg-gradient-to-r from-gray-900 to-black px-8 py-6">
                      <h3 className="text-2xl font-serif font-bold text-white text-center">
                        {category.toUpperCase()} EXPERTISE
                      </h3>
                    </div>
                    <div className="p-8 space-y-6">
                      {categorySkills.map((skill, index) => (
                        <div key={skill.id || index} className="group">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-800 font-semibold text-lg">{skill.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-yellow-600 font-bold text-sm">{skill.level}</span>
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <div 
                                    key={i}
                                    className={`w-3 h-3 border ${
                                      i < (['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Native', 'Fluent'].indexOf(skill.level) + 1)
                                        ? 'bg-yellow-600 border-yellow-600' 
                                        : 'border-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 h-1">
                            <div 
                              className="bg-gradient-to-r from-yellow-600 to-yellow-700 h-1 transition-all duration-700 group-hover:from-yellow-500 group-hover:to-yellow-600"
                              style={{ 
                                width: `${(['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Native', 'Fluent'].indexOf(skill.level) + 1) * 20}%` 
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

        {/* Education - Executive Format */}
        {data.education.length > 0 && (
          <section>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                ACADEMIC CREDENTIALS
              </h2>
              <div className="w-48 h-1 bg-gradient-to-r from-transparent via-yellow-600 to-transparent mx-auto"></div>
            </div>
            
            <div className="space-y-8">
              {data.education.map((edu, index) => (
                <div key={edu.id || index} className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 shadow-lg p-10">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div className="lg:col-span-2">
                      <h3 className="text-3xl font-serif font-bold text-gray-900 mb-2">{edu.degree}</h3>
                      <div className="flex items-center mb-2">
                        <div className="w-4 h-4 bg-yellow-600 mr-4"></div>
                        <p className="text-2xl text-yellow-700 font-semibold">{edu.institution}</p>
                      </div>
                      {edu.field && <p className="text-gray-600 text-lg italic">Concentration: {edu.field}</p>}
                    </div>
                    <div className="text-right">
                      <div className="inline-block border-2 border-yellow-600 px-6 py-4 text-center">
                        <div className="text-gray-800 font-bold text-lg">
                          {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                        </div>
                        {edu.gpa && (
                          <div className="mt-2 text-yellow-600 font-bold text-xl">
                            {edu.gpa}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {preview && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-90 text-yellow-400 px-6 py-3 rounded text-sm font-bold tracking-wider">
          👑 EXECUTIVE
        </div>
      )}
    </div>
  );
}