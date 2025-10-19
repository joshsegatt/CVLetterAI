'use client';

import { CVData } from '@/types/builder';

interface ExecutiveMinimalistCVProps {
  data: CVData;
  colorScheme?: 'charcoal-elite' | 'platinum-executive' | 'navy-corporate' | 'slate-professional' | 'graphite-modern' | 'steel-premium';
  showPhoto?: boolean;
  className?: string;
}

export default function ExecutiveMinimalistCV({ 
  data, 
  colorScheme = 'charcoal-elite',
  showPhoto = true,
  className = '' 
}: ExecutiveMinimalistCVProps) {
  const colorSchemes = {
    'charcoal-elite': {
      primary: 'rgb(45, 45, 45)',
      secondary: 'rgb(25, 25, 25)',
      accent: 'rgb(100, 100, 100)',
      text: 'rgb(60, 60, 60)',
      background: 'rgb(255, 255, 255)',
      divider: 'rgb(230, 230, 230)'
    },
    'platinum-executive': {
      primary: 'rgb(70, 70, 70)',
      secondary: 'rgb(50, 50, 50)',
      accent: 'rgb(120, 120, 120)',
      text: 'rgb(80, 80, 80)',
      background: 'rgb(255, 255, 255)',
      divider: 'rgb(225, 225, 225)'
    },
    'navy-corporate': {
      primary: 'rgb(35, 55, 75)',
      secondary: 'rgb(25, 40, 55)',
      accent: 'rgb(70, 90, 110)',
      text: 'rgb(60, 60, 60)',
      background: 'rgb(255, 255, 255)',
      divider: 'rgb(220, 230, 240)'
    },
    'slate-professional': {
      primary: 'rgb(55, 65, 75)',
      secondary: 'rgb(35, 45, 55)',
      accent: 'rgb(90, 100, 110)',
      text: 'rgb(70, 70, 70)',
      background: 'rgb(255, 255, 255)',
      divider: 'rgb(235, 235, 235)'
    },
    'graphite-modern': {
      primary: 'rgb(40, 40, 40)',
      secondary: 'rgb(20, 20, 20)',
      accent: 'rgb(85, 85, 85)',
      text: 'rgb(55, 55, 55)',
      background: 'rgb(255, 255, 255)',
      divider: 'rgb(240, 240, 240)'
    },
    'steel-premium': {
      primary: 'rgb(65, 75, 85)',
      secondary: 'rgb(45, 55, 65)',
      accent: 'rgb(105, 115, 125)',
      text: 'rgb(75, 75, 75)',
      background: 'rgb(255, 255, 255)',
      divider: 'rgb(225, 235, 245)'
    }
  };

  const colors = colorSchemes[colorScheme];

  return (
    <div 
      className={`executive-minimalist-cv ${className}`}
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
        fontSize: '15px',
        lineHeight: '1.5',
        width: '794px',
        minHeight: '1123px',
        margin: '0 auto',
        padding: '48px',
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      {/* Header Section - Ultra Clean */}
      <header style={{ 
        marginBottom: '40px',
        textAlign: 'center',
        paddingBottom: '32px',
        borderBottom: `1px solid ${colors.divider}`
      }}>
        {showPhoto && data.personal?.photo && (
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            overflow: 'hidden',
            margin: '0 auto 24px auto',
            border: `2px solid ${colors.divider}`
          }}>
            <img 
              src={data.personal.photo} 
              alt="Executive Photo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        )}
        
        <h1 style={{
          fontSize: '36px',
          fontWeight: '300',
          color: colors.primary,
          margin: '0 0 8px 0',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          {`${data.personal?.firstName || ''} ${data.personal?.lastName || ''}`.trim() || 'Executive Name'}
        </h1>
        
        <h2 style={{
          fontSize: '16px',
          fontWeight: '400',
          color: colors.accent,
          margin: '0 0 24px 0',
          letterSpacing: '2px',
          textTransform: 'uppercase'
        }}>
          {data.personal?.title || 'Executive Position'}
        </h2>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          fontSize: '14px',
          color: colors.text
        }}>
          {data.personal?.email && (
            <span>{data.personal.email}</span>
          )}
          {data.personal?.phone && (
            <span>{data.personal.phone}</span>
          )}
          {data.personal?.location && (
            <span>{data.personal.location}</span>
          )}
          {data.personal?.linkedin && (
            <span>{data.personal.linkedin}</span>
          )}
        </div>
      </header>

      {/* Professional Summary - Centered */}
      {data.personal?.summary && (
        <section style={{ 
          marginBottom: '48px',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto 48px auto'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: colors.primary,
            margin: '0 0 16px 0',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Executive Summary
          </h3>
          <p style={{
            margin: '0',
            lineHeight: '1.7',
            fontSize: '16px',
            color: colors.text,
            fontStyle: 'italic'
          }}>
            {data.personal.summary}
          </p>
        </section>
      )}

      {/* Two Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '48px'
      }}>
        {/* Left Column */}
        <div>
          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: colors.primary,
                margin: '0 0 24px 0',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                textAlign: 'center',
                paddingBottom: '8px',
                borderBottom: `1px solid ${colors.divider}`
              }}>
                Leadership Experience
              </h3>
              {data.experience.map((exp, index) => (
                <div key={index} style={{ 
                  marginBottom: '24px',
                  textAlign: 'center'
                }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: colors.secondary,
                    margin: '0 0 4px 0'
                  }}>
                    {exp.position}
                  </h4>
                  <p style={{
                    fontSize: '14px',
                    color: colors.primary,
                    margin: '0 0 4px 0',
                    fontWeight: '500'
                  }}>
                    {exp.company}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: colors.accent,
                    margin: '0 0 12px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </p>
                  {exp.description && exp.description.length > 0 && (
                    <div style={{
                      textAlign: 'left',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      color: colors.text
                    }}>
                      {exp.description.slice(0, 2).map((desc, i) => (
                        <p key={i} style={{ margin: '0 0 6px 0' }}>• {desc}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: colors.primary,
                margin: '0 0 24px 0',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                textAlign: 'center',
                paddingBottom: '8px',
                borderBottom: `1px solid ${colors.divider}`
              }}>
                Strategic Initiatives
              </h3>
              {data.projects.slice(0, 3).map((project, index) => (
                <div key={index} style={{ 
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>
                  <h4 style={{
                    fontSize: '15px',
                    fontWeight: '500',
                    color: colors.secondary,
                    margin: '0 0 8px 0'
                  }}>
                    {project.name}
                  </h4>
                  {project.description && (
                    <p style={{
                      margin: '0',
                      fontSize: '13px',
                      lineHeight: '1.5',
                      color: colors.text
                    }}>
                      {project.description.length > 120 
                        ? `${project.description.substring(0, 120)}...`
                        : project.description
                      }
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Right Column */}
        <div>
          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: colors.primary,
                margin: '0 0 24px 0',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                textAlign: 'center',
                paddingBottom: '8px',
                borderBottom: `1px solid ${colors.divider}`
              }}>
                Academic Excellence
              </h3>
              {data.education.map((edu, index) => (
                <div key={index} style={{ 
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>
                  <h4 style={{
                    fontSize: '15px',
                    fontWeight: '500',
                    color: colors.secondary,
                    margin: '0 0 4px 0'
                  }}>
                    {edu.degree}
                  </h4>
                  <p style={{
                    fontSize: '14px',
                    color: colors.primary,
                    margin: '0 0 4px 0'
                  }}>
                    {edu.institution}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: colors.accent,
                    margin: '0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {edu.startDate} — {edu.current ? 'Present' : edu.endDate}
                  </p>
                </div>
              ))}
            </section>
          )}

          {/* Core Competencies */}
          {data.skills && data.skills.length > 0 && (
            <section style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: colors.primary,
                margin: '0 0 24px 0',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                textAlign: 'center',
                paddingBottom: '8px',
                borderBottom: `1px solid ${colors.divider}`
              }}>
                Core Competencies
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                textAlign: 'center'
              }}>
                {data.skills.slice(0, 8).map((skill, index) => (
                  <div key={index} style={{
                    fontSize: '13px',
                    color: colors.text,
                    padding: '6px 0',
                    borderBottom: index < data.skills.length - 1 ? `1px solid ${colors.divider}50` : 'none'
                  }}>
                    {skill.name}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <section style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: colors.primary,
                margin: '0 0 24px 0',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                textAlign: 'center',
                paddingBottom: '8px',
                borderBottom: `1px solid ${colors.divider}`
              }}>
                Languages
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                textAlign: 'center'
              }}>
                {data.languages.map((lang, index) => (
                  <div key={index} style={{
                    fontSize: '13px',
                    color: colors.text,
                    padding: '6px 0',
                    borderBottom: index < data.languages.length - 1 ? `1px solid ${colors.divider}50` : 'none'
                  }}>
                    <span style={{ fontWeight: '500' }}>{lang.name}</span>
                    <span style={{ color: colors.accent, marginLeft: '8px' }}>({lang.level})</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}