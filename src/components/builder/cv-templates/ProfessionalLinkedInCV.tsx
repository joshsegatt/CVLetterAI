'use client';

import { CVData } from '@/types/builder';

interface ProfessionalLinkedInCVProps {
  data: CVData;
  colorScheme?: 'corporate-blue' | 'executive-gray' | 'professional-black' | 'modern-teal' | 'premium-navy' | 'classic-charcoal';
  showPhoto?: boolean;
  className?: string;
}

export default function ProfessionalLinkedInCV({ 
  data, 
  colorScheme = 'corporate-blue',
  showPhoto = true,
  className = '' 
}: ProfessionalLinkedInCVProps) {
  const colorSchemes = {
    'corporate-blue': {
      primary: 'rgb(0, 119, 181)', // LinkedIn blue
      secondary: 'rgb(34, 34, 34)',
      accent: 'rgb(0, 119, 181)',
      text: 'rgb(51, 51, 51)',
      background: 'rgb(255, 255, 255)',
      section: 'rgb(248, 249, 250)'
    },
    'executive-gray': {
      primary: 'rgb(68, 68, 68)',
      secondary: 'rgb(34, 34, 34)',
      accent: 'rgb(102, 102, 102)',
      text: 'rgb(51, 51, 51)',
      background: 'rgb(255, 255, 255)',
      section: 'rgb(249, 249, 249)'
    },
    'professional-black': {
      primary: 'rgb(34, 34, 34)',
      secondary: 'rgb(0, 0, 0)',
      accent: 'rgb(68, 68, 68)',
      text: 'rgb(51, 51, 51)',
      background: 'rgb(255, 255, 255)',
      section: 'rgb(250, 250, 250)'
    },
    'modern-teal': {
      primary: 'rgb(0, 150, 136)',
      secondary: 'rgb(34, 34, 34)',
      accent: 'rgb(0, 150, 136)',
      text: 'rgb(51, 51, 51)',
      background: 'rgb(255, 255, 255)',
      section: 'rgb(248, 250, 252)'
    },
    'premium-navy': {
      primary: 'rgb(25, 77, 130)',
      secondary: 'rgb(34, 34, 34)',
      accent: 'rgb(25, 77, 130)',
      text: 'rgb(51, 51, 51)',
      background: 'rgb(255, 255, 255)',
      section: 'rgb(248, 249, 251)'
    },
    'classic-charcoal': {
      primary: 'rgb(85, 85, 85)',
      secondary: 'rgb(34, 34, 34)',
      accent: 'rgb(119, 119, 119)',
      text: 'rgb(51, 51, 51)',
      background: 'rgb(255, 255, 255)',
      section: 'rgb(249, 249, 249)'
    }
  };

  const colors = colorSchemes[colorScheme];

  return (
    <div 
      className={`professional-linkedin-cv ${className}`}
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
        fontSize: '14px',
        lineHeight: '1.4',
        width: '794px',
        minHeight: '1123px',
        margin: '0 auto',
        padding: '40px',
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      {/* Header Section */}
      <header style={{ 
        display: 'flex', 
        gap: '24px', 
        alignItems: 'flex-start',
        marginBottom: '32px',
        paddingBottom: '24px',
        borderBottom: `2px solid ${colors.primary}`
      }}>
        {showPhoto && data.personal?.photo && (
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '8px',
            overflow: 'hidden',
            flexShrink: 0,
            border: `3px solid ${colors.section}`
          }}>
            <img 
              src={data.personal.photo} 
              alt="Professional Photo"
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
            fontWeight: '600',
            color: colors.primary,
            margin: '0 0 8px 0',
            letterSpacing: '-0.5px'
          }}>
            {`${data.personal?.firstName || ''} ${data.personal?.lastName || ''}`.trim() || 'Your Name'}
          </h1>
          
          <h2 style={{
            fontSize: '18px',
            fontWeight: '400',
            color: colors.secondary,
            margin: '0 0 16px 0'
          }}>
            {data.personal?.title || 'Professional Title'}
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '8px',
            fontSize: '13px',
            color: colors.text
          }}>
            {data.personal?.email && (
              <div>📧 {data.personal.email}</div>
            )}
            {data.personal?.phone && (
              <div>📞 {data.personal.phone}</div>
            )}
            {data.personal?.location && (
              <div>📍 {data.personal.location}</div>
            )}
            {data.personal?.linkedin && (
              <div>💼 {data.personal.linkedin}</div>
            )}
          </div>
        </div>
      </header>

      {/* Professional Summary */}
      {data.personal?.summary && (
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: colors.primary,
            margin: '0 0 12px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Professional Summary
          </h3>
          <p style={{
            margin: '0',
            lineHeight: '1.6',
            fontSize: '14px'
          }}>
            {data.personal.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: colors.primary,
            margin: '0 0 16px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Professional Experience
          </h3>
          {data.experience.map((exp, index) => (
            <div key={index} style={{ 
              marginBottom: '20px',
              paddingLeft: '16px',
              borderLeft: `3px solid ${colors.accent}`,
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                left: '-7px',
                top: '4px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: colors.accent
              }} />
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '6px'
              }}>
                <div>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: colors.secondary,
                    margin: '0 0 2px 0'
                  }}>
                    {exp.position}
                  </h4>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: colors.primary,
                    margin: '0'
                  }}>
                    {exp.company}
                  </p>
                </div>
                <span style={{
                  fontSize: '12px',
                  color: colors.text,
                  fontWeight: '500',
                  backgroundColor: colors.section,
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.description && exp.description.length > 0 && (
                <div style={{
                  margin: '8px 0 0 0',
                  fontSize: '13px',
                  lineHeight: '1.5'
                }}>
                  {exp.description.map((desc, i) => (
                    <p key={i} style={{ margin: '4px 0' }}>• {desc}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: colors.primary,
            margin: '0 0 16px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Education
          </h3>
          {data.education.map((edu, index) => (
            <div key={index} style={{ 
              marginBottom: '16px',
              padding: '12px',
              backgroundColor: colors.section,
              borderRadius: '6px',
              borderLeft: `4px solid ${colors.accent}`
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div>
                  <h4 style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: colors.secondary,
                    margin: '0 0 4px 0'
                  }}>
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h4>
                  <p style={{
                    fontSize: '14px',
                    color: colors.primary,
                    margin: '0'
                  }}>
                    {edu.institution}
                  </p>
                </div>
                <span style={{
                  fontSize: '12px',
                  color: colors.text,
                  fontWeight: '500'
                }}>
                  {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                </span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: colors.primary,
            margin: '0 0 16px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Core Competencies
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '8px'
          }}>
            {data.skills.map((skill, index) => (
              <div key={index} style={{
                padding: '8px 12px',
                backgroundColor: colors.section,
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '500',
                color: colors.secondary,
                textAlign: 'center',
                border: `1px solid ${colors.accent}20`
              }}>
                {skill.name}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Additional Sections */}
      {data.projects && data.projects.length > 0 && (
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: colors.primary,
            margin: '0 0 16px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Key Projects
          </h3>
          {data.projects.map((project, index) => (
            <div key={index} style={{ 
              marginBottom: '16px',
              padding: '12px',
              backgroundColor: colors.section,
              borderRadius: '6px',
              borderLeft: `4px solid ${colors.accent}`
            }}>
              <h4 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: colors.secondary,
                margin: '0 0 6px 0'
              }}>
                {project.name}
              </h4>
              {project.description && (
                <p style={{
                  margin: '0 0 8px 0',
                  fontSize: '13px',
                  lineHeight: '1.5'
                }}>
                  {project.description}
                </p>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '4px'
                }}>
                  {project.technologies.map((tech, i) => (
                    <span key={i} style={{
                      fontSize: '11px',
                      padding: '2px 6px',
                      backgroundColor: colors.accent,
                      color: 'white',
                      borderRadius: '10px'
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}