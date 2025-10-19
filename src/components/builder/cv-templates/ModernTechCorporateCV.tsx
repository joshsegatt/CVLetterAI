'use client';

import { CVData } from '@/types/builder';

interface ModernTechCorporateCVProps {
  data: CVData;
  colorScheme?: 'tech-blue' | 'silicon-gray' | 'startup-green' | 'innovation-purple' | 'digital-orange' | 'cyber-dark';
  showPhoto?: boolean;
  className?: string;
}

export default function ModernTechCorporateCV({ 
  data, 
  colorScheme = 'tech-blue',
  showPhoto = true,
  className = '' 
}: ModernTechCorporateCVProps) {
  const colorSchemes = {
    'tech-blue': {
      primary: 'rgb(59, 130, 246)', // Blue-500
      secondary: 'rgb(30, 64, 175)', // Blue-800  
      accent: 'rgb(147, 197, 253)', // Blue-300
      text: 'rgb(51, 65, 85)', // Slate-700
      background: 'rgb(255, 255, 255)',
      card: 'rgb(248, 250, 252)', // Slate-50
      border: 'rgb(226, 232, 240)' // Slate-200
    },
    'silicon-gray': {
      primary: 'rgb(71, 85, 105)', // Slate-600
      secondary: 'rgb(30, 41, 59)', // Slate-800
      accent: 'rgb(148, 163, 184)', // Slate-400
      text: 'rgb(51, 65, 85)',
      background: 'rgb(255, 255, 255)',
      card: 'rgb(248, 250, 252)',
      border: 'rgb(226, 232, 240)'
    },
    'startup-green': {
      primary: 'rgb(34, 197, 94)', // Green-500
      secondary: 'rgb(21, 128, 61)', // Green-700
      accent: 'rgb(134, 239, 172)', // Green-300
      text: 'rgb(51, 65, 85)',
      background: 'rgb(255, 255, 255)',
      card: 'rgb(240, 253, 244)', // Green-50
      border: 'rgb(187, 247, 208)' // Green-200
    },
    'innovation-purple': {
      primary: 'rgb(147, 51, 234)', // Purple-600
      secondary: 'rgb(88, 28, 135)', // Purple-800
      accent: 'rgb(196, 181, 253)', // Purple-300
      text: 'rgb(51, 65, 85)',
      background: 'rgb(255, 255, 255)',
      card: 'rgb(250, 245, 255)', // Purple-50
      border: 'rgb(221, 214, 254)' // Purple-200
    },
    'digital-orange': {
      primary: 'rgb(249, 115, 22)', // Orange-500
      secondary: 'rgb(194, 65, 12)', // Orange-700
      accent: 'rgb(254, 215, 170)', // Orange-200
      text: 'rgb(51, 65, 85)',
      background: 'rgb(255, 255, 255)',
      card: 'rgb(255, 247, 237)', // Orange-50
      border: 'rgb(254, 215, 170)' // Orange-200
    },
    'cyber-dark': {
      primary: 'rgb(45, 45, 45)',
      secondary: 'rgb(25, 25, 25)',
      accent: 'rgb(0, 255, 157)', // Neon green
      text: 'rgb(60, 60, 60)',
      background: 'rgb(255, 255, 255)',
      card: 'rgb(250, 250, 250)',
      border: 'rgb(230, 230, 230)'
    }
  };

  const colors = colorSchemes[colorScheme];

  return (
    <div 
      className={`modern-tech-corporate-cv ${className}`}
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", Consolas, monospace',
        fontSize: '14px',
        lineHeight: '1.5',
        width: '794px',
        minHeight: '1123px',
        margin: '0 auto',
        padding: '32px',
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      {/* Gradient Header */}
      <header style={{ 
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        color: 'white',
        margin: '-32px -32px 32px -32px',
        padding: '40px 32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Geometric Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${colors.accent}20 0%, transparent 70%)`,
          transform: 'translate(50%, -50%)'
        }} />
        
        <div style={{ 
          display: 'flex', 
          gap: '32px', 
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          {showPhoto && data.personal?.photo && (
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '12px',
              overflow: 'hidden',
              flexShrink: 0,
              border: '3px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}>
              <img 
                src={data.personal.photo} 
                alt="Tech Professional"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}
          
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              margin: '0 0 8px 0',
              letterSpacing: '-1px',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              {`${data.personal?.firstName || ''} ${data.personal?.lastName || ''}`.trim() || 'Tech Professional'}
            </h1>
            
            <div style={{
              fontSize: '18px',
              fontWeight: '400',
              margin: '0 0 16px 0',
              opacity: 0.9,
              fontFamily: '"Inter", sans-serif'
            }}>
              {data.personal?.title || 'Senior Developer / Tech Lead'}
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              fontSize: '13px',
              opacity: 0.8
            }}>
              {data.personal?.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>✉</span> {data.personal.email}
                </div>
              )}
              {data.personal?.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📱</span> {data.personal.phone}
                </div>
              )}
              {data.personal?.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🌍</span> {data.personal.location}
                </div>
              )}
              {data.personal?.linkedin && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>💼</span> {data.personal.linkedin}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '32px'
      }}>
        {/* Left Column - Main Content */}
        <div>
          {/* Tech Summary */}
          {data.personal?.summary && (
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: colors.primary,
                margin: '0 0 16px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{
                  width: '4px',
                  height: '24px',
                  backgroundColor: colors.primary,
                  borderRadius: '2px'
                }} />
                Technical Profile
              </h2>
              <div style={{
                backgroundColor: colors.card,
                padding: '20px',
                borderRadius: '8px',
                borderLeft: `4px solid ${colors.primary}`,
                fontFamily: '"Inter", sans-serif',
                lineHeight: '1.6'
              }}>
                {data.personal.summary}
              </div>
            </section>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: colors.primary,
                margin: '0 0 20px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{
                  width: '4px',
                  height: '24px',
                  backgroundColor: colors.primary,
                  borderRadius: '2px'
                }} />
                Professional Experience
              </h2>
              {data.experience.map((exp, index) => (
                <div key={index} style={{ 
                  marginBottom: '24px',
                  backgroundColor: colors.card,
                  padding: '20px',
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`,
                  position: 'relative'
                }}>
                  {/* Tech Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    backgroundColor: colors.primary,
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '500'
                  }}>
                    {exp.startDate} - {exp.current ? 'Current' : exp.endDate}
                  </div>
                  
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: colors.secondary,
                    margin: '0 0 4px 0'
                  }}>
                    {exp.position}
                  </h3>
                  <p style={{
                    fontSize: '16px',
                    color: colors.primary,
                    margin: '0 0 12px 0',
                    fontWeight: '500'
                  }}>
                    {exp.company}
                  </p>
                  {exp.description && exp.description.length > 0 && (
                    <div style={{
                      fontSize: '14px',
                      lineHeight: '1.6',
                      fontFamily: '"Inter", sans-serif'
                    }}>
                      {exp.description.map((desc, i) => (
                        <div key={i} style={{ 
                          margin: '6px 0',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px'
                        }}>
                          <span style={{ color: colors.primary, fontWeight: 'bold' }}>▸</span>
                          <span>{desc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: colors.primary,
                margin: '0 0 20px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{
                  width: '4px',
                  height: '24px',
                  backgroundColor: colors.primary,
                  borderRadius: '2px'
                }} />
                Key Projects
              </h2>
              <div style={{
                display: 'grid',
                gap: '16px'
              }}>
                {data.projects.slice(0, 4).map((project, index) => (
                  <div key={index} style={{ 
                    backgroundColor: colors.card,
                    padding: '16px',
                    borderRadius: '8px',
                    border: `1px solid ${colors.border}`,
                    borderLeft: `4px solid ${colors.accent}`
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: colors.secondary,
                      margin: '0 0 8px 0'
                    }}>
                      {project.name}
                    </h3>
                    {project.description && (
                      <p style={{
                        margin: '0 0 12px 0',
                        fontSize: '13px',
                        lineHeight: '1.5',
                        fontFamily: '"Inter", sans-serif'
                      }}>
                        {project.description}
                      </p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px'
                      }}>
                        {project.technologies.map((tech, i) => (
                          <span key={i} style={{
                            fontSize: '11px',
                            padding: '3px 8px',
                            backgroundColor: colors.primary,
                            color: 'white',
                            borderRadius: '12px',
                            fontWeight: '500'
                          }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div>
          {/* Technical Skills */}
          {data.skills && data.skills.length > 0 && (
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: colors.primary,
                margin: '0 0 16px 0',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Tech Stack
              </h2>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {data.skills.map((skill, index) => (
                  <div key={index} style={{
                    backgroundColor: colors.card,
                    padding: '12px',
                    borderRadius: '6px',
                    border: `1px solid ${colors.border}`,
                    fontSize: '13px',
                    fontWeight: '500',
                    color: colors.text,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>{skill.name}</span>
                    <span style={{
                      fontSize: '10px',
                      color: colors.primary,
                      backgroundColor: colors.accent + '30',
                      padding: '2px 6px',
                      borderRadius: '10px'
                    }}>
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: colors.primary,
                margin: '0 0 16px 0',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Education
              </h2>
              {data.education.map((edu, index) => (
                <div key={index} style={{ 
                  marginBottom: '16px',
                  backgroundColor: colors.card,
                  padding: '16px',
                  borderRadius: '6px',
                  border: `1px solid ${colors.border}`
                }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.secondary,
                    margin: '0 0 4px 0'
                  }}>
                    {edu.degree}
                  </h3>
                  <p style={{
                    fontSize: '13px',
                    color: colors.primary,
                    margin: '0 0 4px 0'
                  }}>
                    {edu.institution}
                  </p>
                  <p style={{
                    fontSize: '11px',
                    color: colors.accent,
                    margin: '0'
                  }}>
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </p>
                </div>
              ))}
            </section>
          )}

          {/* Certifications */}
          {data.certificates && data.certificates.length > 0 && (
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: colors.primary,
                margin: '0 0 16px 0',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Certifications
              </h2>
              {data.certificates.map((cert, index) => (
                <div key={index} style={{ 
                  marginBottom: '12px',
                  backgroundColor: colors.card,
                  padding: '12px',
                  borderRadius: '6px',
                  border: `1px solid ${colors.border}`,
                  borderLeft: `3px solid ${colors.primary}`
                }}>
                  <h3 style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: colors.secondary,
                    margin: '0 0 2px 0'
                  }}>
                    {cert.name}
                  </h3>
                  <p style={{
                    fontSize: '12px',
                    color: colors.text,
                    margin: '0'
                  }}>
                    {cert.issuer} • {cert.date}
                  </p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}