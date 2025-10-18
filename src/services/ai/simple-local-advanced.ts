// AI Local Avançada - Sistema de IA 100% local otimizado
// Processamento avançado de contexto e multilinguagem

export interface LocalAIResponse {
  content: string;
  suggestions?: string[];
  followUpQuestions?: string[];
  confidence: number;
  type: 'cv' | 'letter' | 'interview' | 'general' | 'tips';
  language: string;
}

export interface AdvancedParams {
  language: string;
  tone: 'professional' | 'casual' | 'formal' | 'friendly';
  industry?: string;
  experience?: 'entry' | 'mid' | 'senior' | 'executive';
  context?: 'cv' | 'letter' | 'interview' | 'general';
}

export class SimpleLocalAI {
  private patterns: Map<string, string[]> = new Map();
  private contextMemory: string[] = [];
  private industryKeywords: Map<string, string[]> = new Map();
  private languageTemplates: Map<string, any> = new Map();
  private semanticPatterns: Map<string, RegExp[]> = new Map();

  constructor() {
    this.initializeAdvancedPatterns();
    this.initializeIndustryKeywords();
    this.initializeLanguageTemplates();
    this.initializeSemanticAnalysis();
  }

  private initializeSemanticAnalysis() {
    // Análise semântica avançada com regex patterns
    this.semanticPatterns.set('cv_request', [
      /help.*cv|create.*resume|write.*curriculum|improve.*cv/i,
      /experience.*section|bullet.*points|achievements/i,
      /skills.*list|qualifications|education/i
    ]);

    this.semanticPatterns.set('letter_request', [
      /cover.*letter|application.*letter|write.*letter/i,
      /landlord.*letter|tenant.*notice|reference.*letter/i,
      /business.*letter|formal.*communication/i
    ]);

    this.semanticPatterns.set('interview_request', [
      /interview.*prep|interview.*questions|prepare.*interview/i,
      /behavioral.*questions|technical.*interview|phone.*interview/i,
      /interview.*tips|interview.*advice/i
    ]);
  }

  private initializeLanguageTemplates() {
    // Templates multilinguagem avançados
    this.languageTemplates.set('en', {
      greeting: "🤖 Hello! I'm your advanced AI career assistant specializing in the UK job market.",
      cvHelp: "I'll help you create a standout CV that impresses UK employers with ATS-optimized content.",
      letterHelp: "I'll craft compelling letters that get results - from cover letters to landlord communications.",
      interviewHelp: "I'll prepare you for UK interviews with industry-specific insights and proven strategies.",
      followUp: "What specific area would you like me to focus on?",
      suggestions: [
        "📄 CV optimization with quantified achievements",
        "✉️ Cover letter writing with company research",
        "🎯 Interview preparation with STAR method",
        "💼 LinkedIn profile enhancement",
        "🏠 Professional landlord communications",
        "📈 Salary negotiation strategies"
      ],
      industry: {
        technology: "Tech industry expertise: Agile methodologies, cloud platforms, programming languages",
        finance: "Finance sector knowledge: FCA regulations, risk management, financial analysis",
        healthcare: "Healthcare insights: NHS experience, patient care, clinical excellence",
        marketing: "Marketing excellence: Digital strategies, SEO/SEM, analytics, brand management"
      }
    });

    this.languageTemplates.set('pt', {
      greeting: "🤖 Olá! Sou seu assistente avançado de carreira especializado no mercado de trabalho do Reino Unido.",
      cvHelp: "Vou te ajudar a criar um CV excepcional que impressiona empregadores do Reino Unido com conteúdo otimizado para ATS.",
      letterHelp: "Vou criar cartas convincentes que geram resultados - desde cartas de apresentação até comunicações com landlords.",
      interviewHelp: "Vou te preparar para entrevistas no Reino Unido com insights específicos da indústria e estratégias comprovadas.",
      followUp: "Em que área específica você gostaria que eu me concentrasse?",
      suggestions: [
        "📄 Otimização de CV com conquistas quantificadas",
        "✉️ Redação de carta de apresentação com pesquisa da empresa",
        "🎯 Preparação para entrevista com método STAR",
        "💼 Melhoria do perfil do LinkedIn",
        "🏠 Comunicações profissionais com landlord",
        "📈 Estratégias de negociação salarial"
      ],
      industry: {
        technology: "Expertise em tecnologia: Metodologias ágeis, plataformas cloud, linguagens de programação",
        finance: "Conhecimento financeiro: Regulações FCA, gestão de risco, análise financeira",
        healthcare: "Insights de saúde: Experiência NHS, cuidado ao paciente, excelência clínica",
        marketing: "Excelência em marketing: Estratégias digitais, SEO/SEM, analytics, gestão de marca"
      }
    });

    this.languageTemplates.set('es', {
      greeting: "🤖 ¡Hola! Soy tu asistente avanzado de carrera especializado en el mercado laboral del Reino Unido.",
      cvHelp: "Te ayudaré a crear un CV excepcional que impresione a los empleadores del Reino Unido con contenido optimizado para ATS.",
      letterHelp: "Crearé cartas convincentes que generen resultados - desde cartas de presentación hasta comunicaciones con landlords.",
      interviewHelp: "Te prepararé para entrevistas en el Reino Unido con insights específicos de la industria y estrategias probadas.",
      followUp: "¿En qué área específica te gustaría que me enfoque?",
      suggestions: [
        "📄 Optimización de CV con logros cuantificados",
        "✉️ Redacción de carta de presentación con investigación de empresa",
        "🎯 Preparación para entrevistas con método STAR",
        "💼 Mejora del perfil de LinkedIn",
        "🏠 Comunicaciones profesionales con landlord",
        "📈 Estrategias de negociación salarial"
      ],
      industry: {
        technology: "Experiencia en tecnología: Metodologías ágiles, plataformas cloud, lenguajes de programación",
        finance: "Conocimiento financiero: Regulaciones FCA, gestión de riesgo, análisis financiero",
        healthcare: "Insights de salud: Experiencia NHS, cuidado al paciente, excelencia clínica",
        marketing: "Excelencia en marketing: Estrategias digitales, SEO/SEM, analytics, gestión de marca"
      }
    });
  }

  private initializeIndustryKeywords() {
    // Base de dados avançada de palavras-chave por indústria
    this.industryKeywords.set('technology', [
      'javascript', 'python', 'react', 'node.js', 'aws', 'azure', 'docker', 'kubernetes',
      'agile', 'scrum', 'devops', 'ci/cd', 'microservices', 'api', 'machine learning',
      'artificial intelligence', 'blockchain', 'cloud computing', 'cybersecurity'
    ]);

    this.industryKeywords.set('finance', [
      'financial analysis', 'risk management', 'compliance', 'fca regulation', 'excel',
      'bloomberg', 'trading', 'investment banking', 'asset management', 'derivatives',
      'portfolio management', 'fintech', 'regulatory reporting', 'credit risk', 'market risk'
    ]);

    this.industryKeywords.set('healthcare', [
      'patient care', 'nhs', 'clinical excellence', 'medical research', 'healthcare innovation',
      'nursing', 'gmc registration', 'nmc registration', 'clinical governance', 'quality improvement',
      'patient safety', 'evidence-based practice', 'multi-disciplinary team', 'care pathways'
    ]);

    this.industryKeywords.set('marketing', [
      'digital marketing', 'seo', 'sem', 'social media marketing', 'content strategy',
      'google analytics', 'facebook ads', 'email marketing', 'brand management', 'crm',
      'marketing automation', 'conversion optimization', 'growth hacking', 'influencer marketing'
    ]);

    this.industryKeywords.set('legal', [
      'solicitor', 'barrister', 'legal research', 'contract law', 'litigation', 'commercial law',
      'sra regulation', 'bar council', 'property law', 'family law', 'criminal law',
      'dispute resolution', 'due diligence', 'regulatory compliance', 'legal writing'
    ]);

    this.industryKeywords.set('education', [
      'curriculum development', 'assessment', 'safeguarding', 'ofsted', 'teaching standards',
      'differentiation', 'inclusive education', 'behavior management', 'pastoral care',
      'professional development', 'educational technology', 'learning outcomes'
    ]);
  }

  private initializeAdvancedPatterns() {
    // Padrões avançados para geração de conteúdo profissional
    this.patterns.set('cv_achievements_senior', [
      'Led strategic transformation of {department} resulting in {percentage}% improvement in {metric} across {timeframe}',
      'Spearheaded cross-functional initiative involving {number} stakeholders, delivering {outcome} and {financial_impact}',
      'Established industry partnerships that generated £{amount} in new revenue within {period}',
      'Implemented data-driven decision making processes that increased {kpi} by {percentage}% year-over-year'
    ]);

    this.patterns.set('cv_achievements_mid', [
      'Successfully managed {project_type} with budget of £{amount}, delivering {outcome} on schedule',
      'Collaborated with {team_size} team members to achieve {goal}, resulting in {measurable_result}',
      'Developed and executed {strategy} that improved {process} efficiency by {percentage}%',
      'Mentored {number} junior colleagues, with {percentage}% achieving promotion within {timeframe}'
    ]);

    this.patterns.set('cv_achievements_entry', [
      'Contributed to team success by {specific_action}, supporting {team_goal}',
      'Demonstrated strong learning agility by mastering {skill/technology} within {timeframe}',
      'Participated in {project/initiative} that resulted in {positive_outcome}',
      'Showed initiative by {proactive_action} leading to {improvement/recognition}'
    ]);

    this.patterns.set('letter_executive', [
      'Your reputation for {company_strength} and commitment to {value} strongly aligns with my {personal_value} and {years}+ years of {expertise}',
      'Having {specific_achievement}, I am excited about the opportunity to drive {company_objective} as your next {position}',
      'My track record of {quantified_achievement} positions me well to {contribute_how} to {company_name}\'s {strategic_goal}'
    ]);

    this.patterns.set('interview_behavioral', [
      'STAR Example for "{question}": Situation - {context}, Task - {responsibility}, Action - {specific_steps}, Result - {quantified_outcome}',
      'Challenge faced: {problem}, Approach taken: {methodology}, Skills demonstrated: {competencies}, Impact achieved: {results}',
      'Leadership example: {scenario}, Decision process: {reasoning}, Team engagement: {approach}, Outcome: {success_metrics}'
    ]);
  }

  async generateAdvancedResponse(message: string, params: AdvancedParams): Promise<LocalAIResponse> {
    // Análise avançada de contexto com IA semântica
    const semanticContext = this.performSemanticAnalysis(message);
    const detectedIndustry = this.detectIndustryContext(message) || params.industry;
    const intentAnalysis = this.analyzeUserIntent(message);
    const complexityLevel = this.assessComplexityNeeds(message, params.experience);

    // Adicionar à memória contextual
    this.updateContextMemory(message, semanticContext);

    // Gerar resposta contextualizada
    const response = await this.generateContextualResponse(
      semanticContext,
      intentAnalysis,
      params,
      detectedIndustry,
      complexityLevel
    );

    // Calcular confiança baseada em múltiplos fatores
    const confidence = this.calculateAdvancedConfidence(semanticContext, intentAnalysis, detectedIndustry);

    // Gerar sugestões e perguntas de follow-up
    const suggestions = this.generateSmartSuggestions(semanticContext, params.language, detectedIndustry);
    const followUpQuestions = this.generateContextualFollowUp(semanticContext, params.language);

    return {
      content: response,
      suggestions,
      followUpQuestions,
      confidence,
      type: semanticContext.primaryType,
      language: params.language
    };
  }

  private performSemanticAnalysis(message: string): any {
    const messageLower = message.toLowerCase();
    let primaryType: 'cv' | 'letter' | 'interview' | 'general' = 'general';
    let subContext: string[] = [];
    let urgency = 'normal';
    let complexity = 'medium';

    // Análise semântica avançada
    for (const [type, patterns] of this.semanticPatterns) {
      for (const pattern of patterns) {
        if (pattern.test(message)) {
          if (type.startsWith('cv_')) {
            primaryType = 'cv';
            subContext.push(type.replace('cv_', ''));
          } else if (type.startsWith('letter_')) {
            primaryType = 'letter';
            subContext.push(type.replace('letter_', ''));
          } else if (type.startsWith('interview_')) {
            primaryType = 'interview';
            subContext.push(type.replace('interview_', ''));
          }
        }
      }
    }

    // Detectar urgência
    if (messageLower.includes('urgent') || messageLower.includes('asap') || messageLower.includes('tomorrow')) {
      urgency = 'high';
    } else if (messageLower.includes('when possible') || messageLower.includes('no rush')) {
      urgency = 'low';
    }

    // Detectar complexidade
    if (messageLower.includes('executive') || messageLower.includes('senior') || messageLower.includes('director')) {
      complexity = 'high';
    } else if (messageLower.includes('entry') || messageLower.includes('graduate') || messageLower.includes('junior')) {
      complexity = 'low';
    }

    return {
      primaryType,
      subContext,
      urgency,
      complexity,
      keywords: this.extractKeywords(message),
      sentiment: this.analyzeSentiment(message)
    };
  }

  private detectIndustryContext(message: string): string | null {
    const messageLower = message.toLowerCase();
    
    for (const [industry, keywords] of this.industryKeywords) {
      const matchCount = keywords.filter(keyword => 
        messageLower.includes(keyword.toLowerCase())
      ).length;
      
      if (matchCount >= 2) { // Require at least 2 keyword matches
        return industry;
      }
    }
    
    return null;
  }

  private analyzeUserIntent(message: string): any {
    const messageLower = message.toLowerCase();
    
    const intents = {
      create: ['write', 'create', 'make', 'build', 'generate', 'draft'],
      improve: ['improve', 'enhance', 'optimize', 'better', 'upgrade', 'refine'],
      review: ['review', 'check', 'evaluate', 'assess', 'feedback', 'critique'],
      learn: ['explain', 'how', 'what', 'why', 'teach', 'understand', 'learn'],
      specific: ['specific', 'particular', 'exact', 'precise', 'detailed']
    };

    const detectedIntents: string[] = [];
    
    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        detectedIntents.push(intent);
      }
    }

    return {
      primary: detectedIntents[0] || 'general',
      all: detectedIntents,
      confidence: detectedIntents.length > 0 ? 0.8 : 0.4
    };
  }

  private assessComplexityNeeds(message: string, experience?: string): string {
    if (experience) {
      return experience === 'entry' ? 'basic' : experience === 'senior' || experience === 'executive' ? 'advanced' : 'intermediate';
    }

    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('executive') || messageLower.includes('c-level') || messageLower.includes('director')) {
      return 'advanced';
    } else if (messageLower.includes('graduate') || messageLower.includes('entry') || messageLower.includes('first job')) {
      return 'basic';
    }
    
    return 'intermediate';
  }

  private updateContextMemory(message: string, context: any): void {
    const contextEntry = {
      message,
      timestamp: Date.now(),
      type: context.primaryType,
      keywords: context.keywords
    };

    this.contextMemory.push(JSON.stringify(contextEntry));
    
    // Keep only last 15 entries for advanced context
    if (this.contextMemory.length > 15) {
      this.contextMemory.shift();
    }
  }

  private extractKeywords(message: string): string[] {
    // Extração inteligente de palavras-chave
    const words = message.toLowerCase().split(/\s+/);
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'i', 'you', 'he', 'she', 'it', 'we', 'they']);
    
    return words
      .filter(word => word.length > 3 && !stopWords.has(word))
      .slice(0, 10); // Top 10 keywords
  }

  private analyzeSentiment(message: string): string {
    const positiveWords = ['excited', 'confident', 'passionate', 'motivated', 'enthusiastic', 'eager'];
    const negativeWords = ['struggle', 'difficult', 'challenge', 'problem', 'frustrated', 'stuck'];
    
    const messageLower = message.toLowerCase();
    const positiveCount = positiveWords.filter(word => messageLower.includes(word)).length;
    const negativeCount = negativeWords.filter(word => messageLower.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private async generateContextualResponse(
    semanticContext: any,
    intentAnalysis: any,
    params: AdvancedParams,
    industry?: string,
    complexity?: string
  ): Promise<string> {
    const templates = this.languageTemplates.get(params.language) || this.languageTemplates.get('en')!;
    
    let response = templates.greeting + '\n\n';

    // Resposta baseada no tipo principal
    switch (semanticContext.primaryType) {
      case 'cv':
        response += this.generateAdvancedCVResponse(intentAnalysis, params, templates, industry, complexity);
        break;
      case 'letter':
        response += this.generateAdvancedLetterResponse(intentAnalysis, params, templates, industry);
        break;
      case 'interview':
        response += this.generateAdvancedInterviewResponse(intentAnalysis, params, templates);
        break;
      default:
        response += this.generateGeneralGuidance(params, templates);
    }

    // Adicionar insights específicos da indústria
    if (industry && templates.industry[industry]) {
      response += '\n\n🎯 **' + industry.charAt(0).toUpperCase() + industry.slice(1) + ' Industry Insights:**\n';
      response += templates.industry[industry];
    }

    return response;
  }

  private generateAdvancedCVResponse(intentAnalysis: any, params: AdvancedParams, templates: any, industry?: string, complexity?: string): string {
    let response = templates.cvHelp + '\n\n';

    // Resposta baseada na complexidade e intenção
    if (complexity === 'advanced') {
      response += '🎯 **Executive-Level CV Strategy:**\n\n';
      response += this.generateExecutiveCVGuidance(params.language);
    } else if (complexity === 'basic') {
      response += '🌟 **Entry-Level CV Building:**\n\n';
      response += this.generateEntryLevelCVGuidance(params.language);
    } else {
      response += '📈 **Professional CV Enhancement:**\n\n';
      response += this.generateMidLevelCVGuidance(params.language);
    }

    // Adicionar exemplos baseados na intenção
    if (intentAnalysis.primary === 'create') {
      response += '\n\n📝 **CV Creation Framework:**\n';
      response += this.getCVCreationFramework(params.language);
    } else if (intentAnalysis.primary === 'improve') {
      response += '\n\n✨ **CV Optimization Checklist:**\n';
      response += this.getCVOptimizationChecklist(params.language);
    }

    return response;
  }

  private generateAdvancedLetterResponse(intentAnalysis: any, params: AdvancedParams, templates: any, industry?: string): string {
    let response = templates.letterHelp + '\n\n';

    response += '📋 **Letter Writing Excellence:**\n\n';
    
    if (intentAnalysis.primary === 'create') {
      response += this.getLetterCreationGuide(params.language);
    } else {
      response += this.getLetterImprovementTips(params.language);
    }

    return response;
  }

  private generateAdvancedInterviewResponse(intentAnalysis: any, params: AdvancedParams, templates: any): string {
    let response = templates.interviewHelp + '\n\n';

    response += '🎯 **Advanced Interview Mastery:**\n\n';
    response += this.getInterviewMasteryGuide(params.language);

    return response;
  }

  // Helper methods for content generation
  private generateExecutiveCVGuidance(language: string): string {
    if (language === 'pt') {
      return '• Foque em transformação organizacional e resultados estratégicos\n• Inclua métricas de P&L e crescimento de receita\n• Destaque liderança de equipes multifuncionais\n• Mencione experiência em fusões e aquisições se relevante';
    } else if (language === 'es') {
      return '• Enfócate en transformación organizacional y resultados estratégicos\n• Incluye métricas de P&L y crecimiento de ingresos\n• Destaca liderazgo de equipos multifuncionales\n• Menciona experiencia en fusiones y adquisiciones si es relevante';
    }
    return '• Focus on organizational transformation and strategic outcomes\n• Include P&L metrics and revenue growth\n• Highlight cross-functional team leadership\n• Mention M&A experience if relevant';
  }

  private generateEntryLevelCVGuidance(language: string): string {
    if (language === 'pt') {
      return '• Destaque projetos acadêmicos e estágios\n• Inclua habilidades transferíveis de trabalhos de meio período\n• Mostre iniciativa através de trabalho voluntário\n• Foque em potencial e vontade de aprender';
    } else if (language === 'es') {
      return '• Destaca proyectos académicos y prácticas\n• Incluye habilidades transferibles de trabajos de medio tiempo\n• Muestra iniciativa a través de trabajo voluntario\n• Enfócate en potencial y ganas de aprender';
    }
    return '• Highlight academic projects and internships\n• Include transferable skills from part-time work\n• Show initiative through volunteer work\n• Focus on potential and eagerness to learn';
  }

  private generateMidLevelCVGuidance(language: string): string {
    if (language === 'pt') {
      return '• Quantifique conquistas com números específicos\n• Mostre progressão de carreira e promoções\n• Inclua projetos que liderou ou co-liderou\n• Destaque mentoria e desenvolvimento de equipe';
    } else if (language === 'es') {
      return '• Cuantifica logros con números específicos\n• Muestra progresión de carrera y promociones\n• Incluye proyectos que lideraste o co-lideraste\n• Destaca mentoría y desarrollo de equipo';
    }
    return '• Quantify achievements with specific numbers\n• Show career progression and promotions\n• Include projects you led or co-led\n• Highlight mentoring and team development';
  }

  private getCVCreationFramework(language: string): string {
    if (language === 'pt') {
      return '1. **Declaração Pessoal** (2-3 linhas)\n2. **Experiência Profissional** (ordem cronológica reversa)\n3. **Educação & Qualificações**\n4. **Habilidades Chave**\n5. **Realizações & Certificações**';
    } else if (language === 'es') {
      return '1. **Declaración Personal** (2-3 líneas)\n2. **Experiencia Profesional** (orden cronológico inverso)\n3. **Educación y Calificaciones**\n4. **Habilidades Clave**\n5. **Logros y Certificaciones**';
    }
    return '1. **Personal Statement** (2-3 lines)\n2. **Professional Experience** (reverse chronological)\n3. **Education & Qualifications**\n4. **Key Skills**\n5. **Achievements & Certifications**';
  }

  private getCVOptimizationChecklist(language: string): string {
    if (language === 'pt') {
      return '✅ Palavras-chave do anúncio incluídas\n✅ Conquistas quantificadas com números\n✅ Verbos de ação fortes utilizados\n✅ Formatação limpa e consistente\n✅ Revisão ortográfica completa';
    } else if (language === 'es') {
      return '✅ Palabras clave del anuncio incluidas\n✅ Logros cuantificados con números\n✅ Verbos de acción fuertes utilizados\n✅ Formato limpio y consistente\n✅ Revisión ortográfica completa';
    }
    return '✅ Job posting keywords included\n✅ Achievements quantified with numbers\n✅ Strong action verbs used\n✅ Clean, consistent formatting\n✅ Thorough proofreading completed';
  }

  private getLetterCreationGuide(language: string): string {
    if (language === 'pt') {
      return '**Estrutura da Carta:**\n• **Abertura:** Posição específica + interesse genuíno\n• **Corpo:** Conquistas relevantes + pesquisa da empresa\n• **Fechamento:** Reafirmação + próximos passos';
    } else if (language === 'es') {
      return '**Estructura de la Carta:**\n• **Apertura:** Posición específica + interés genuino\n• **Cuerpo:** Logros relevantes + investigación de empresa\n• **Cierre:** Reafirmación + próximos pasos';
    }
    return '**Letter Structure:**\n• **Opening:** Specific position + genuine interest\n• **Body:** Relevant achievements + company research\n• **Closing:** Reaffirmation + next steps';
  }

  private getLetterImprovementTips(language: string): string {
    if (language === 'pt') {
      return '• Personalize para cada aplicação\n• Pesquise o gerente de contratação\n• Use exemplos específicos de conquistas\n• Mostre conhecimento da empresa\n• Mantenha tom profissional mas autêntico';
    } else if (language === 'es') {
      return '• Personaliza para cada aplicación\n• Investiga al gerente de contratación\n• Usa ejemplos específicos de logros\n• Muestra conocimiento de la empresa\n• Mantén tono profesional pero auténtico';
    }
    return '• Customize for each application\n• Research the hiring manager\n• Use specific achievement examples\n• Show company knowledge\n• Keep professional yet authentic tone';
  }

  private getInterviewMasteryGuide(language: string): string {
    if (language === 'pt') {
      return '🎯 **Preparação Estratégica:**\n• Método STAR para perguntas comportamentais\n• Pesquisa profunda da empresa e setor\n• Preparação de perguntas inteligentes\n• Prática de comunicação não-verbal\n• Estratégias de negociação salarial';
    } else if (language === 'es') {
      return '🎯 **Preparación Estratégica:**\n• Método STAR para preguntas conductuales\n• Investigación profunda de empresa y sector\n• Preparación de preguntas inteligentes\n• Práctica de comunicación no verbal\n• Estrategias de negociación salarial';
    }
    return '🎯 **Strategic Preparation:**\n• STAR method for behavioral questions\n• Deep company and industry research\n• Intelligent questions preparation\n• Non-verbal communication practice\n• Salary negotiation strategies';
  }

  private generateGeneralGuidance(params: AdvancedParams, templates: any): string {
    return templates.followUp + '\n\n' + 
           '**Available Services:**\n' + 
           templates.suggestions.map((s: string) => `• ${s}`).join('\n');
  }

  private calculateAdvancedConfidence(semanticContext: any, intentAnalysis: any, industry?: string): number {
    let confidence = 0.5; // Base confidence

    // Boost confidence based on semantic analysis
    if (semanticContext.primaryType !== 'general') confidence += 0.2;
    if (semanticContext.subContext.length > 0) confidence += 0.1;
    
    // Boost confidence based on intent clarity
    if (intentAnalysis.confidence > 0.7) confidence += 0.15;
    
    // Boost confidence if industry detected
    if (industry) confidence += 0.1;

    // Cap at 0.95 to maintain realism
    return Math.min(confidence, 0.95);
  }

  private generateSmartSuggestions(semanticContext: any, language: string, industry?: string): string[] {
    const templates = this.languageTemplates.get(language) || this.languageTemplates.get('en')!;
    
    let suggestions = [...templates.suggestions];
    
    // Add industry-specific suggestions
    if (industry) {
      if (language === 'pt') {
        suggestions.push(`🏭 Otimização específica para ${industry}`);
      } else if (language === 'es') {
        suggestions.push(`🏭 Optimización específica para ${industry}`);
      } else {
        suggestions.push(`🏭 ${industry}-specific optimization`);
      }
    }

    return suggestions.slice(0, 6); // Return top 6 suggestions
  }

  private generateContextualFollowUp(semanticContext: any, language: string): string[] {
    const questions: Record<string, string[]> = {
      en: [
        "Would you like me to focus on any specific section?",
        "Are you targeting a particular company or role?",
        "Do you need help with industry-specific requirements?",
        "Would you like examples tailored to your experience level?"
      ],
      pt: [
        "Gostaria que eu focasse em alguma seção específica?",
        "Está mirando alguma empresa ou cargo específico?",
        "Precisa de ajuda com requisitos específicos da indústria?",
        "Gostaria de exemplos adequados ao seu nível de experiência?"
      ],
      es: [
        "¿Te gustaría que me enfoque en alguna sección específica?",
        "¿Estás apuntando a alguna empresa o puesto específico?",
        "¿Necesitas ayuda con requisitos específicos de la industria?",
        "¿Te gustarían ejemplos adaptados a tu nivel de experiencia?"
      ]
    };

    return questions[language] || questions.en;
  }

  // Método principal para compatibilidade com API existente
  async generateResponse(message: string, language: string = 'en'): Promise<string> {
    const params: AdvancedParams = {
      language,
      tone: 'professional',
      context: 'general'
    };

    const response = await this.generateAdvancedResponse(message, params);
    return response.content;
  }
}