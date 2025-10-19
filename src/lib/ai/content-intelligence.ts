/**
 * Advanced AI Pipeline with Content Intelligence
 * Implementa pipeline de ML para análise de conteúdo e otimização
 */

interface ContentAnalysis {
  sentiment: {
    score: number; // -1 to 1
    confidence: number;
    emotions: string[];
  };
  readability: {
    score: number; // 0-100 (Flesch Reading Ease)
    grade: number; // Grade level
    complexity: 'low' | 'medium' | 'high';
  };
  keywords: {
    primary: string[];
    secondary: string[];
    ats_optimized: string[];
  };
  structure: {
    bullet_points: number;
    paragraphs: number;
    sections: string[];
    word_count: number;
  };
  quality: {
    score: number; // 0-100
    strengths: string[];
    improvements: string[];
  };
}

interface OptimizationSuggestion {
  type: 'structure' | 'content' | 'keywords' | 'readability';
  priority: 'low' | 'medium' | 'high' | 'critical';
  suggestion: string;
  impact: number; // 0-100
  implementation: {
    before: string;
    after: string;
    reasoning: string;
  };
}

class ContentIntelligenceEngine {
  private industryKeywords: Map<string, string[]> = new Map();
  private atsPatterns: RegExp[] = [];
  private qualityPatterns: {pattern: RegExp; score: number; message: string}[] = [];

  constructor() {
    this.initializeKeywordDatabase();
    this.initializeATSPatterns();
    this.initializeQualityPatterns();
  }

  // Análise completa de conteúdo
  async analyzeContent(text: string, context: {
    type: 'cv' | 'cover_letter';
    industry?: string;
    role?: string;
    target_company?: string;
  }): Promise<ContentAnalysis> {
    
    const [sentiment, readability, keywords, structure] = await Promise.all([
      this.analyzeSentiment(text),
      this.analyzeReadability(text),
      this.extractKeywords(text, context),
      this.analyzeStructure(text, context.type)
    ]);

    const quality = this.assessQuality(text, context, {
      sentiment,
      readability,
      keywords,
      structure
    });

    return {
      sentiment,
      readability,
      keywords,
      structure,
      quality
    };
  }

  // Gerar sugestões de otimização
  async generateOptimizations(
    analysis: ContentAnalysis,
    text: string,
    context: { type: 'cv' | 'cover_letter'; industry?: string; role?: string }
  ): Promise<OptimizationSuggestion[]> {
    const suggestions: OptimizationSuggestion[] = [];

    // Otimizações de estrutura
    suggestions.push(...this.generateStructureSuggestions(analysis.structure, context));
    
    // Otimizações de conteúdo
    suggestions.push(...this.generateContentSuggestions(analysis, text, context));
    
    // Otimizações de palavras-chave
    suggestions.push(...this.generateKeywordSuggestions(analysis.keywords, context));
    
    // Otimizações de legibilidade
    suggestions.push(...this.generateReadabilitySuggestions(analysis.readability, text));

    // Ordenar por prioridade e impacto
    return suggestions.sort((a, b) => {
      const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.impact - a.impact;
    });
  }

  // Otimização automática de texto
  async autoOptimizeText(
    text: string,
    context: { type: 'cv' | 'cover_letter'; industry?: string; role?: string }
  ): Promise<{
    optimized_text: string;
    changes: Array<{
      type: string;
      original: string;
      optimized: string;
      reasoning: string;
    }>;
    improvement_score: number;
  }> {
    const analysis = await this.analyzeContent(text, context);
    const suggestions = await this.generateOptimizations(analysis, text, context);
    
    let optimizedText = text;
    const changes: Array<{
      type: string;
      original: string;
      optimized: string;
      reasoning: string;
    }> = [];

    // Aplicar otimizações críticas e de alto impacto
    for (const suggestion of suggestions) {
      if (suggestion.priority === 'critical' || 
          (suggestion.priority === 'high' && suggestion.impact > 70)) {
        
        optimizedText = optimizedText.replace(
          suggestion.implementation.before,
          suggestion.implementation.after
        );

        changes.push({
          type: suggestion.type,
          original: suggestion.implementation.before,
          optimized: suggestion.implementation.after,
          reasoning: suggestion.implementation.reasoning
        });
      }
    }

    const originalAnalysis = await this.analyzeContent(text, context);
    const optimizedAnalysis = await this.analyzeContent(optimizedText, context);
    
    const improvementScore = optimizedAnalysis.quality.score - originalAnalysis.quality.score;

    return {
      optimized_text: optimizedText,
      changes,
      improvement_score: improvementScore
    };
  }

  // Análise de sentimento
  private async analyzeSentiment(text: string): Promise<ContentAnalysis['sentiment']> {
    // Implementação simplificada - em produção, usar serviço ML real
    const positiveWords = ['achieved', 'improved', 'successful', 'led', 'managed', 'created', 'developed'];
    const negativeWords = ['failed', 'struggled', 'difficult', 'problems', 'issues'];
    
    const words = text.toLowerCase().split(/\s+/);
    let score = 0;
    const emotions: string[] = [];

    for (const word of words) {
      if (positiveWords.includes(word)) {
        score += 0.1;
        emotions.push('confidence');
      } else if (negativeWords.includes(word)) {
        score -= 0.1;
        emotions.push('concern');
      }
    }

    score = Math.max(-1, Math.min(1, score));
    const confidence = Math.abs(score) * 0.8; // Simplified confidence

    return {
      score,
      confidence,
      emotions: [...new Set(emotions)]
    };
  }

  // Análise de legibilidade
  private analyzeReadability(text: string): ContentAnalysis['readability'] {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const words = text.split(/\s+/);
    const syllables = words.reduce((count, word) => count + this.countSyllables(word), 0);

    const avgSentenceLength = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;

    // Flesch Reading Ease Score
    const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    const score = Math.max(0, Math.min(100, fleschScore));

    // Grade level (simplified)
    let grade = 12;
    if (score >= 90) grade = 5;
    else if (score >= 80) grade = 6;
    else if (score >= 70) grade = 7;
    else if (score >= 60) grade = 8;
    else if (score >= 50) grade = 9;
    else if (score >= 30) grade = 10;

    const complexity = score >= 70 ? 'low' : score >= 50 ? 'medium' : 'high';

    return { score, grade, complexity };
  }

  private countSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    const vowels = word.match(/[aeiouy]/g);
    let syllableCount = vowels ? vowels.length : 1;
    
    if (word.endsWith('e')) syllableCount--;
    if (syllableCount === 0) syllableCount = 1;
    
    return syllableCount;
  }

  // Extração de palavras-chave
  private async extractKeywords(
    text: string, 
    context: { industry?: string; role?: string }
  ): Promise<ContentAnalysis['keywords']> {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const wordFreq = new Map<string, number>();
    
    // Contar frequência
    for (const word of words) {
      if (word.length > 3) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }
    }

    // Palavras-chave primárias (mais frequentes)
    const primary = Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);

    // Palavras-chave específicas da indústria
    const industryWords = context.industry ? 
      this.industryKeywords.get(context.industry) || [] : [];
    
    const secondary = words.filter(word => 
      industryWords.includes(word) && !primary.includes(word)
    );

    // Palavras otimizadas para ATS
    const ats_optimized = words.filter(word => 
      this.atsPatterns.some(pattern => pattern.test(word))
    );

    return {
      primary: primary.slice(0, 5),
      secondary: secondary.slice(0, 5),
      ats_optimized: ats_optimized.slice(0, 8)
    };
  }

  // Análise estrutural
  private analyzeStructure(text: string, type: 'cv' | 'cover_letter'): ContentAnalysis['structure'] {
    const bullet_points = (text.match(/•|\*|\-\s/g) || []).length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
    const word_count = text.split(/\s+/).length;
    
    const sections: string[] = [];
    const sectionPatterns = {
      cv: [
        /summary|profile|objective/i,
        /experience|employment|work/i,
        /education|qualifications/i,
        /skills|competencies/i,
        /achievements|awards/i
      ],
      cover_letter: [
        /introduction|opening/i,
        /body|experience/i,
        /conclusion|closing/i
      ]
    };

    for (const pattern of sectionPatterns[type]) {
      if (pattern.test(text)) {
        sections.push(pattern.source.split('|')[0]);
      }
    }

    return {
      bullet_points,
      paragraphs,
      sections,
      word_count
    };
  }

  // Avaliação de qualidade
  private assessQuality(
    text: string,
    context: any,
    analysis: Partial<ContentAnalysis>
  ): ContentAnalysis['quality'] {
    let score = 50; // Base score
    const strengths: string[] = [];
    const improvements: string[] = [];

    // Avaliar sentimento
    if (analysis.sentiment && analysis.sentiment.score > 0.3) {
      score += 15;
      strengths.push('Positive and confident tone');
    } else if (analysis.sentiment && analysis.sentiment.score < -0.1) {
      score -= 10;
      improvements.push('Use more positive language');
    }

    // Avaliar legibilidade
    if (analysis.readability && analysis.readability.score > 60) {
      score += 10;
      strengths.push('Good readability');
    } else if (analysis.readability && analysis.readability.score < 40) {
      score -= 15;
      improvements.push('Simplify complex sentences');
    }

    // Avaliar estrutura
    if (analysis.structure) {
      if (context.type === 'cv' && analysis.structure.bullet_points > 0) {
        score += 5;
        strengths.push('Uses bullet points effectively');
      }
      
      if (analysis.structure.word_count < 100) {
        score -= 20;
        improvements.push('Content too brief - add more detail');
      } else if (analysis.structure.word_count > 800 && context.type === 'cv') {
        score -= 10;
        improvements.push('Content too lengthy - consider condensing');
      }
    }

    // Avaliar palavras-chave
    if (analysis.keywords && analysis.keywords.ats_optimized.length > 0) {
      score += 10;
      strengths.push('Contains ATS-friendly keywords');
    } else {
      improvements.push('Add industry-specific keywords');
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      strengths,
      improvements
    };
  }

  // Métodos de geração de sugestões (simplificados para exemplo)
  private generateStructureSuggestions(structure: any, context: any): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    if (context.type === 'cv' && structure.bullet_points < 3) {
      suggestions.push({
        type: 'structure',
        priority: 'high',
        suggestion: 'Add more bullet points to highlight achievements',
        impact: 75,
        implementation: {
          before: 'Text paragraph format',
          after: '• Bullet point format\n• Clear achievement highlights\n• Quantified results',
          reasoning: 'Bullet points improve readability and ATS parsing'
        }
      });
    }

    return suggestions;
  }

  private generateContentSuggestions(analysis: any, text: string, context: any): OptimizationSuggestion[] {
    return [];
  }

  private generateKeywordSuggestions(keywords: any, context: any): OptimizationSuggestion[] {
    return [];
  }

  private generateReadabilitySuggestions(readability: any, text: string): OptimizationSuggestion[] {
    return [];
  }

  // Inicialização de dados
  private initializeKeywordDatabase() {
    this.industryKeywords.set('technology', [
      'javascript', 'python', 'react', 'node.js', 'aws', 'docker', 'kubernetes',
      'api', 'database', 'sql', 'nosql', 'microservices', 'agile', 'scrum'
    ]);
    
    this.industryKeywords.set('marketing', [
      'campaigns', 'seo', 'ppc', 'analytics', 'conversion', 'roi', 'kpi',
      'social media', 'content marketing', 'email marketing', 'lead generation'
    ]);
    
    this.industryKeywords.set('finance', [
      'financial analysis', 'budgeting', 'forecasting', 'compliance', 'audit',
      'risk management', 'portfolio', 'derivatives', 'excel', 'sql'
    ]);
  }

  private initializeATSPatterns() {
    this.atsPatterns = [
      /manage|lead|develop|create|implement|achieve|improve|increase/i,
      /\d+%|\d+\+|[$£€]\d+/i, // Numbers and percentages
      /certified|qualified|experienced|proficient|expert/i
    ];
  }

  private initializeQualityPatterns() {
    this.qualityPatterns = [
      {
        pattern: /achieved|improved|increased|generated|saved|reduced/i,
        score: 10,
        message: 'Uses strong action verbs'
      },
      {
        pattern: /\d+%/i,
        score: 15,
        message: 'Includes quantified results'
      },
      {
        pattern: /led|managed|supervised|coordinated/i,
        score: 8,
        message: 'Shows leadership experience'
      }
    ];
  }
}

// Singleton instance
export const contentIntelligence = new ContentIntelligenceEngine();

export type {
  ContentAnalysis,
  OptimizationSuggestion
};
