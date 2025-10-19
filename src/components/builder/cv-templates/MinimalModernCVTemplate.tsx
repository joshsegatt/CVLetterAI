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
  // Configurações com valores padrão
  const {
    primaryColor = '#1e40af',
    accentColor = '#60a5fa',
    fontFamily = 'Inter, system-ui, sans-serif',
    fontSize = 'medium',
    spacing = 'normal',
    showPhoto = false,
    highlightSkills = true,
    twoColumn = false,
    sectionIcons = true
  } = config;

  // Classes de tamanho baseadas na configuração
  const sizeClasses = {
    small: {
      header: preview ? 'text-base' : 'text-3xl lg:text-4xl',
      section: preview ? 'text-sm' : 'text-xl',
      subsection: preview ? 'text-xs' : 'text-base',
      body: preview ? 'text-xs' : 'text-sm',
      padding: preview ? 'px-3 py-3' : 'px-8 py-8'
    },
    medium: {
      header: preview ? 'text-lg' : 'text-4xl lg:text-5xl',
      section: preview ? 'text-base' : 'text-2xl',
      subsection: preview ? 'text-sm' : 'text-lg',
      body: preview ? 'text-xs' : 'text-base',
      padding: preview ? 'px-4 py-4' : 'px-12 py-12'
    },
    large: {
      header: preview ? 'text-xl' : 'text-5xl lg:text-6xl',
      section: preview ? 'text-lg' : 'text-3xl',
      subsection: preview ? 'text-base' : 'text-xl',
      body: preview ? 'text-sm' : 'text-lg',
      padding: preview ? 'px-5 py-5' : 'px-16 py-16'
    }
  };

  const spacingClasses = {
    compact: {
      section: 'mb-6',
      item: 'mb-3',
      gap: 'space-y-2'
    },
    normal: {
      section: 'mb-10',
      item: 'mb-6',
      gap: 'space-y-4'
    },
    relaxed: {
      section: 'mb-16',
      item: 'mb-9',
      gap: 'space-y-6'
    }
  };

  const sizes = sizeClasses[fontSize];
  const spacings = spacingClasses[spacing];

  const containerClass = preview 
    ? "w-full max-w-4xl mx-auto bg-white text-gray-900 shadow-lg overflow-hidden"
    : "w-full bg-white text-gray-900";

  return (
    <div 
      className={containerClass} 
      style={{ 
        fontFamily,
        '--primary-color': primaryColor,
        '--accent-color': accentColor
      } as React.CSSProperties}
    >
      {/* Header */}
      <header 
        className={`${sizes.padding} border-b border-gray-100`}
        style={{ 
          background: `linear-gradient(135deg, ${primaryColor}08 0%, ${accentColor}08 100%)` 
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className={`flex ${twoColumn ? 'flex-col lg:flex-row lg:items-start lg:justify-between' : 'flex-col'} gap-4`}>
            {/* Name and Title */}
            <div className={twoColumn ? 'lg:flex-1' : ''}>
              <div className="flex items-center gap-4 mb-3">
                {showPhoto && (
                  <div 
                    className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gray-200 flex-shrink-0 border-3 overflow-hidden" 
                    style={{ borderColor: primaryColor }}
                  >
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 text-2xl">
                      👤
                    </div>
                  </div>
                )}
                <div>
                  <h1 className={`${sizes.header} font-light text-gray-900 mb-2 tracking-tight`}>
                    {data.personal.firstName}{' '}
                    <span className="font-bold">{data.personal.lastName}</span>
                  </h1>
                  <div 
                    className={`${preview ? 'w-12 h-1' : 'w-20 h-1'} mb-2 rounded-full`}
                    style={{ backgroundColor: primaryColor }}
                  />
                </div>
              </div>
              <p className={`${sizes.body} text-gray-600 font-light max-w-2xl leading-relaxed`}>
                {preview ? data.personal.summary.slice(0, 120) + '...' : data.personal.summary}
              </p>
            </div>
            
            {/* Contact Info */}
            <div className={`flex ${twoColumn ? 'flex-col lg:text-right' : 'flex-row flex-wrap'} gap-3 ${sizes.body} text-gray-600`}>
              <div className="flex items-center gap-2">
                {sectionIcons && <span className="text-lg" style={{ color: primaryColor }}>📧</span>}
                <span>{data.personal.email}</span>
              </div>
              <div className="flex items-center gap-2">
                {sectionIcons && <span className="text-lg" style={{ color: primaryColor }}>📞</span>}
                <span>{data.personal.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                {sectionIcons && <span className="text-lg" style={{ color: primaryColor }}>📍</span>}
                <span>{data.personal.location}</span>
              </div>
              {data.personal.linkedin && (
                <div className="flex items-center gap-2">
                  {sectionIcons && <span className="text-lg" style={{ color: primaryColor }}>💼</span>}
                  <span>{data.personal.linkedin}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className={`${sizes.padding} max-w-4xl mx-auto ${spacings.gap}`}>
        {/* Experience */}
        {data.experience.length > 0 && (
          <section className={spacings.section}>
            <h2 
              className={`${sizes.section} font-bold text-gray-900 mb-6 pb-2 border-b-2 flex items-center gap-3`}
              style={{ borderColor: primaryColor }}
            >
              {sectionIcons && <span style={{ color: primaryColor }}>💼</span>}
              Experiência Profissional
            </h2>
            <div className={spacings.gap}>
              {data.experience.slice(0, preview ? 2 : undefined).map((exp, index) => (
                <div key={exp.id || index} className={`relative ${spacings.item}`}>
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Left: Company & Date */}
                    <div className="lg:w-1/3 flex-shrink-0">
                      <h3 className={`${sizes.subsection} font-bold text-gray-900 mb-1`}>
                        {exp.company}
                      </h3>
                      <p className={`${sizes.body} text-gray-500 mb-2`}>{exp.location}</p>
                      <div 
                        className={`inline-flex items-center px-3 py-1 text-white ${sizes.body} font-medium rounded-full`}
                        style={{ backgroundColor: accentColor }}
                      >
                        {exp.startDate} — {exp.current ? 'Atual' : exp.endDate}
                      </div>
                    </div>
                    
                    {/* Right: Position & Description */}
                    <div className="lg:w-2/3">
                      <h4 className={`${sizes.subsection} font-semibold text-gray-900 mb-3`} style={{ color: primaryColor }}>
                        {exp.position}
                      </h4>
                      <ul className={spacings.gap}>
                        {exp.description.slice(0, preview ? 2 : undefined).map((item, i) => (
                          <li key={i} className={`flex items-start gap-3 ${sizes.body} text-gray-700 leading-relaxed`}>
                            <div 
                              className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                              style={{ backgroundColor: accentColor }}
                            />
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

        {/* Education */}
        {data.education.length > 0 && (
          <section className={spacings.section}>
            <h2 
              className={`${sizes.section} font-bold text-gray-900 mb-6 pb-2 border-b-2 flex items-center gap-3`}
              style={{ borderColor: primaryColor }}
            >
              {sectionIcons && <span style={{ color: primaryColor }}>🎓</span>}
              Educação
            </h2>
            <div className={spacings.gap}>
              {data.education.slice(0, preview ? 2 : undefined).map((edu, index) => (
                <div key={edu.id || index} className={spacings.item}>
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="lg:w-1/3 flex-shrink-0">
                      <h3 className={`${sizes.subsection} font-bold text-gray-900 mb-1`}>
                        {edu.institution}
                      </h3>
                      <div 
                        className={`inline-flex items-center px-3 py-1 text-white ${sizes.body} font-medium rounded-full`}
                        style={{ backgroundColor: accentColor }}
                      >
                        {edu.startDate} — {edu.current ? 'Atual' : edu.endDate}
                      </div>
                    </div>
                    <div className="lg:w-2/3">
                      <h4 className={`${sizes.subsection} font-semibold mb-1`} style={{ color: primaryColor }}>
                        {edu.degree}
                      </h4>
                      <p className={`${sizes.body} text-gray-600`}>
                        {edu.field}
                      </p>
                      {edu.gpa && (
                        <p className={`${sizes.body} text-gray-500 mt-1`}>
                          GPA: {edu.gpa}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section className={spacings.section}>
            <h2 
              className={`${sizes.section} font-bold text-gray-900 mb-6 pb-2 border-b-2 flex items-center gap-3`}
              style={{ borderColor: primaryColor }}
            >
              {sectionIcons && <span style={{ color: primaryColor }}>🛠️</span>}
              Habilidades
            </h2>
            
            {highlightSkills ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.skills.slice(0, preview ? 6 : undefined).map((skill, index) => (
                  <div key={skill.id || index} className="relative">
                    <div 
                      className="p-4 rounded-lg border-l-4"
                      style={{ 
                        backgroundColor: `${accentColor}10`,
                        borderColor: primaryColor
                      }}
                    >
                      <h4 className={`${sizes.body} font-semibold text-gray-900 mb-1`}>
                        {skill.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span 
                          className={`${sizes.body} text-white px-2 py-1 rounded text-xs font-medium`}
                          style={{ backgroundColor: accentColor }}
                        >
                          {skill.level}
                        </span>
                        <span className={`${sizes.body} text-gray-500 capitalize`}>
                          {skill.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {data.skills.slice(0, preview ? 8 : undefined).map((skill, index) => (
                  <span 
                    key={skill.id || index}
                    className={`px-4 py-2 rounded-full ${sizes.body} font-medium text-white`}
                    style={{ backgroundColor: primaryColor }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section className={spacings.section}>
            <h2 
              className={`${sizes.section} font-bold text-gray-900 mb-6 pb-2 border-b-2 flex items-center gap-3`}
              style={{ borderColor: primaryColor }}
            >
              {sectionIcons && <span style={{ color: primaryColor }}>🚀</span>}
              Projetos
            </h2>
            <div className={spacings.gap}>
              {data.projects.slice(0, preview ? 2 : undefined).map((project, index) => (
                <div key={project.id || index} className={spacings.item}>
                  <h3 className={`${sizes.subsection} font-bold mb-2`} style={{ color: primaryColor }}>
                    {project.name}
                  </h3>
                  <p className={`${sizes.body} text-gray-700 mb-3 leading-relaxed`}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, preview ? 4 : undefined).map((tech, i) => (
                      <span 
                        key={i}
                        className={`px-3 py-1 rounded-full ${sizes.body} text-gray-700 border`}
                        style={{ borderColor: accentColor, backgroundColor: `${accentColor}10` }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <section className={spacings.section}>
            <h2 
              className={`${sizes.section} font-bold text-gray-900 mb-6 pb-2 border-b-2 flex items-center gap-3`}
              style={{ borderColor: primaryColor }}
            >
              {sectionIcons && <span style={{ color: primaryColor }}>🌐</span>}
              Idiomas
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.languages.map((language, index) => (
                <div key={language.id || index} className="flex items-center gap-3">
                  <span className={`${sizes.body} font-semibold text-gray-900`}>
                    {language.name}
                  </span>
                  <span 
                    className={`${sizes.body} text-white px-2 py-1 rounded-full text-xs`}
                    style={{ backgroundColor: accentColor }}
                  >
                    {language.level}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certificates */}
        {data.certificates && data.certificates.length > 0 && (
          <section className={spacings.section}>
            <h2 
              className={`${sizes.section} font-bold text-gray-900 mb-6 pb-2 border-b-2 flex items-center gap-3`}
              style={{ borderColor: primaryColor }}
            >
              {sectionIcons && <span style={{ color: primaryColor }}>🏆</span>}
              Certificações
            </h2>
            <div className={spacings.gap}>
              {data.certificates.slice(0, preview ? 3 : undefined).map((cert, index) => (
                <div key={cert.id || index} className="flex items-center justify-between">
                  <div>
                    <h3 className={`${sizes.body} font-semibold text-gray-900`}>
                      {cert.name}
                    </h3>
                    <p className={`${sizes.body} text-gray-600`}>
                      {cert.issuer}
                    </p>
                  </div>
                  <span 
                    className={`${sizes.body} text-white px-3 py-1 rounded-full`}
                    style={{ backgroundColor: primaryColor }}
                  >
                    {cert.date}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}