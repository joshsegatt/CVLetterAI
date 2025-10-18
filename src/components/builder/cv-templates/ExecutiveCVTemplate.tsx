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
    primaryColor: '#1f2937',
    accentColor: '#dc2626',
    fontFamily: 'Inter',
    fontSize: 'medium',
    spacing: 'normal',
    ...config
  };

  const containerClass = preview 
    ? "w-full max-w-4xl mx-auto bg-white text-black shadow-2xl rounded-lg overflow-hidden transform transition-transform hover:scale-105"
    : "w-full bg-white text-black";

  return (
    <div className={containerClass}>
      {/* Executive Header */}
      <header className="relative bg-gray-900 text-white">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
          }} />
        </div>
        
        <div className="relative px-8 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              
              {/* Executive Profile */}
              <div className="flex-1">
                <div className="flex items-center gap-6 mb-6">
                  {/* Executive Photo Placeholder */}
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center shadow-xl border-4 border-white/20">
                    <div className="text-2xl font-bold text-white">
                      {data.personal.firstName?.[0]}{data.personal.lastName?.[0]}
                    </div>
                  </div>
                  
                  <div>
                    <h1 className="text-4xl font-bold mb-2 tracking-tight">
                      {data.personal.firstName} {data.personal.lastName}
                    </h1>
                    <div className="h-1 w-20 bg-red-600 rounded-full mb-3"></div>
                    <p className="text-xl text-gray-300 font-medium leading-relaxed max-w-2xl">
                      {data.personal.summary || "Executive Leader"}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Contact Information - Executive Style */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Contact Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">📧</span>
                    </div>
                    <span className="text-gray-200">{data.personal.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">📱</span>
                    </div>
                    <span className="text-gray-200">{data.personal.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">📍</span>
                    </div>
                    <span className="text-gray-200">{data.personal.location}</span>
                  </div>
                  {data.personal.linkedin && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                        <span className="text-white">💼</span>
                      </div>
                      <span className="text-gray-200 truncate">{data.personal.linkedin}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-8 py-10 space-y-12">
        
        {/* Executive Summary */}
        <section>
          <div className="bg-gray-50 rounded-2xl p-8 border-l-4 border-red-600">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="text-red-600">📋</span>
              Executive Summary
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {data.personal.summary || "Accomplished executive with proven track record of driving organizational growth and leading high-performing teams."}
            </p>
          </div>
        </section>
        
        {/* Leadership Experience */}
        {data.experience.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-4">
              <span className="text-3xl">👔</span>
              Leadership Experience
              <div className="flex-1 h-px bg-gray-300"></div>
            </h2>
            
            <div className="space-y-8">
              {data.experience.map((exp, index) => (
                <div key={exp.id || index} className="group">
                  <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300">
                    {/* Position Header */}
                    <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                          {exp.position}
                        </h3>
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-xl font-semibold text-red-600">{exp.company}</p>
                          <span className="text-gray-400">•</span>
                          <p className="text-gray-600">{exp.location}</p>
                        </div>
                      </div>
                      <div className="xl:text-right mt-4 xl:mt-0">
                        <div className="inline-block bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </div>
                        {exp.current && (
                          <div className="mt-2">
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Current Executive Role
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Achievements */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800">Key Achievements & Responsibilities:</h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {exp.description.map((item, i) => (
                          <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-sm">✓</span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{item}</p>
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

        {/* Core Competencies */}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-4">
              <span className="text-3xl">🎯</span>
              Core Competencies
              <div className="flex-1 h-px bg-gray-300"></div>
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {['Technical', 'Soft', 'Language', 'Tool'].map(category => {
                const categorySkills = data.skills.filter(skill => skill.category === category);
                if (categorySkills.length === 0) return null;
                
                return (
                  <div key={category} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-3 h-8 bg-red-600 rounded-full"></div>
                      {category === 'Soft' ? 'Leadership' : category} Skills
                    </h3>
                    <div className="space-y-4">
                      {categorySkills.map((skill, index) => (
                        <div key={skill.id || index}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800">{skill.name}</span>
                            <span className="text-sm font-medium px-3 py-1 bg-gray-200 text-gray-700 rounded-full">
                              {skill.level}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all duration-500"
                              style={{ 
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

        {/* Executive Education */}
        {data.education.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-4">
              <span className="text-3xl">🎓</span>
              Executive Education
              <div className="flex-1 h-px bg-gray-300"></div>
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.education.map((edu, index) => (
                <div key={edu.id || index} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xl">🏛️</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{edu.degree}</h3>
                      <p className="text-red-600 font-semibold mb-2">{edu.institution}</p>
                      {edu.field && <p className="text-gray-600 mb-1">Specialization: {edu.field}</p>}
                      {edu.gpa && <p className="text-gray-600 mb-2">GPA: {edu.gpa}</p>}
                      <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block">
                        {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Strategic Projects */}
        {data.projects.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-4">
              <span className="text-3xl">🚀</span>
              Strategic Initiatives
              <div className="flex-1 h-px bg-gray-300"></div>
            </h2>
            
            <div className="space-y-6">
              {data.projects.map((project, index) => (
                <div key={project.id || index} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h3>
                      <p className="text-lg text-gray-700 leading-relaxed mb-4">{project.description}</p>
                    </div>
                    <div className="xl:text-right">
                      <div className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                        {project.startDate} {project.endDate && `- ${project.endDate}`}
                      </div>
                    </div>
                  </div>
                  
                  {/* Technologies/Tools */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-600 mb-3">TECHNOLOGIES & TOOLS</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Links */}
                  {(project.url || project.github) && (
                    <div className="flex gap-4">
                      {project.url && (
                        <a 
                          href={project.url} 
                          className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium transition-colors"
                        >
                          🔗 View Project
                        </a>
                      )}
                      {project.github && (
                        <a 
                          href={project.github} 
                          className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium transition-colors"
                        >
                          📁 Repository
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
        <div className="absolute top-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-xl">
          Executive Professional
        </div>
      )}
    </div>
  );
}