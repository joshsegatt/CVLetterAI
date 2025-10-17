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
    primaryColor: '#2563eb',
    accentColor: '#0ea5e9',
    fontFamily: 'Inter',
    fontSize: 'medium',
    spacing: 'normal',
    ...config
  };

  const containerClass = preview 
    ? "w-full max-w-4xl mx-auto bg-white text-black shadow-xl rounded-lg overflow-hidden transform transition-transform hover:scale-105"
    : "w-full bg-white text-black";

  return (
    <div className={containerClass}>
      {/* Header Section */}
      <header 
        className="px-8 py-6"
        style={{ backgroundColor: defaultConfig.primaryColor }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {data.personal.firstName} {data.personal.lastName}
            </h1>
            <p className="text-lg opacity-90 mb-3">{data.personal.summary}</p>
          </div>
          
          <div className="text-white text-sm space-y-1 md:text-right">
            <div className="flex items-center gap-2 md:justify-end">
              <span>📧</span>
              <span>{data.personal.email}</span>
            </div>
            <div className="flex items-center gap-2 md:justify-end">
              <span>📱</span>
              <span>{data.personal.phone}</span>
            </div>
            <div className="flex items-center gap-2 md:justify-end">
              <span>📍</span>
              <span>{data.personal.location}</span>
            </div>
            {data.personal.linkedin && (
              <div className="flex items-center gap-2 md:justify-end">
                <span>💼</span>
                <span className="truncate">{data.personal.linkedin}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8 space-y-8">
        
        {/* Experience Section */}
        {data.experience.length > 0 && (
          <section>
            <h2 
              className="text-2xl font-bold mb-4 pb-2 border-b-2"
              style={{ borderColor: defaultConfig.accentColor, color: defaultConfig.primaryColor }}
            >
              Professional Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={exp.id || index} className="relative">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{exp.position}</h3>
                      <p className="text-lg text-gray-600">{exp.company}</p>
                    </div>
                    <div className="text-sm text-gray-500 md:text-right">
                      <div>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                      <div>{exp.location}</div>
                    </div>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    {exp.description.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {data.education.length > 0 && (
          <section>
            <h2 
              className="text-2xl font-bold mb-4 pb-2 border-b-2"
              style={{ borderColor: defaultConfig.accentColor, color: defaultConfig.primaryColor }}
            >
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={edu.id || index} className="flex flex-col md:flex-row md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.institution}</p>
                    {edu.field && <p className="text-gray-500 text-sm">Major: {edu.field}</p>}
                  </div>
                  <div className="text-sm text-gray-500 md:text-right">
                    <div>{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</div>
                    {edu.gpa && <div>GPA: {edu.gpa}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {data.skills.length > 0 && (
          <section>
            <h2 
              className="text-2xl font-bold mb-4 pb-2 border-b-2"
              style={{ borderColor: defaultConfig.accentColor, color: defaultConfig.primaryColor }}
            >
              Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Technical', 'Soft', 'Language', 'Tool'].map(category => {
                const categorySkills = data.skills.filter(skill => skill.category === category);
                if (categorySkills.length === 0) return null;
                
                return (
                  <div key={category}>
                    <h3 className="font-semibold text-gray-700 mb-2">{category} Skills</h3>
                    <div className="space-y-2">
                      {categorySkills.map((skill, index) => (
                        <div key={skill.id || index} className="flex items-center justify-between">
                          <span className="text-gray-700">{skill.name}</span>
                          <div className="flex items-center gap-1">
                            {[...Array(4)].map((_, i) => (
                              <div 
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < (['Beginner', 'Intermediate', 'Advanced', 'Expert'].indexOf(skill.level) + 1)
                                    ? 'bg-blue-500' 
                                    : 'bg-gray-300'
                                }`}
                              />
                            ))}
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

        {/* Projects Section */}
        {data.projects.length > 0 && (
          <section>
            <h2 
              className="text-2xl font-bold mb-4 pb-2 border-b-2"
              style={{ borderColor: defaultConfig.accentColor, color: defaultConfig.primaryColor }}
            >
              Projects
            </h2>
            <div className="space-y-4">
              {data.projects.map((project, index) => (
                <div key={project.id || index}>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                    <div className="text-sm text-gray-500">
                      {project.startDate} {project.endDate && `- ${project.endDate}`}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.technologies.map((tech, i) => (
                      <span 
                        key={i}
                        className="px-2 py-1 text-xs rounded-full text-white"
                        style={{ backgroundColor: defaultConfig.accentColor }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {(project.url || project.github) && (
                    <div className="flex gap-4 text-sm">
                      {project.url && (
                        <a href={project.url} className="text-blue-600 hover:underline">
                          🔗 Live Demo
                        </a>
                      )}
                      {project.github && (
                        <a href={project.github} className="text-blue-600 hover:underline">
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
        <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm">
          Modern Template
        </div>
      )}
    </div>
  );
}