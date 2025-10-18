import { CVData, CVConfig } from '../../../types/builder';

interface LinkedInCVTemplateProps {
  data: CVData;
  config?: Partial<CVConfig>;
  preview?: boolean;
}

export default function LinkedInCVTemplate({ 
  data, 
  config = {}, 
  preview = false 
}: LinkedInCVTemplateProps) {
  const defaultConfig: CVConfig = {
    template: 'modern',
    primaryColor: '#0a66c2',
    accentColor: '#0e76a8', 
    fontFamily: 'Inter',
    fontSize: 'medium',
    spacing: 'normal',
    ...config
  };

  const containerClass = preview 
    ? "w-full max-w-4xl mx-auto bg-white text-black shadow-2xl rounded-xl overflow-hidden transform transition-transform hover:scale-105"
    : "w-full bg-white text-black";

  return (
    <div className={containerClass}>
      {/* LinkedIn-style Header with Banner */}
      <div className="relative">
        {/* Banner */}
        <div 
          className="h-32 w-full"
          style={{ 
            background: `linear-gradient(135deg, ${defaultConfig.primaryColor} 0%, ${defaultConfig.accentColor} 100%)`
          }}
        />
        
        {/* Profile Section */}
        <div className="px-8 pb-6 relative">
          {/* Profile Picture Placeholder */}
          <div className="absolute -top-16 left-8">
            <div className="w-32 h-32 bg-gray-200 border-4 border-white rounded-full flex items-center justify-center shadow-lg">
              <div className="text-4xl font-bold text-gray-600">
                {data.personal.firstName?.[0]}{data.personal.lastName?.[0]}
              </div>
            </div>
          </div>
          
          {/* Name and Title */}
          <div className="ml-40 pt-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {data.personal.firstName} {data.personal.lastName}
            </h1>
            <p className="text-xl text-gray-700 font-medium mb-3">
              {data.personal.summary || "Professional"}
            </p>
            
            {/* Contact Info - LinkedIn Style */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 text-blue-600">📍</span>
                <span>{data.personal.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 text-blue-600">📧</span>
                <span>{data.personal.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 text-blue-600">📱</span>
                <span>{data.personal.phone}</span>
              </div>
              {data.personal.linkedin && (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 text-blue-600">💼</span>
                  <span className="text-blue-600 hover:underline">{data.personal.linkedin}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 pb-8 space-y-8">
        
        {/* About Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <div 
              className="w-1 h-8 rounded-full"
              style={{ backgroundColor: defaultConfig.primaryColor }}
            />
            About
          </h2>
          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-gray-700 leading-relaxed">
              {data.personal.summary || "Professional summary and career objectives go here."}
            </p>
          </div>
        </section>

        {/* Experience Section */}
        {data.experience.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div 
                className="w-1 h-8 rounded-full"
                style={{ backgroundColor: defaultConfig.primaryColor }}
              />
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={exp.id || index} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-6 w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-md"></div>
                  
                  {/* Content */}
                  <div className="ml-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                        <p className="text-lg font-medium text-blue-600">{exp.company}</p>
                        <p className="text-sm text-gray-500">{exp.location}</p>
                      </div>
                      <div className="text-sm text-gray-500 lg:text-right mt-2 lg:mt-0">
                        <div className="font-medium">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </div>
                        {exp.current && (
                          <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Current Role
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {exp.description.map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-blue-600 text-sm mt-1">•</span>
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

        {/* Skills Section - LinkedIn Cards Style */}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div 
                className="w-1 h-8 rounded-full"
                style={{ backgroundColor: defaultConfig.primaryColor }}
              />
              Skills & Expertise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['Technical', 'Soft', 'Language', 'Tool'].map(category => {
                const categorySkills = data.skills.filter(skill => skill.category === category);
                if (categorySkills.length === 0) return null;
                
                return (
                  <div key={category} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">{category} Skills</h3>
                    <div className="space-y-3">
                      {categorySkills.map((skill, index) => (
                        <div key={skill.id || index} className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800">{skill.name}</span>
                            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                              {skill.level}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-300"
                              style={{ 
                                backgroundColor: defaultConfig.primaryColor,
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div 
                className="w-1 h-8 rounded-full"
                style={{ backgroundColor: defaultConfig.primaryColor }}
              />
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={edu.id || index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-lg text-blue-600 font-medium">{edu.institution}</p>
                      {edu.field && <p className="text-gray-600">Field of Study: {edu.field}</p>}
                      {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-sm text-gray-500 lg:text-right mt-2 lg:mt-0">
                      <div className="font-medium">
                        {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                      </div>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div 
                className="w-1 h-8 rounded-full"
                style={{ backgroundColor: defaultConfig.primaryColor }}
              />
              Projects
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.projects.map((project, index) => (
                <div key={project.id || index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                    <div className="text-sm text-gray-500">
                      {project.startDate} {project.endDate && `- ${project.endDate}`}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">{project.description}</p>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
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
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          🔗 Live Demo
                        </a>
                      )}
                      {project.github && (
                        <a 
                          href={project.github} 
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
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
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg">
          LinkedIn Style
        </div>
      )}
    </div>
  );
}