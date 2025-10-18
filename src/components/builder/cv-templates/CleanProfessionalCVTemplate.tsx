import { CVData, CVConfig } from '../../../types/builder';

interface CleanProfessionalCVTemplateProps {
  data: CVData;
  config?: Partial<CVConfig>;
  preview?: boolean;
}

export default function CleanProfessionalCVTemplate({ 
  data, 
  config = {}, 
  preview = false 
}: CleanProfessionalCVTemplateProps) {
  const containerClass = preview 
    ? "w-full max-w-4xl mx-auto bg-white text-gray-900 shadow-lg overflow-hidden text-xs"
    : "w-full bg-white text-gray-900";

  return (
    <div className={containerClass} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Two Column Layout */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className={`w-1/3 bg-gradient-to-b from-indigo-50 to-blue-50 ${preview ? 'p-2' : 'p-8'}`}>
          {/* Profile Section */}
          <div className="mb-8">
            <div className={`${preview ? 'w-8 h-8' : 'w-24 h-24'} bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center ${preview ? 'mb-2' : 'mb-6'}`}>
              <span className={`${preview ? 'text-xs' : 'text-2xl'} font-bold text-white`}>
                {data.personal.firstName.charAt(0)}{data.personal.lastName.charAt(0)}
              </span>
            </div>
            <h1 className={`${preview ? 'text-xs' : 'text-2xl'} font-bold text-gray-900 ${preview ? 'mb-1' : 'mb-2'} leading-tight`}>
              {data.personal.firstName}<br />{data.personal.lastName}
            </h1>
            <div className={`${preview ? 'w-6 h-0.5' : 'w-12 h-0.5'} bg-indigo-500 ${preview ? 'mb-2' : 'mb-4'}`}></div>
          </div>

          {/* Contact */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Contact</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 mt-0.5 flex-shrink-0">📧</div>
                <span className="break-all">{data.personal.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 mt-0.5 flex-shrink-0">📱</div>
                <span>{data.personal.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 mt-0.5 flex-shrink-0">📍</div>
                <span>{data.personal.location}</span>
              </div>
              {data.personal.linkedin && (
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 mt-0.5 flex-shrink-0">💼</div>
                  <span>LinkedIn</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {data.skills.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Skills</h3>
              <div className="space-y-6">
                {['Technical', 'Soft', 'Tool', 'Language'].map(category => {
                  const categorySkills = data.skills.filter(skill => skill.category === category);
                  if (categorySkills.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <h4 className="text-xs font-medium text-gray-600 uppercase mb-3">{category}</h4>
                      <div className="space-y-3">
                        {categorySkills.slice(0, 4).map((skill, index) => (
                          <div key={skill.id || index}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-800">{skill.name}</span>
                            </div>
                            <div className="w-full bg-gray-200 h-1.5 rounded-full">
                              <div 
                                className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
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
            </div>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Languages</h3>
              <div className="space-y-2">
                {data.languages.map((lang, index) => (
                  <div key={lang.id || index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-800">{lang.name}</span>
                    <span className="text-xs text-gray-600">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="w-2/3 p-8">
          {/* Summary */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Summary</h2>
            <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
          </div>

          {/* Experience */}
          {data.experience.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Experience</h2>
              <div className="space-y-8">
                {data.experience.map((exp, index) => (
                  <div key={exp.id || index} className="relative pl-6 border-l-2 border-indigo-100">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-indigo-500 rounded-full"></div>
                    
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                      <div className="flex items-center gap-3 text-sm text-indigo-600 font-medium">
                        <span>{exp.company}</span>
                        <span>•</span>
                        <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                      </div>
                      <p className="text-sm text-gray-600">{exp.location}</p>
                    </div>
                    
                    <ul className="space-y-2">
                      {exp.description.slice(0, 3).map((item, i) => (
                        <li key={i} className="text-gray-700 text-sm leading-relaxed pl-2">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Key Projects</h2>
              <div className="space-y-6">
                {data.projects.slice(0, 2).map((project, index) => (
                  <div key={project.id || index} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <span className="text-xs text-gray-500">{project.startDate}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 4).map((tech, i) => (
                        <span key={i} className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Education</h2>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={edu.id || index} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-700">{edu.institution}</p>
                      {edu.field && <p className="text-sm text-gray-600">{edu.field}</p>}
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <div>{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</div>
                      {edu.gpa && <div className="font-medium">{edu.gpa}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {preview && (
        <div className="absolute top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium">
          Clean Professional
        </div>
      )}
    </div>
  );
}