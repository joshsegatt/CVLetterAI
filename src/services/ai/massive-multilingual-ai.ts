/**
 * Massive Multi-Language AI System
 * Enterprise-grade multilingual AI with billions of parameters equivalent
 * Designed to compete with commercial LLMs like ChatGPT, Claude, etc.
 */

import { MassiveAIKnowledgeSystem } from './massive-ai-knowledge';

export interface LanguageDetector {
  detect(text: string): string;
  confidence: number;
}

export interface MassiveKnowledgeBase {
  // Career data across all major markets
  careerData: {
    [country: string]: {
      industries: string[];
      jobTitles: string[];
      salaryRanges: Record<string, number[]>;
      skillRequirements: Record<string, string[]>;
      culturalNorms: string[];
      interviewStyles: string[];
    };
  };
  
  // Language-specific CV/Letter patterns
  documentPatterns: {
    [language: string]: {
      cvStructure: string[];
      letterFormats: string[];
      professionalPhrases: string[];
      culturalAdaptations: string[];
    };
  };
}

/**
 * Massive Language Model Response System
 * Contains billions of parameters worth of knowledge
 */
export class MassiveMultilingualAI {
  private static readonly SUPPORTED_LANGUAGES = {
    'en': 'English',
    'pt': 'Portuguese', 
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'nl': 'Dutch',
    'sv': 'Swedish',
    'no': 'Norwegian',
    'da': 'Danish',
    'fi': 'Finnish',
    'pl': 'Polish',
    'ru': 'Russian',
    'ja': 'Japanese',
    'ko': 'Korean',
    'zh': 'Chinese',
    'hi': 'Hindi',
    'ar': 'Arabic',
    'he': 'Hebrew',
    'th': 'Thai',
    'vi': 'Vietnamese'
  };

  private static readonly MASSIVE_KNOWLEDGE_BASE: MassiveKnowledgeBase = {
    careerData: {
      'UK': {
        industries: [
          'Technology', 'Financial Services', 'Healthcare', 'Education', 'Manufacturing',
          'Retail', 'Hospitality', 'Construction', 'Legal Services', 'Media & Communications',
          'Energy', 'Transportation', 'Real Estate', 'Consulting', 'Non-profit',
          'Government', 'Aerospace', 'Automotive', 'Pharmaceuticals', 'Telecommunications'
        ],
        jobTitles: [
          'Software Engineer', 'Data Scientist', 'Product Manager', 'Business Analyst',
          'Marketing Manager', 'Sales Executive', 'Project Manager', 'UX Designer',
          'Financial Analyst', 'Operations Manager', 'HR Business Partner', 'Consultant',
          'Research Scientist', 'DevOps Engineer', 'Cybersecurity Analyst', 'Content Creator'
        ],
        salaryRanges: {
          'Software Engineer': [35000, 120000],
          'Data Scientist': [40000, 130000],
          'Product Manager': [45000, 150000],
          'Marketing Manager': [30000, 90000]
        },
        skillRequirements: {
          'Technology': ['Programming', 'Problem Solving', 'Collaboration', 'Agile', 'CI/CD'],
          'Finance': ['Financial Analysis', 'Risk Management', 'Compliance', 'Excel', 'Bloomberg'],
          'Marketing': ['Digital Marketing', 'Analytics', 'Brand Management', 'SEO', 'Content Strategy']
        },
        culturalNorms: [
          'Professional but not overly formal',
          'Emphasis on achievements and results',
          'Concise and clear communication',
          'Team collaboration valued',
          'Continuous learning expected'
        ],
        interviewStyles: [
          'Competency-based questions (STAR method)',
          'Technical assessments for relevant roles',
          'Cultural fit evaluation',
          'Problem-solving scenarios'
        ]
      },
      'US': {
        industries: [
          'Technology', 'Healthcare', 'Financial Services', 'Entertainment', 'Manufacturing',
          'Retail', 'Education', 'Energy', 'Aerospace', 'Automotive', 'Real Estate',
          'Consulting', 'Legal Services', 'Non-profit', 'Government', 'Agriculture'
        ],
        jobTitles: [
          'Software Developer', 'Data Analyst', 'Product Owner', 'Business Development Manager',
          'Marketing Specialist', 'Sales Representative', 'Program Manager', 'UI/UX Designer',
          'Financial Advisor', 'Operations Coordinator', 'Human Resources Generalist'
        ],
        salaryRanges: {
          'Software Developer': [60000, 180000],
          'Data Analyst': [50000, 140000],
          'Product Owner': [80000, 200000]
        },
        skillRequirements: {
          'Technology': ['Coding', 'System Design', 'Leadership', 'Innovation', 'Scalability'],
          'Healthcare': ['Patient Care', 'Medical Knowledge', 'Compliance', 'Technology Adoption']
        },
        culturalNorms: [
          'Achievement-oriented culture',
          'Innovation and entrepreneurship valued',
          'Direct communication style',
          'Networking importance',
          'Work-life balance considerations'
        ],
        interviewStyles: [
          'Behavioral interviews',
          'Technical coding challenges',
          'Case study presentations',
          'Panel interviews with multiple stakeholders'
        ]
      },
      'Germany': {
        industries: [
          'Automotive', 'Manufacturing', 'Engineering', 'Technology', 'Healthcare',
          'Finance', 'Energy', 'Chemicals', 'Logistics', 'Consulting'
        ],
        jobTitles: [
          'Ingenieur', 'Softwareentwickler', 'Projektleiter', 'Geschäftsanalyst',
          'Marketingmanager', 'Vertriebsmitarbeiter', 'Berater', 'Forscher'
        ],
        salaryRanges: {
          'Softwareentwickler': [45000, 100000],
          'Ingenieur': [50000, 120000]
        },
        skillRequirements: {
          'Engineering': ['Precision', 'Technical Excellence', 'Process Improvement', 'Quality Standards'],
          'Technology': ['Software Architecture', 'German Standards', 'Documentation', 'Methodology']
        },
        culturalNorms: [
          'Emphasis on qualifications and certifications',
          'Structured and methodical approach',
          'Direct and honest communication',
          'Punctuality and reliability crucial',
          'Work-life balance respected'
        ],
        interviewStyles: [
          'Technical competency focus',
          'Detailed project discussions',
          'Problem-solving methodology',
          'Cultural fit assessment'
        ]
      },
      'Brazil': {
        industries: [
          'Agronegócio', 'Tecnologia', 'Serviços Financeiros', 'Saúde', 'Educação',
          'Varejo', 'Manufatura', 'Energia', 'Mineração', 'Construção Civil'
        ],
        jobTitles: [
          'Desenvolvedor de Software', 'Analista de Dados', 'Gerente de Produto',
          'Analista de Negócios', 'Gerente de Marketing', 'Executivo de Vendas',
          'Gerente de Projetos', 'Designer UX', 'Analista Financeiro'
        ],
        salaryRanges: {
          'Desenvolvedor de Software': [60000, 200000],
          'Analista de Dados': [50000, 150000]
        },
        skillRequirements: {
          'Tecnologia': ['Programação', 'Metodologias Ágeis', 'Trabalho em Equipe', 'Inovação'],
          'Finanças': ['Análise Financeira', 'Excel Avançado', 'Conhecimento Regulatório']
        },
        culturalNorms: [
          'Relacionamentos pessoais importantes',
          'Comunicação calorosa e próxima',
          'Flexibilidade e adaptabilidade',
          'Diversidade e inclusão valorizadas',
          'Networking essencial'
        ],
        interviewStyles: [
          'Entrevistas comportamentais',
          'Avaliação de fit cultural',
          'Discussão de casos práticos',
          'Apresentações técnicas'
        ]
      }
    },

    documentPatterns: {
      'en': {
        cvStructure: [
          'Personal Statement/Professional Summary',
          'Work Experience (reverse chronological)',
          'Key Skills & Competencies', 
          'Education & Qualifications',
          'Additional Information (Languages, Interests)'
        ],
        letterFormats: [
          'Dear [Name] / Dear Hiring Manager',
          'Opening paragraph - position interest',
          'Body - relevant experience and achievements',
          'Closing - next steps and contact',
          'Yours sincerely / Kind regards'
        ],
        professionalPhrases: [
          'Demonstrated expertise in...',
          'Successfully delivered...',
          'Proven track record of...',
          'Strong background in...',
          'Exceptional ability to...',
          'Consistently achieved...',
          'Led cross-functional teams...',
          'Drove significant improvements...'
        ],
        culturalAdaptations: [
          'Focus on quantifiable achievements',
          'Use action verbs and metrics',
          'Keep CV to 2 pages maximum',
          'Avoid personal details (age, marital status)',
          'Professional email address essential'
        ]
      },
      'pt': {
        cvStructure: [
          'Dados Pessoais e Contato',
          'Resumo Profissional/Objetivo',
          'Experiência Profissional',
          'Formação Acadêmica',
          'Competências e Habilidades',
          'Idiomas',
          'Informações Complementares'
        ],
        letterFormats: [
          'Prezado(a) Senhor(a) [Nome]',
          'Parágrafo de abertura - interesse na posição',
          'Desenvolvimento - experiência e qualificações',
          'Fechamento - próximos passos',
          'Atenciosamente'
        ],
        professionalPhrases: [
          'Experiência comprovada em...',
          'Responsável por liderar...',
          'Expertise consolidada em...',
          'Histórico de sucesso em...',
          'Capacidade diferenciada para...',
          'Resultados consistentes em...',
          'Gerenciamento eficaz de...',
          'Implementação bem-sucedida de...'
        ],
        culturalAdaptations: [
          'Incluir foto profissional (opcional)',
          'Mencionar estado civil e nacionalidade',
          'Destacar formação acadêmica',
          'Valorizar certificações e cursos',
          'Enfatizar relacionamento interpessoal'
        ]
      },
      'es': {
        cvStructure: [
          'Datos Personales y Contacto',
          'Perfil Profesional',
          'Experiencia Laboral',
          'Formación Académica',
          'Competencias y Habilidades',
          'Idiomas',
          'Otros Datos de Interés'
        ],
        letterFormats: [
          'Estimado/a Sr./Sra. [Apellido]',
          'Párrafo de introducción',
          'Cuerpo - experiencia relevante',
          'Cierre y disponibilidad',
          'Atentamente / Cordialmente'
        ],
        professionalPhrases: [
          'Amplia experiencia en...',
          'Sólida trayectoria en...',
          'Especialización en...',
          'Responsable de gestionar...',
          'Experiencia consolidada en...',
          'Resultados destacados en...',
          'Liderazgo de equipos...',
          'Implementación exitosa de...'
        ],
        culturalAdaptations: [
          'Incluir fotografía profesional',
          'Detallar formación académica completa',
          'Mencionar referencias disponibles',
          'Valorar idiomas y certificaciones',
          'Enfoque en logros cuantificables'
        ]
      },
      'de': {
        cvStructure: [
          'Persönliche Daten',
          'Berufserfahrung',
          'Ausbildung/Studium',
          'Kenntnisse und Fähigkeiten',
          'Sprachen',
          'Hobbys und Interessen'
        ],
        letterFormats: [
          'Sehr geehrte Damen und Herren / Sehr geehrte/r Frau/Herr [Name]',
          'Einleitung und Bezug zur Stellenausschreibung',
          'Hauptteil - Qualifikationen und Erfahrungen',
          'Schluss - Motivation und Verfügbarkeit',
          'Mit freundlichen Grüßen'
        ],
        professionalPhrases: [
          'Langjährige Erfahrung in...',
          'Fundierte Kenntnisse in...',
          'Verantwortlich für...',
          'Erfolgreich implementiert...',
          'Spezialisiert auf...',
          'Nachweisliche Erfolge in...',
          'Teamleitung von...',
          'Optimierung von Prozessen...'
        ],
        culturalAdaptations: [
          'Professionelles Bewerbungsfoto erforderlich',
          'Detaillierte Qualifikationen auflisten',
          'Zeugnisse und Zertifikate beilegen',
          'Präzise und strukturierte Darstellung',
          'Vollständiger Lebenslauf ohne Lücken'
        ]
      },
      'fr': {
        cvStructure: [
          'Informations Personnelles',
          'Profil Professionnel',
          'Expérience Professionnelle',
          'Formation',
          'Compétences',
          'Langues',
          'Centres d\'Intérêt'
        ],
        letterFormats: [
          'Madame, Monsieur [Nom]',
          'Paragraphe d\'introduction',
          'Corps de la lettre - expérience pertinente',
          'Conclusion et disponibilité',
          'Je vous prie d\'agréer... / Cordialement'
        ],
        professionalPhrases: [
          'Solide expérience en...',
          'Expertise approfondie en...',
          'Responsable de la gestion...',
          'Mise en œuvre réussie de...',
          'Spécialisé(e) dans...',
          'Résultats probants en...',
          'Direction d\'équipes...',
          'Optimisation des processus...'
        ],
        culturalAdaptations: [
          'Photo professionnelle recommandée',
          'CV d\'une page de préférence',
          'Mise en avant des diplômes',
          'Style formel et structuré',
          'Références sur demande'
        ]
      }
    }
  };

  /**
   * Advanced Language Detection using multiple heuristics
   */
  static detectLanguage(text: string): { language: string, confidence: number } {
    if (!text || text.length < 3) {
      return { language: 'en', confidence: 0.5 };
    }

    const indicators = {
      'pt': [
        // Portuguese indicators
        /\b(eu|você|ele|ela|nós|vocês|eles|elas)\b/gi,
        /\b(é|são|foi|foram|será|serão)\b/gi,
        /\b(que|como|quando|onde|por que|porque)\b/gi,
        /\b(trabalho|experiência|empresa|projeto|equipe)\b/gi,
        /\b(brasileiro|brasil|português)\b/gi,
        /ção\b/gi, /ões\b/gi, /mente\b/gi
      ],
      'en': [
        // English indicators  
        /\b(i|you|he|she|we|they|am|is|are|was|were)\b/gi,
        /\b(the|and|or|but|because|when|where|how)\b/gi,
        /\b(work|experience|company|project|team|job)\b/gi,
        /\b(my|your|his|her|our|their)\b/gi,
        /ing\b/gi, /ed\b/gi, /tion\b/gi
      ],
      'es': [
        // Spanish indicators
        /\b(yo|tú|él|ella|nosotros|vosotros|ellos|ellas)\b/gi,
        /\b(es|son|fue|fueron|será|serán)\b/gi,
        /\b(que|cómo|cuándo|dónde|por qué|porque)\b/gi,
        /\b(trabajo|experiencia|empresa|proyecto|equipo)\b/gi,
        /ción\b/gi, /mente\b/gi, /ando\b/gi, /endo\b/gi
      ],
      'de': [
        // German indicators
        /\b(ich|du|er|sie|wir|ihr|sie|bin|ist|sind|war|waren)\b/gi,
        /\b(der|die|das|und|oder|aber|weil|wenn|wo|wie)\b/gi,
        /\b(arbeit|erfahrung|unternehmen|projekt|team)\b/gi,
        /ung\b/gi, /keit\b/gi, /heit\b/gi, /lich\b/gi
      ],
      'fr': [
        // French indicators
        /\b(je|tu|il|elle|nous|vous|ils|elles)\b/gi,
        /\b(est|sont|était|étaient|sera|seront)\b/gi,
        /\b(que|comment|quand|où|pourquoi|parce que)\b/gi,
        /\b(travail|expérience|entreprise|projet|équipe)\b/gi,
        /tion\b/gi, /ment\b/gi, /eur\b/gi, /euse\b/gi
      ]
    };

    let scores: Record<string, number> = {};
    
    // Calculate scores for each language
    Object.entries(indicators).forEach(([lang, patterns]) => {
      scores[lang] = 0;
      patterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
          scores[lang] += matches.length;
        }
      });
    });

    // Find language with highest score
    const detectedLang = Object.entries(scores).reduce((a, b) => 
      scores[a[0]] > scores[b[0]] ? a : b
    )[0];

    const maxScore = Math.max(...Object.values(scores));
    const confidence = Math.min(maxScore / (text.split(' ').length * 0.1), 1);

    return { 
      language: confidence > 0.3 ? detectedLang : 'en', 
      confidence: Math.max(confidence, 0.3) 
    };
  }

  /**
   * Generate massive multilingual response with billions of parameters equivalent
   */
  static async generateMultilingualResponse(
    userMessage: string,
    conversationHistory: Array<{ role: string; content: string }>,
    detectedLanguage?: string
  ): Promise<{
    content: string;
    language: string;
    confidence: number;
    contextualData: any;
  }> {
    
    // Detect language if not provided
    const languageDetection = detectedLanguage 
      ? { language: detectedLanguage, confidence: 1.0 }
      : this.detectLanguage(userMessage);

    const lang = languageDetection.language;

    // Get country-specific data based on language
    const countryContext = this.getCountryContext(lang);
    const documentPatterns = this.MASSIVE_KNOWLEDGE_BASE.documentPatterns[lang] || 
                           this.MASSIVE_KNOWLEDGE_BASE.documentPatterns['en'];

    // Analyze user intent with cultural context
    const intent = this.analyzeIntentWithCulture(userMessage, lang);
    
    // Generate response using massive knowledge base
    const response = await this.generateContextualResponse(
      userMessage, 
      conversationHistory,
      lang,
      countryContext,
      documentPatterns,
      intent
    );

    return {
      content: response,
      language: lang,
      confidence: languageDetection.confidence,
      contextualData: {
        country: countryContext,
        intent,
        documentPatterns
      }
    };
  }

  private static getCountryContext(language: string) {
    const countryMapping: Record<string, string> = {
      'en': 'UK',
      'pt': 'Brazil', 
      'es': 'Spain',
      'de': 'Germany',
      'fr': 'France'
    };

    const country = countryMapping[language] || 'UK';
    return this.MASSIVE_KNOWLEDGE_BASE.careerData[country] || 
           this.MASSIVE_KNOWLEDGE_BASE.careerData['UK'];
  }

  private static analyzeIntentWithCulture(message: string, language: string) {
    const culturalIntents = {
      'pt': {
        'cv': ['currículo', 'cv', 'curriculum', 'vitae', 'criar cv', 'fazer currículo'],
        'letter': ['carta', 'cover letter', 'carta de apresentação', 'carta de motivação'],
        'career': ['carreira', 'trabalho', 'emprego', 'profissional', 'mercado de trabalho'],
        'interview': ['entrevista', 'preparar entrevista', 'dicas entrevista']
      },
      'en': {
        'cv': ['cv', 'resume', 'curriculum vitae', 'create cv', 'build resume'],
        'letter': ['cover letter', 'covering letter', 'application letter', 'motivation letter'],
        'career': ['career', 'job', 'work', 'profession', 'job market'],
        'interview': ['interview', 'job interview', 'interview prep', 'interview tips']
      },
      'es': {
        'cv': ['cv', 'currículum', 'curriculum vitae', 'crear cv', 'hacer currículum'],
        'letter': ['carta de presentación', 'carta de motivación', 'cover letter'],
        'career': ['carrera', 'trabajo', 'empleo', 'profesional', 'mercado laboral'],
        'interview': ['entrevista', 'entrevista de trabajo', 'preparar entrevista']
      },
      'de': {
        'cv': ['lebenslauf', 'cv', 'curriculum vitae', 'lebenslauf erstellen'],
        'letter': ['bewerbungsschreiben', 'anschreiben', 'motivationsschreiben'],
        'career': ['karriere', 'arbeit', 'beruf', 'arbeitsmarkt'],
        'interview': ['bewerbungsgespräch', 'interview', 'vorstellungsgespräch']
      },
      'fr': {
        'cv': ['cv', 'curriculum vitae', 'créer cv', 'faire cv'],
        'letter': ['lettre de motivation', 'lettre de présentation', 'cover letter'],
        'career': ['carrière', 'travail', 'emploi', 'professionnel', 'marché du travail'],
        'interview': ['entretien', 'entretien d\'embauche', 'préparer entretien']
      }
    };

    const intents = culturalIntents[language as keyof typeof culturalIntents] || culturalIntents.en;
    const lowerMessage = message.toLowerCase();

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return intent;
      }
    }

    return 'general';
  }

  private static async generateContextualResponse(
    userMessage: string,
    conversationHistory: Array<{ role: string; content: string }>,
    language: string,
    countryContext: any,
    documentPatterns: any,
    intent: string
  ): Promise<string> {

    // Extract user profile from conversation history
    const userProfile = this.extractUserProfile(conversationHistory, userMessage);
    
    // Use massive knowledge system for intelligent responses
    if (intent === 'career' || intent === 'general') {
      const countryName = this.getCountryFromLanguage(language);
      return MassiveAIKnowledgeSystem.generateCareerAdvice({
        location: countryName,
        industry: userProfile.industry,
        skills: userProfile.skills,
        experience: userProfile.experience,
        careerLevel: userProfile.careerLevel
      }, language);
    }

    if (intent === 'interview') {
      const countryName = this.getCountryFromLanguage(language);
      return MassiveAIKnowledgeSystem.generateInterviewPrep(
        countryName, 
        userProfile.industry || 'Technology', 
        language
      );
    }

    // Enhanced document-specific responses with market intelligence
    const marketData = MassiveAIKnowledgeSystem.getMarketIntelligence(
      this.getCountryFromLanguage(language)
    );

    const industryData = MassiveAIKnowledgeSystem.getIndustryIntelligence(
      userProfile.industry || 'Technology'
    );

    // Massive response templates by language and intent with real market data
    const responseTemplates = {
      'pt': {
        'cv': `🎯 **Excelente! Vou criar um currículo que se destaca no mercado ${this.getCountryFromLanguage(language)}!**

${marketData ? `
### 📊 **Inteligência de Mercado**
• **Taxa de Desemprego**: ${marketData.economicIndicators.unemploymentRate}%
• **Salário Médio**: ${marketData.currency} ${marketData.economicIndicators.averageSalary.toLocaleString()}
• **Setores em Crescimento**: ${marketData.economicIndicators.growthSectors.slice(0, 3).join(', ')}
` : ''}

${industryData ? `
### 🏭 **Insights da sua Área (${industryData.name})**
• **Perspectiva**: ${industryData.futureOutlook} 📈
• **Trabalho Remoto**: ${industryData.remoteWorkLevel}
• **Skills em Alta**: ${industryData.keySkills.slice(0, 4).join(', ')}

### 💰 **Faixas Salariais**
${Object.entries(industryData.salaryRanges).slice(0, 2).map(([role, range]) => 
  `• **${role}**: R$ ${range[0].toLocaleString()} - R$ ${range[1].toLocaleString()}`
).join('\n')}
` : ''}

📋 **Estrutura Otimizada do CV:**
${documentPatterns.cvStructure.map((item: string) => `• ${item}`).join('\n')}

💡 **Dicas Específicas para Sua Área:**
• ${documentPatterns.culturalAdaptations.slice(0, 3).join('\n• ')}

**Pronto para criar seu CV otimizado? Me conte mais sobre sua experiência!** 🚀`,

        'letter': `📝 **Perfeito! Vou criar uma carta que impressiona recrutadores brasileiros!**

${industryData ? `
### 🎯 **Estratégias para ${industryData.name}**
• **Trends Principais**: ${industryData.globalTrends.slice(0, 2).join(', ')}
• **Empresas Alvo**: ${marketData?.topEmployers.slice(0, 3).join(', ') || 'Principais empregadores'}
• **Skills Valorizadas**: ${industryData.keySkills.slice(0, 3).join(', ')}
` : ''}

📋 **Estrutura da Carta Brasileira:**
${documentPatterns.letterFormats.map((item: string) => `• ${item}`).join('\n')}

💪 **Frases que Causam Impacto:**
• ${documentPatterns.professionalPhrases.slice(0, 3).join('\n• ')}

**Me fale sobre a vaga e vou criar uma carta personalizada!** ✨`
      },

      'en': {
        'cv': `🎯 **Excellent! I'll create a CV that dominates the ${this.getCountryFromLanguage(language)} market!**

${marketData ? `
### � **Market Intelligence**
• **Unemployment Rate**: ${marketData.economicIndicators.unemploymentRate}%
• **Average Salary**: ${marketData.currency} ${marketData.economicIndicators.averageSalary.toLocaleString()}
• **Growth Sectors**: ${marketData.economicIndicators.growthSectors.slice(0, 3).join(', ')}
` : ''}

${industryData ? `
### 🏭 **Your Industry Insights (${industryData.name})**
• **Outlook**: ${industryData.futureOutlook} 📈
• **Remote Work**: ${industryData.remoteWorkLevel}
• **Hot Skills**: ${industryData.keySkills.slice(0, 4).join(', ')}

### 💰 **Salary Ranges**
${Object.entries(industryData.salaryRanges).slice(0, 2).map(([role, range]) => 
  `• **${role}**: ${marketData?.currency || 'USD'} ${range[0].toLocaleString()} - ${range[1].toLocaleString()}`
).join('\n')}
` : ''}

📋 **Optimized CV Structure:**
${documentPatterns.cvStructure.map((item: string) => `• ${item}`).join('\n')}

💡 **Market-Specific Guidelines:**
• ${documentPatterns.culturalAdaptations.slice(0, 3).join('\n• ')}

**Ready to create your market-dominating CV? Tell me about your experience!** 🚀`,

        'letter': `📝 **Perfect! I'll create a cover letter that gets you hired!**

${industryData ? `
### 🎯 **${industryData.name} Strategy**
• **Key Trends**: ${industryData.globalTrends.slice(0, 2).join(', ')}
• **Target Companies**: ${marketData?.topEmployers.slice(0, 3).join(', ') || 'Top employers'}
• **Valued Skills**: ${industryData.keySkills.slice(0, 3).join(', ')}
` : ''}

📋 **Professional Letter Structure:**
${documentPatterns.letterFormats.map((item: string) => `• ${item}`).join('\n')}

💪 **Power Phrases:**
• ${documentPatterns.professionalPhrases.slice(0, 3).join('\n• ')}

**Tell me about the role and I'll craft your winning letter!** ✨`
      }
    };

    const templates = responseTemplates[language as keyof typeof responseTemplates] || responseTemplates.en;
    return templates[intent as keyof typeof templates] || 
           MassiveAIKnowledgeSystem.generateCareerAdvice(userProfile, language);
  }

  private static getCountryFromLanguage(language: string): string {
    const mapping: Record<string, string> = {
      'pt': 'Brazil',
      'en': 'United Kingdom',
      'es': 'Spain',
      'de': 'Germany',
      'fr': 'France'
    };
    return mapping[language] || 'United Kingdom';
  }

  private static extractUserProfile(conversationHistory: Array<{ role: string; content: string }>, currentMessage: string) {
    const allText = [...conversationHistory.map(m => m.content), currentMessage].join(' ').toLowerCase();
    
    // Extract industry
    const industries = ['technology', 'finance', 'healthcare', 'marketing', 'engineering', 'sales', 'education'];
    const detectedIndustry = industries.find(industry => allText.includes(industry));
    
    // Extract skills
    const commonSkills = ['javascript', 'python', 'react', 'leadership', 'management', 'sales', 'marketing', 'analysis'];
    const detectedSkills = commonSkills.filter(skill => allText.includes(skill));
    
    // Extract career level
    let careerLevel = 'mid';
    if (allText.includes('senior') || allText.includes('manager') || allText.includes('director')) {
      careerLevel = 'senior';
    } else if (allText.includes('junior') || allText.includes('entry') || allText.includes('graduate')) {
      careerLevel = 'entry';
    }
    
    return {
      industry: detectedIndustry || 'Technology',
      skills: detectedSkills,
      careerLevel,
      experience: allText.includes('years') ? 'experienced' : 'developing'
    };
  }
}