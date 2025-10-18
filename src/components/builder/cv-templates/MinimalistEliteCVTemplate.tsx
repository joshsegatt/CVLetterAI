import { CVData, CVConfig } from '../../../types/builder';

interface MinimalistEliteCVTemplateProps {
  data: CVData;
  config?: Partial<CVConfig>;
  preview?: boolean;
}

export default function MinimalistEliteCVTemplate({ 
  data, 
  config = {}, 
  preview = false 
}: MinimalistEliteCVTemplateProps) {
  const containerClass = preview 
    ? "w-full max-w-4xl mx-auto bg-white text-gray-900 shadow-lg overflow-hidden text-xs"
    : "w-full bg-white text-gray-900";

  return (
    <div className={containerClass} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Ultra Clean Header */}
      <header className={`${preview ? 'px-4 py-4' : 'px-16 py-16'} border-b border-gray-100`}>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className={`${preview ? 'text-lg' : 'text-5xl'} font-light text-gray-900 ${preview ? 'mb-1' : 'mb-4'} tracking-tight`}>
            {data.personal.firstName} {data.personal.lastName}
          </h1>
          
          <div className="flex items-center justify-center gap-8 text-sm text-gray-600 mb-8">
            <span>{data.personal.email}</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span>{data.personal.phone}</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span>{data.personal.location}</span>
          </div>
          
          <p className="text-lg text-gray-700 font-light leading-relaxed max-w-2xl mx-auto">
            {data.personal.summary}
          </p>
        </div>
      </header>

      <div className="px-16 py-16 max-w-3xl mx-auto">
        
        {/* Experience - Ultra Clean */}
        {data.experience.length > 0 && (
          <section className="mb-20">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-12 text-center">
              Experience
            </h2>
            <div className="space-y-16">
              {data.experience.map((exp, index) => (
                <div key={exp.id || index} className="text-center">
                  <h3 className="text-2xl font-light text-gray-900 mb-2">{exp.position}</h3>
                  <div className="text-gray-600 mb-1">{exp.company}</div>
                  <div className="text-sm text-gray-500 mb-8">
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate} • {exp.location}
                  </div>
                  
                  <div className="max-w-2xl mx-auto">
                    <div className="grid gap-4 text-left">
                      {exp.description.slice(0, 3).map((item, i) => (
                        <p key={i} className="text-gray-700 leading-relaxed">
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills - Minimalist Grid */}
        {data.skills.length > 0 && (
          <section className="mb-20">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-12 text-center">
              Expertise
            </h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {data.skills.slice(0, 12).map((skill, index) => (
                <div key={skill.id || index} className="group">
                  <div className="text-gray-900 font-medium mb-2">{skill.name}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">{skill.level}</div>
                  <div className="w-full h-px bg-gray-200 mt-3 group-hover:bg-gray-400 transition-colors"></div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects - Clean Cards */}
        {data.projects.length > 0 && (
          <section className="mb-20">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-12 text-center">
              Featured Projects
            </h2>
            
            <div className="space-y-12">
              {data.projects.slice(0, 2).map((project, index) => (
                <div key={project.id || index} className="text-center border-t border-gray-100 pt-12">
                  <h3 className="text-xl font-medium text-gray-900 mb-4">{project.name}</h3>
                  <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto mb-6">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-3 mb-6">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="text-xs text-gray-600 font-medium uppercase tracking-wider px-3 py-1 border border-gray-200 rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {project.startDate} — {project.endDate}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education - Simple */}
        {data.education.length > 0 && (
          <section className="mb-20">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-12 text-center">
              Education
            </h2>
            
            <div className="space-y-8 text-center">
              {data.education.map((edu, index) => (
                <div key={edu.id || index}>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{edu.degree}</h3>
                  <div className="text-gray-700 mb-1">{edu.institution}</div>
                  {edu.field && <div className="text-gray-600 mb-1">{edu.field}</div>}
                  <div className="text-sm text-gray-500">
                    {edu.startDate} — {edu.current ? 'Present' : edu.endDate}
                    {edu.gpa && ` • ${edu.gpa}`}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages - Inline */}
        {data.languages.length > 0 && (
          <section className="text-center">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
              Languages
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {data.languages.map((lang, index) => (
                <div key={lang.id || index} className="text-gray-700">
                  <span className="font-medium">{lang.name}</span>
                  <span className="text-gray-500 text-sm ml-2">({lang.level})</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {preview && (
        <div className="absolute top-4 right-4 bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm font-medium">
          Minimalist Elite
        </div>
      )}
    </div>
  );
}