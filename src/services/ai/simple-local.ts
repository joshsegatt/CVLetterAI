// AI Local Simples - Roda direto no Next.js
// Sem dependências externas - 100% local

export interface LocalAIResponse {
  content: string;
  suggestions?: string[];
  type: 'cv' | 'letter' | 'general' | 'tips';
}

export class SimpleLocalAI {
  
  // Keywords para detectar tipo de pergunta
  private cvKeywords = ['cv', 'resume', 'curriculum', 'vitae', 'job', 'work', 'experience', 'skills', 'qualifications'];
  private letterKeywords = ['letter', 'cover', 'application', 'landlord', 'tenant', 'notice', 'reference'];
  private ukKeywords = ['uk', 'british', 'britain', 'england', 'london', 'scotland', 'wales'];

  // Templates de CV
  private cvTemplates = {
    summary: [
      "Experienced professional with {years} years in {industry}. Proven track record in {skills} with focus on {achievements}.",
      "Dynamic {role} with expertise in {specialty}. Strong background in {experience} and passion for {interests}.",
      "Results-driven professional specializing in {field}. Demonstrated success in {accomplishments} and {growth}."
    ],
    skills: [
      "• {technical_skills}\n• {soft_skills}\n• {industry_skills}\n• {certifications}",
      "Technical: {tech}\nManagement: {management}\nCommunication: {communication}"
    ],
    experience: [
      "**{position}** at {company} ({dates})\n• {achievement1}\n• {achievement2}\n• {achievement3}",
      "**{role}** - {organization}\n{period}\n- {responsibility1}\n- {responsibility2}\n- {result}"
    ]
  };

  // Templates de Letter
  private letterTemplates = {
    formal: [
      "Dear {recipient},\n\nI am writing to {purpose}. {main_content}\n\nI would appreciate your {request}.\n\nYours sincerely,\n{sender}",
      "Dear Sir/Madam,\n\nRe: {subject}\n\n{opening}. {body}.\n\n{closing}.\n\nKind regards,\n{name}"
    ],
    landlord: [
      "Dear {landlord_name},\n\nI am writing regarding {property_address}. {issue_description}\n\nI would be grateful if you could {requested_action}.\n\nThank you for your attention to this matter.\n\nYours faithfully,\n{tenant_name}"
    ]
  };

  // Tips e sugestões
  private ukTips = {
    cv: [
      "UK CVs should be 2 pages maximum",
      "Include a personal statement at the top", 
      "Use British English spelling (e.g., 'organised' not 'organized')",
      "Don't include photo unless specifically requested",
      "Focus on achievements with quantifiable results"
    ],
    letter: [
      "Use formal British English",
      "Include proper addressing format",
      "Reference relevant UK legislation when appropriate",
      "Keep tone professional but courteous",
      "Include clear subject line for formal letters"
    ]
  };

  // Detectar tipo de pergunta
  private detectQueryType(message: string): 'cv' | 'letter' | 'general' {
    const lowerMessage = message.toLowerCase();
    
    if (this.cvKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'cv';
    }
    
    if (this.letterKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'letter';
    }
    
    return 'general';
  }

  // Extrair contexto da mensagem
  private extractContext(message: string) {
    const context = {
      industry: '',
      role: '',
      experience: '',
      skills: [],
      uk: false
    };

    const lowerMessage = message.toLowerCase();
    
    // Detectar se é contexto UK
    context.uk = this.ukKeywords.some(keyword => lowerMessage.includes(keyword));
    
    // Extrair indústria/área
    const industries = ['tech', 'finance', 'healthcare', 'education', 'marketing', 'sales', 'engineering', 'design'];
    context.industry = industries.find(ind => lowerMessage.includes(ind)) ?? '';
    
    // Extrair role
    const roles = ['manager', 'developer', 'analyst', 'consultant', 'specialist', 'coordinator', 'assistant'];
    context.role = roles.find(role => lowerMessage.includes(role)) ?? '';
    
    return context;
  }

  // Gerar resposta para CV
  private generateCVResponse(message: string, context: any): LocalAIResponse {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('summary') ?? lowerMessage.includes('personal statement')) {
      return {
        content: `**Professional Summary Tips:**

Para um CV profissional no Reino Unido, sua personal statement deve:

• **Ser concisa**: 3-4 linhas máximo
• **Destacar experiência**: Mencione anos de experiência
• **Incluir skills-chave**: Suas principais competências
• **Mostrar valor**: O que você traz para a empresa

**Exemplo:**
"Experienced ${context.role ?? 'professional'} with 5+ years in ${context.industry ?? 'the industry'}. Proven track record in project management and team leadership. Strong analytical skills with focus on delivering results and driving business growth."`,
        suggestions: [
          "Como quantificar minhas conquistas?",
          "Qual a diferença entre CV UK e outros países?", 
          "Como adaptar meu CV para diferentes vagas?"
        ],
        type: 'cv'
      };
    }

    if (lowerMessage.includes('skills') ?? lowerMessage.includes('competências')) {
      return {
        content: `**Como Organizar Skills no CV:**

**1. Technical Skills:**
• Software/ferramentas específicas
• Linguagens de programação
• Certificações técnicas

**2. Soft Skills:**
• Liderança e gestão de equipe
• Comunicação e apresentação
• Resolução de problemas

**3. Industry-Specific:**
• Conhecimentos específicos da área
• Regulamentações relevantes
• Processos e metodologias

💡 **Dica UK**: Use bullet points e seja específico sobre nível de proficiência.`,
        suggestions: [
          "Como demonstrar soft skills?",
          "Devo incluir todas as minhas skills?",
          "Como ordenar skills por importância?"
        ],
        type: 'cv'
      };
    }

    // Resposta geral sobre CV
    return {
      content: `**Criando um CV Profissional UK:**

✅ **Estrutura Recomendada:**
• Personal Details (nome, contato)
• Professional Summary (3-4 linhas)
• Key Skills (bullet points)
• Professional Experience (cronológica reversa)
• Education & Qualifications
• Additional Information (se relevante)

✅ **Boas Práticas UK:**
• Máximo 2 páginas
• Sem foto (a menos que solicitado)
• Inglês britânico
• Foco em conquistas quantificáveis
• Formato limpo e profissional`,
      suggestions: [
        "Como escrever uma boa summary?",
        "Como destacar minhas conquistas?",
        "Preciso adaptar meu CV para cada vaga?"
      ],
      type: 'cv'
    };
  }

  // Gerar resposta para Letter
  private generateLetterResponse(message: string, context: any): LocalAIResponse {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('cover letter') ?? lowerMessage.includes('application')) {
      return {
        content: `**Cover Letter Profissional UK:**

**Estrutura Essencial:**

**1. Header:**
\`\`\`
Seu Nome
Endereço
Email | Telefone

[Data]

[Nome do Hiring Manager]
[Empresa]
[Endereço]
\`\`\`

**2. Abertura:**
"Dear [Nome específico]," (evite "To Whom It May Concern")

**3. Corpo (3 parágrafos):**
• Por que você está aplicando
• Por que você é o candidato ideal
• Como você pode agregar valor

**4. Fechamento:**
"Yours sincerely," (se conhece o nome) ou "Yours faithfully,"`,
        suggestions: [
          "Como personalizar para cada vaga?",
          "O que NÃO incluir em cover letter?",
          "Como mostrar entusiasmo sem exagerar?"
        ],
        type: 'letter'
      };
    }

    if (lowerMessage.includes('landlord') ?? lowerMessage.includes('tenant')) {
      return {
        content: `**Letter para Landlord/Property:**

**Template Formal UK:**

\`\`\`
[Seu endereço]
[Data]

Dear [Landlord name],

Re: [Propriedade endereço]

I am writing to [razão do contato]. [Detalhe a situação claramente].

[Se aplicável: Under the terms of our tenancy agreement / UK housing regulations...]

I would be grateful if you could [ação solicitada] by [prazo se aplicável].

Thank you for your prompt attention to this matter.

Yours sincerely,
[Seu nome]
[Assinatura]
\`\`\`

💡 **Dica Legal UK**: Mantenha registros de toda correspondência.`,
        suggestions: [
          "Como reportar problemas de manutenção?",
          "Como solicitar devolução de depósito?",
          "Quais são meus direitos como tenant?"
        ],
        type: 'letter'
      };
    }

    // Resposta geral sobre letters
    return {
      content: `**Writing Professional Letters UK:**

**Elementos Essenciais:**

✅ **Formato Britânico:**
• Data no formato DD/MM/YYYY
• Endereço completo no topo
• Saudação formal apropriada
• Linguagem cortês mas direta

✅ **Tipos Comuns:**
• Cover Letters (aplicações)
• Landlord Communications
• Formal Complaints
• Reference Requests
• Notice Letters

✅ **Tom Apropriado:**
• Professional mas humano
• Claro e conciso
• Respeitoso sempre`,
      suggestions: [
        "Como escrever cover letter?",
        "Como me comunicar com landlord?",
        "Qual tom usar em letter formal?"
      ],
      type: 'letter'
    };
  }

  // Método principal - processar pergunta
  public processQuery(message: string): LocalAIResponse {
    const queryType = this.detectQueryType(message);
    const context = this.extractContext(message);
    
    switch (queryType) {
      case 'cv':
        return this.generateCVResponse(message, context);
      
      case 'letter':
        return this.generateLetterResponse(message, context);
      
      default:
        return {
          content: `**CVLetterAI - Como posso ajudar?**

Sou especializado em criar documentos profissionais para o mercado UK:

🎯 **Para CV/Resume:**
• "Como escrever um professional summary?"
• "Como organizar minhas skills?"
• "Qual formato usar para CV UK?"

📝 **Para Letters:**
• "Como escrever cover letter?"
• "Como me comunicar com landlord?"
• "Preciso de template para formal letter"

💡 **Exemplos de perguntas:**
• "Ajuda com CV para tech industry"
• "Template para landlord letter"
• "Cover letter para finance job"

Faça uma pergunta específica e eu te ajudo! 🚀`,
          suggestions: [
            "Como escrever CV profissional?",
            "Preciso de cover letter template",
            "Como me comunicar com landlord?"
          ],
          type: 'general'
        };
    }
  }

  // Gerar sugestões baseadas no contexto
  public getSuggestions(queryType: 'cv' | 'letter' | 'general'): string[] {
    const suggestions = {
      cv: [
        "Como quantificar conquistas no CV?",
        "Qual a melhor estrutura para CV UK?",
        "Como adaptar CV para diferentes vagas?",
        "Devo incluir foto no CV UK?"
      ],
      letter: [
        "Template para cover letter",
        "Como escrever para landlord?", 
        "Formato correto para letter UK",
        "Como solicitar referência?"
      ],
      general: [
        "Diferenças entre CV UK e outros países",
        "Melhores práticas para job application",
        "Como me destacar no mercado UK"
      ]
    };

    return suggestions[queryType] ?? suggestions.general;
  }
}
