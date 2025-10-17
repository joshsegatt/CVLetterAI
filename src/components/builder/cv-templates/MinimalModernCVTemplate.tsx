import { CVData, CVConfig } from '../../../types/builder';

interface MinimalModernCVTemplateProps {
  data: CVData;
  config?: Partial<CVConfig>;
  preview?: boolean;
}

export default function MinimalModernCVTemplate({ 
  data, 
  config = {}, 
  preview = false 
}: MinimalModernCVTemplateProps) {
  const containerClass = preview 
    ? "w-full max-w-4xl mx-auto bg-white text-gray-900 shadow-lg overflow-hidden"
    : "w-full bg-white text-gray-900";

  return (
    <div className={containerClass} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Clean Header */}
      <header className="px-12 py-12 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Name and Title */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-3 tracking-tight">
                {data.personal.firstName}{' '}
                <span className="font-semibold">{data.personal.lastName}</span>
              </h1>
              <div className="w-16 h-0.5 bg-gray-900 mb-4"></div>
              <p className="text-lg text-gray-600 font-light max-w-2xl leading-relaxed">
                {data.personal.summary}
              </p>
            </div>
            
            {/* Contact Info */}
            <div className="flex flex-col gap-3 text-sm text-gray-600 lg:text-right">
              <div className="flex items-center lg:justify-end gap-3">
                <span className="text-gray-400">@</span>
                <span>{data.personal.email}</span>
              </div>
              <div className="flex items-center lg:justify-end gap-3">
                <span className="text-gray-400">📞</span>
                <span>{data.personal.phone}</span>
              </div>
              <div className="flex items-center lg:justify-end gap-3">
                <span className="text-gray-400">📍</span>
                <span>{data.personal.location}</span>
              </div>
              {data.personal.linkedin && (
                <div className="flex items-center lg:justify-end gap-3">
                  <span className="text-gray-400">💼</span>
                  <span>LinkedIn Profile</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="px-12 py-12 max-w-4xl mx-auto">
        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 pb-3 border-b border-gray-100">
              Experience
            </h2>
            <div className="space-y-10">
              {data.experience.map((exp, index) => (
                <div key={exp.id || index} className="relative">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Left: Company & Date */}
                    <div className="lg:w-1/3 flex-shrink-0">
                      <div className="sticky top-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {exp.company}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">{exp.location}</p>
                        <div className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                        </div>
                      </div>
                    </div>
                    
                    {/* Right: Position & Description */}
                    <div className="lg:w-2/3">
                      <h4 className="text-xl font-medium text-gray-900 mb-4">{exp.position}</h4>
                      <ul className="space-y-3">
                        {exp.description.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-700 leading-relaxed">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2.5 flex-shrink-0"></div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Grid */}
        {data.skills.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 pb-3 border-b border-gray-100">
              Skills & Expertise
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {['Technical', 'Soft', 'Tool', 'Language'].map(category => {
                const categorySkills = data.skills.filter(skill => skill.category === category);
                if (categorySkills.length === 0) return null;
                
                return (
                  <div key={category}>
                    <h3 className="text-lg font-medium text-gray-900 mb-6">{category} Skills</h3>
                    <div className="space-y-4">
                      {categorySkills.map((skill, index) => (
                        <div key={skill.id || index}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-800 font-medium">{skill.name}</span>
                            <span className="text-sm text-gray-500">{skill.level}</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-gray-700 to-gray-900 rounded-full transition-all duration-700"
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

        {/* Projects */}
        {data.projects.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 pb-3 border-b border-gray-100">
              Notable Projects
            </h2>
            <div className="grid gap-8 lg:grid-cols-2">
              {data.projects.map((project, index) => (
                <div key={project.id || index} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    <span className="text-sm text-gray-500">
                      {project.startDate}—{project.endDate}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">{project.description}</p>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-200">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  {/* Links */}
                  <div className="flex gap-4 text-sm">
                    {project.url && (
                      <span className="text-gray-600">🔗 Live Demo</span>
                    )}
                    {project.github && (
                      <span className="text-gray-600">💻 Source Code</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 pb-3 border-b border-gray-100">
              Education
            </h2>
            <div className="space-y-6">
              {data.education.map((edu, index) => (
                <div key={edu.id || index} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-700">{edu.institution}</p>
                    {edu.field && <p className="text-gray-600 text-sm">Major: {edu.field}</p>}
                  </div>
                  <div className="text-right">
                    <div className="text-gray-600">
                      {edu.startDate} — {edu.current ? 'Present' : edu.endDate}
                    </div>
                    {edu.gpa && (
                      <div className="text-sm text-gray-500 mt-1">{edu.gpa}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {preview && (
        <div className="absolute top-4 right-4 bg-gray-900 text-white px-4 py-2 rounded text-sm font-medium">
          Modern Minimal
        </div>
      )}
    </div>
  );
}