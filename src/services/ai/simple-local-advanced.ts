// AI Local Avançada - Sistema de IA 100% local otimizado
// Processamento avançado de contexto e multilinguagem
// Enhanced with Advanced Prompt System by Senior AI Engineers

import { conversationMemory } from './conversation-memory';
import { intelligentPDFService } from './intelligent-pdf';
import { AdvancedPromptSystem, DocumentGenerationIntelligence } from './advanced-prompt-system';
import { MassiveMultilingualAI } from './massive-multilingual-ai';

export interface LocalAIResponse {
  content: string;
  suggestions?: string[];
  followUpQuestions?: string[];
  confidence: number;
  type: 'cv' | 'letter' | 'interview' | 'general' | 'tips';
  language: string;
  sessionId?: string;
  canGeneratePDF?: {
    cv: boolean;
    letter: boolean;
    message?: string;
  };
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
    // Templates humanizados e conversacionais
    this.languageTemplates.set('en', {
      greeting: "Hey there! 👋 I'm here to help you nail the UK job market - think of me as your friendly career coach who happens to know all the insider tricks.",
      cvHelp: "Let's make your CV absolutely shine! I know exactly what UK employers are looking for, and I'm excited to help you stand out from the crowd.",
      letterHelp: "Time to write some killer letters! Whether it's a cover letter that opens doors or a landlord letter that gets things sorted - I've got you covered.",
      interviewHelp: "Interview prep time! 🎯 I'll share the insider secrets that actually work in UK interviews. No generic advice here - just proven strategies.",
      followUp: "So, what would you like to tackle next?",
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
      greeting: "Oi! 👋 Que bom te ver aqui! Sou seu parceiro de carreira especialista no mercado britânico - vamos fazer sua carreira decolar no Reino Unido!",
      cvHelp: "Bora criar um CV que vai fazer os recrutadores pararem tudo para te chamar! Eu conheço todos os segredinhos que funcionam por lá.",
      letterHelp: "Hora de escrever cartas que realmente funcionam! Seja carta de apresentação que abre portas ou comunicação com landlord que resolve na hora - estou aqui pra isso!",
      interviewHelp: "Preparação para entrevista é comigo mesmo! 🎯 Vou te ensinar as táticas que realmente funcionam no Reino Unido. Nada de dica genérica não!",
      followUp: "Então, o que vamos trabalhar agora?",
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
      greeting: "¡Hola! 👋 ¡Qué alegría tenerte aquí! Soy tu compañero de carrera experto en el mercado británico - ¡vamos a hacer que triunfes en el Reino Unido!",
      cvHelp: "¡Vamos a crear un CV que haga que los reclutadores se detengan para llamarte! Conozco todos los trucos que realmente funcionan allí.",
      letterHelp: "¡Hora de escribir cartas que den resultados de verdad! Ya sea carta de presentación que abra puertas o comunicación con el landlord que resuelva al instante - ¡estoy aquí para eso!",
      interviewHelp: "¡La preparación para entrevistas es lo mío! 🎯 Te enseñaré las tácticas que realmente funcionan en el Reino Unido. ¡Nada de consejos genéricos!",
      followUp: "Entonces, ¿qué vamos a trabajar ahora?",
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

  async generateAdvancedResponse(message: string, params: AdvancedParams, sessionId?: string): Promise<LocalAIResponse> {
    // 1. Gerenciar sessão e memória
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      currentSessionId = conversationMemory.createSession(params.context ?? 'default-user');
    }
    
    // Adicionar mensagem do usuário à memória
    conversationMemory.addMessage(currentSessionId, 'user', message);

    // 2. Análise avançada de contexto com IA semântica
    const semanticContext = this.performSemanticAnalysis(message);
    const detectedIndustry = this.detectIndustryContext(message) ?? params.industry;
    const intentAnalysis = this.analyzeUserIntent(message);
    const complexityLevel = this.assessComplexityNeeds(message, params.experience);

    // 3. Extrair dados do usuário da conversa
    const extractedData = conversationMemory.extractUserDataFromMessage(message);
    conversationMemory.updateExtractedData(currentSessionId, extractedData);

    // 4. Adicionar à memória contextual
    this.updateContextMemory(message, semanticContext);

    // 5. Gerar resposta contextualizada
    const response = await this.generateContextualResponse(
      semanticContext,
      intentAnalysis,
      params,
      detectedIndustry,
      complexityLevel
    );

    // 6. Verificar se pode gerar PDF
    const session = conversationMemory.getSession(currentSessionId);
    const pdfCapability = session ? intelligentPDFService.shouldOfferPDFGeneration(session) : { cv: false, letter: false, message: '' };

    // 7. Calcular confiança baseada em múltiplos fatores
    const confidence = this.calculateAdvancedConfidence(semanticContext, intentAnalysis, detectedIndustry);

    // 8. Gerar sugestões e perguntas de follow-up
    const suggestions = this.generateContextualSuggestions(semanticContext, params.language, detectedIndustry);
    const followUpQuestions = this.generateContextualFollowUp(semanticContext, params.language);

    // 9. Adicionar resposta da AI à memória
    conversationMemory.addMessage(currentSessionId, 'assistant', response);

    return {
      content: response + (pdfCapability.message ? '\n\n' + pdfCapability.message : ''),
      suggestions,
      followUpQuestions,
      confidence,
      type: semanticContext.primaryType,
      language: params.language,
      sessionId: currentSessionId,
      canGeneratePDF: pdfCapability
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
    if (messageLower.includes('urgent') ?? messageLower.includes('asap') ?? messageLower.includes('tomorrow')) {
      urgency = 'high';
    } else if (messageLower.includes('when possible') ?? messageLower.includes('no rush')) {
      urgency = 'low';
    }

    // Detectar complexidade
    if (messageLower.includes('executive') ?? messageLower.includes('senior') ?? messageLower.includes('director')) {
      complexity = 'high';
    } else if (messageLower.includes('entry') ?? messageLower.includes('graduate') ?? messageLower.includes('junior')) {
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
      primary: detectedIntents[0] ?? 'general',
      all: detectedIntents,
      confidence: detectedIntents.length > 0 ? 0.8 : 0.4
    };
  }

  private assessComplexityNeeds(message: string, experience?: string): string {
    if (experience) {
      return experience === 'entry' ? 'basic' : (experience === 'senior' || experience === 'executive') ? 'advanced' : 'intermediate';
    }

    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('executive') ?? messageLower.includes('c-level') ?? messageLower.includes('director')) {
      return 'advanced';
    } else if (messageLower.includes('graduate') ?? messageLower.includes('entry') ?? messageLower.includes('first job')) {
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
    const templates = this.languageTemplates.get(params.language) ?? this.languageTemplates.get('en')!;
    
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

    // Adicionar próximo passo humanizado
    response += this.getNextStepQuestion('cv', params.language);

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

    // Adicionar próximo passo humanizado
    response += this.getNextStepQuestion('letter', params.language);

    return response;
  }

  private generateAdvancedInterviewResponse(intentAnalysis: any, params: AdvancedParams, templates: any): string {
    let response = templates.interviewHelp + '\n\n';

    response += '🎯 **Advanced Interview Mastery:**\n\n';
    response += this.getInterviewMasteryGuide(params.language);

    // Adicionar próximo passo humanizado
    response += this.getNextStepQuestion('interview', params.language);

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

  private generateContextualSuggestions(semanticContext: any, language: string, industry?: string): string[] {
    const templates = this.languageTemplates.get(language) ?? this.languageTemplates.get('en')!;
    
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

    return questions[language] ?? questions.en;
  }

  private getNextStepQuestion(context: string, language: string): string {
    const nextStepQuestions = {
      en: {
        cv: [
          "\n\n💭 **What's next?** Would you like me to help you write specific bullet points for your experience? Or maybe work on your personal statement?",
          "\n\n🎯 **Ready for the next step?** I can help you tailor this CV for a specific job posting, or we could work on optimizing it for ATS systems. What sounds good?",
          "\n\n✨ **How can we make this even better?** Should we focus on quantifying your achievements with specific numbers, or would you prefer to work on a particular section?"
        ],
        letter: [
          "\n\n💭 **What's your next move?** Want me to help you write a specific cover letter for a job you're eyeing? Or need help with a landlord letter?",
          "\n\n🎯 **Ready to take action?** I can help you craft the perfect opening paragraph, or we could work on matching your experience to job requirements. Your call!",
          "\n\n✨ **Let's keep the momentum going!** Should we write a complete letter together, or would you prefer tips on researching the company first?"
        ],
        interview: [
          "\n\n💭 **Feeling more confident already?** Want to practice answers to specific questions, or should we work on your 'tell me about yourself' pitch?",
          "\n\n🎯 **Ready to ace that interview?** I can help you prepare STAR method examples, or we could work on questions to ask the interviewer. What feels most important?",
          "\n\n✨ **Let's nail this!** Should we practice behavioral questions, or would you prefer to work on technical interview prep for your field?"
        ]
      },
      pt: {
        cv: [
          "\n\n💭 **E agora, o que achou?** Que tal eu te ajudar a escrever bullet points específicos da sua experiência? Ou podemos trabalhar no seu resumo pessoal?",
          "\n\n🎯 **Pronto pro próximo passo?** Posso te ajudar a adaptar esse CV para uma vaga específica, ou trabalhar na otimização para sistemas ATS. O que prefere?",
          "\n\n✨ **Como podemos deixar ainda melhor?** Vamos focar em quantificar suas conquistas com números específicos, ou prefere trabalhar em alguma seção particular?"
        ],
        letter: [
          "\n\n💭 **Qual o próximo passo?** Quer que eu te ajude a escrever uma carta específica para alguma vaga que você está de olho? Ou precisa de ajuda com carta pro landlord?",
          "\n\n🎯 **Bora colocar em prática?** Posso te ajudar a criar o parágrafo de abertura perfeito, ou trabalhar em como conectar sua experiência com os requisitos da vaga. Você escolhe!",
          "\n\n✨ **Vamos manter o ritmo!** Escrevemos uma carta completa juntos, ou prefere dicas de como pesquisar a empresa primeiro?"
        ],
        interview: [
          "\n\n💭 **Já se sentindo mais confiante?** Quer praticar respostas para perguntas específicas, ou trabalhamos no seu pitch de 'me fale sobre você'?",
          "\n\n🎯 **Pronto pra arrasar na entrevista?** Posso te ajudar a preparar exemplos usando método STAR, ou trabalhar em perguntas pra fazer pro entrevistador. O que é mais importante?",
          "\n\n✨ **Vamos mandar bem!** Praticamos perguntas comportamentais, ou prefere preparação técnica específica da sua área?"
        ]
      },
      es: {
        cv: [
          "\n\n💭 **¿Qué te parece?** ¿Te ayudo a escribir puntos específicos de tu experiencia? ¿O trabajamos en tu resumen personal?",
          "\n\n🎯 **¿Listo para el siguiente paso?** Puedo ayudarte a adaptar este CV para una vacante específica, o trabajar en la optimización para sistemas ATS. ¿Qué prefieres?",
          "\n\n✨ **¿Cómo podemos mejorarlo aún más?** ¿Nos enfocamos en cuantificar tus logros con números específicos, o prefieres trabajar en alguna sección particular?"
        ],
        letter: [
          "\n\n💭 **¿Cuál es tu próximo paso?** ¿Quieres que te ayude a escribir una carta específica para algún trabajo que tienes en mente? ¿O necesitas ayuda con una carta para el landlord?",
          "\n\n🎯 **¿Listo para ponerlo en práctica?** Puedo ayudarte a crear el párrafo de apertura perfecto, o trabajar en cómo conectar tu experiencia con los requisitos del trabajo. ¡Tú eliges!",
          "\n\n✨ **¡Mantengamos el impulso!** ¿Escribimos una carta completa juntos, o prefieres consejos sobre cómo investigar la empresa primero?"
        ],
        interview: [
          "\n\n💭 **¿Ya te sientes más confiado?** ¿Quieres practicar respuestas a preguntas específicas, o trabajamos en tu presentación de 'háblame de ti'?",
          "\n\n🎯 **¿Listo para brillar en la entrevista?** Puedo ayudarte a preparar ejemplos usando el método STAR, o trabajar en preguntas para hacer al entrevistador. ¿Qué es más importante?",
          "\n\n✨ **¡Vamos a hacerlo genial!** ¿Practicamos preguntas de comportamiento, o prefieres preparación técnica específica de tu área?"
        ]
      }
    };

    const questions = (nextStepQuestions as any)[language] ?? nextStepQuestions.en;
    const contextQuestions = (questions as any)[context] ?? questions.cv;
    
    // Escolher pergunta aleatória para variar
    const randomIndex = Math.floor(Math.random() * contextQuestions.length);
    return contextQuestions[randomIndex];
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

  // Enhanced method using Massive Multilingual AI System
  async generateEnhancedResponse(
    message: string, 
    conversationHistory: { role: string; content: string }[],
    sessionId: string = 'default'
  ): Promise<LocalAIResponse> {
    try {
      // Use Massive Multilingual AI for response generation
      const massiveResponse = await MassiveMultilingualAI.generateMultilingualResponse(
        message,
        conversationHistory
      );

      // Use Advanced Prompt System for document generation analysis
      const context = AdvancedPromptSystem.analyzeConversation(conversationHistory);
      const documentOffers = DocumentGenerationIntelligence.shouldOfferGeneration(context);
      
      // Store conversation in memory
      conversationMemory.addMessage(sessionId, 'user', message);      
      conversationMemory.addMessage(sessionId, 'assistant', massiveResponse.content);

      return {
        content: massiveResponse.content,
        suggestions: this.generateSmartSuggestions(context),
        followUpQuestions: context.documentReadiness.suggestedQuestions.slice(0, 2),
        confidence: massiveResponse.confidence,
        type: this.mapContextToType(context.userIntent),
        language: massiveResponse.language,
        sessionId,
        canGeneratePDF: documentOffers.offerCV ?? documentOffers.offerLetter ? {
          cv: documentOffers.offerCV,
          letter: documentOffers.offerLetter,
          message: documentOffers.message
        } : undefined
      };
    } catch (error) {
      console.error('Enhanced multilingual response generation failed:', error);
      
      // Fallback to basic response with language detection
      const languageDetection = MassiveMultilingualAI.detectLanguage(message);
      
      const params: AdvancedParams = {
        language: languageDetection.language,
        tone: 'professional',
        context: 'general'
      };
      
      const fallbackResponse = await this.generateAdvancedResponse(message, params);
      return {
        content: fallbackResponse.content,
        confidence: 0.5,
        type: 'general',
        language: languageDetection.language
      };
    }
  }

  private generateSmartSuggestions(context: any): string[] {
    const suggestions = [
      "Tell me about your work experience",
      "What are your key skills?",
      "What type of role are you targeting?",
      "Would you like help with interview preparation?"
    ];
    
    // Customize suggestions based on context
    if (context.extractedData?.industry) {
      suggestions.unshift(`How to optimize CV for ${context.extractedData.industry} industry`);
    }
    
    if (context.documentReadiness?.cvReady) {
      suggestions.unshift("Generate my professional CV");
    }
    
    if (context.documentReadiness?.letterReady) {
      suggestions.unshift("Create my cover letter");
    }
    
    return suggestions.slice(0, 3);
  }

  private mapContextToType(intent: string): 'cv' | 'letter' | 'interview' | 'general' | 'tips' {
    const mapping: Record<string, any> = {
      'cv_creation': 'cv',
      'letter_creation': 'letter',
      'career_advice': 'tips',
      'general_inquiry': 'general'
    };
    
    return mapping[intent] ?? 'general';
  }
}
