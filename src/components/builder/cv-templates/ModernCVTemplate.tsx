import { CVData, CVConfig } from '../../../types/builder';

interface ModernCVTemplateProps {
  data: CVData;
  config?: Partial<CVConfig>;
  preview?: boolean;
}

export default function ModernCVTemplate({ 
  data, 
  config = {}, 
  preview = false 
}: ModernCVTemplateProps) {
  const defaultConfig: CVConfig = {
    template: 'modern',
    primaryColor: '#1e40af',
    accentColor: '#3b82f6',
    fontFamily: 'Inter',
    fontSize: 'medium',
    spacing: 'normal',
    ...config
  };

  const containerClass = preview 
    ? "w-full max-w-4xl mx-auto bg-white text-black shadow-2xl rounded-2xl overflow-hidden transform transition-transform hover:scale-105"
    : "w-full bg-white text-black";

  return (
    <div className={containerClass}>
      {/* Modern Geometric Header */}
      <header className="relative overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: `linear-gradient(45deg, ${defaultConfig.primaryColor} 0%, ${defaultConfig.accentColor} 100%)`
          }}
        />
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
          <div className="w-full h-full rounded-full" style={{ backgroundColor: defaultConfig.accentColor }} />
        </div>
        
        <div className="relative px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Name and Title */}
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-bold mb-3" style={{ color: defaultConfig.primaryColor }}>
                {data.personal.firstName}
                <span className="text-gray-700 ml-2">{data.personal.lastName}</span>
              </h1>
              <div className="text-xl text-gray-600 mb-4 font-medium">
                {data.personal.summary || "Professional Summary"}
              </div>
              
              {/* Contact Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${defaultConfig.primaryColor}20` }}>
                    <span style={{ color: defaultConfig.primaryColor }}>📧</span>
                  </div>
                  <span className="text-gray-700">{data.personal.email}</span>
                </div>
                
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${defaultConfig.primaryColor}20` }}>
                    <span style={{ color: defaultConfig.primaryColor }}>📱</span>
                  </div>
                  <span className="text-gray-700">{data.personal.phone}</span>
                </div>
                
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${defaultConfig.primaryColor}20` }}>
                    <span style={{ color: defaultConfig.primaryColor }}>📍</span>
                  </div>
                  <span className="text-gray-700">{data.personal.location}</span>
                </div>
                
                {data.personal.linkedin && (
                  <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${defaultConfig.primaryColor}20` }}>
                      <span style={{ color: defaultConfig.primaryColor }}>💼</span>
                    </div>
                    <span className="text-gray-700 truncate">{data.personal.linkedin}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Profile Image Placeholder */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-xl border-4 border-white">
                <div className="text-3xl font-bold text-gray-500">
                  {data.personal.firstName?.[0]}{data.personal.lastName?.[0]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-8 pb-8 space-y-10">
        
        {/* Experience Section */}
        {data.experience.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${defaultConfig.primaryColor}15` }}>
                <span className="text-2xl">💼</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Experience</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
            </div>
            
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={exp.id || index} className="group">
                  <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-200">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {exp.position}
                        </h3>
                        <p className="text-xl font-semibold mb-1" style={{ color: defaultConfig.primaryColor }}>
                          {exp.company}
                        </p>
                        <p className="text-gray-600">{exp.location}</p>
                      </div>
                      <div className="text-right mt-3 lg:mt-0">
                        <div className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </div>
                        {exp.current && (
                          <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            Current Position
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {exp.description.map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: defaultConfig.accentColor }} />
                          <p className="text-gray-700 leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {data.skills.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${defaultConfig.primaryColor}15` }}>
                <span className="text-2xl">🎯</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Skills</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {['Technical', 'Soft', 'Language', 'Tool'].map(category => {
                const categorySkills = data.skills.filter(skill => skill.category === category);
                if (categorySkills.length === 0) return null;
                
                return (
                  <div key={category} className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{category} Skills</h3>
                    <div className="space-y-3">
                      {categorySkills.map((skill, index) => (
                        <div key={skill.id || index} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold text-gray-800">{skill.name}</span>
                            <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ 
                              backgroundColor: `${defaultConfig.primaryColor}20`,
                              color: defaultConfig.primaryColor 
                            }}>
                              {skill.level}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500 ease-out"
                              style={{ 
                                background: `linear-gradient(90deg, ${defaultConfig.primaryColor} 0%, ${defaultConfig.accentColor} 100%)`,
                                width: `${(['Beginner', 'Intermediate', 'Advanced', 'Expert'].indexOf(skill.level) + 1) * 25}%`
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
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${defaultConfig.primaryColor}15` }}>
                <span className="text-2xl">🎓</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Education</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
            </div>
            
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={edu.id || index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{edu.degree}</h3>
                      <p className="text-lg font-semibold mb-2" style={{ color: defaultConfig.primaryColor }}>
                        {edu.institution}
                      </p>
                      {edu.field && <p className="text-gray-600 mb-1">Field: {edu.field}</p>}
                      {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded-full mt-3 lg:mt-0">
                      {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {data.projects.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${defaultConfig.primaryColor}15` }}>
                <span className="text-2xl">🚀</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Projects</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.projects.map((project, index) => (
                <div key={project.id || index} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {project.startDate} {project.endDate && `- ${project.endDate}`}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">{project.description}</p>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 text-xs font-medium rounded-full"
                        style={{ 
                          backgroundColor: `${defaultConfig.accentColor}20`,
                          color: defaultConfig.accentColor 
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  {/* Links */}
                  {(project.url || project.github) && (
                    <div className="flex gap-3">
                      {project.url && (
                        <a 
                          href={project.url} 
                          className="flex items-center gap-1 text-sm font-medium hover:underline"
                          style={{ color: defaultConfig.primaryColor }}
                        >
                          🔗 Live Demo
                        </a>
                      )}
                      {project.github && (
                        <a 
                          href={project.github} 
                          className="flex items-center gap-1 text-sm font-medium hover:underline"
                          style={{ color: defaultConfig.primaryColor }}
                        >
                          📁 GitHub
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {preview && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg">
          Modern Professional
        </div>
      )}
    </div>
  );
}