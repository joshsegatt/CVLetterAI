import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

export interface ValidationRule {
  field: string;
  rules: Array<{
    type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
    value?: any;
    message: string;
    validator?: (value: any) => boolean;
  }>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
  sanitizedData: Record<string, any>;
}

// Padrões de validação para diferentes tipos de dados
const VALIDATION_PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/, // Mínimo 12 chars, maiúscula, minúscula, número, símbolo
  phone: /^\+?[1-9]\d{1,14}$/, // E.164 format
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  name: /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/,
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  url: /^https?:\/\/.+/,
  safeString: /^[a-zA-Z0-9\s\-_.,!?()]+$/, // String segura para conteúdo
} as const;

export class InputValidator {
  private rules: ValidationRule[] = [];
  private errors: Record<string, string[]> = {};
  private sanitizedData: Record<string, any> = {};

  constructor(rules: ValidationRule[]) {
    this.rules = rules;
  }

  validate(data: Record<string, any>): ValidationResult {
    this.errors = {};
    this.sanitizedData = {};

    for (const rule of this.rules) {
      const fieldErrors: string[] = [];
      const fieldValue = data[rule.field];

      // Sanitizar o valor primeiro
      this.sanitizedData[rule.field] = this.sanitizeValue(fieldValue, rule.field);

      for (const validation of rule.rules) {
        if (!this.validateRule(this.sanitizedData[rule.field], validation)) {
          fieldErrors.push(validation.message);
        }
      }

      if (fieldErrors.length > 0) {
        this.errors[rule.field] = fieldErrors;
      }
    }

    return {
      isValid: Object.keys(this.errors).length === 0,
      errors: this.errors,
      sanitizedData: this.sanitizedData
    };
  }

  private sanitizeValue(value: any, field: string): any {
    if (value === null || value === undefined) {
      return value;
    }

    if (typeof value === 'string') {
      // Remove caracteres de controle
      let sanitized = value.replace(/[\x00-\x1F\x7F]/g, '');
      
      // Trim espaços
      sanitized = sanitized.trim();
      
      // Para campos HTML, usar DOMPurify
      if (field.includes('content') || field.includes('description') || field.includes('bio')) {
        sanitized = DOMPurify.sanitize(sanitized, {
          ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
          ALLOWED_ATTR: []
        });
      }
      
      // Para outros campos de texto, escape HTML
      else {
        sanitized = validator.escape(sanitized);
      }
      
      return sanitized;
    }

    if (typeof value === 'number') {
      // Verificar se é um número válido
      if (isNaN(value) || !isFinite(value)) {
        return null;
      }
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item, index) => this.sanitizeValue(item, `${field}[${index}]`));
    }

    if (typeof value === 'object') {
      const sanitizedObject: Record<string, any> = {};
      for (const [key, val] of Object.entries(value)) {
        sanitizedObject[key] = this.sanitizeValue(val, `${field}.${key}`);
      }
      return sanitizedObject;
    }

    return value;
  }

  private validateRule(value: any, rule: any): boolean {
    switch (rule.type) {
      case 'required':
        return value !== null && value !== undefined && value !== '';

      case 'email':
        if (!value) return true; // Optional field
        return validator.isEmail(value) && VALIDATION_PATTERNS.email.test(value);

      case 'minLength':
        if (!value) return true;
        return typeof value === 'string' && value.length >= rule.value;

      case 'maxLength':
        if (!value) return true;
        return typeof value === 'string' && value.length <= rule.value;

      case 'pattern':
        if (!value) return true;
        return rule.value.test(value);

      case 'custom':
        if (!value) return true;
        return rule.validator ? rule.validator(value) : true;

      default:
        return true;
    }
  }
}

// Validadores específicos para diferentes contextos
export class UserDataValidator extends InputValidator {
  constructor() {
    super([
      {
        field: 'email',
        rules: [
          { type: 'required', message: 'Email é obrigatório' },
          { type: 'email', message: 'Email deve ter formato válido' },
          { type: 'maxLength', value: 255, message: 'Email muito longo' }
        ]
      },
      {
        field: 'password',
        rules: [
          { type: 'required', message: 'Senha é obrigatória' },
          { type: 'minLength', value: 12, message: 'Senha deve ter pelo menos 12 caracteres' },
          { type: 'pattern', value: VALIDATION_PATTERNS.password, message: 'Senha deve conter maiúscula, minúscula, número e símbolo especial' }
        ]
      },
      {
        field: 'name',
        rules: [
          { type: 'required', message: 'Nome é obrigatório' },
          { type: 'pattern', value: VALIDATION_PATTERNS.name, message: 'Nome deve conter apenas letras e espaços' },
          { type: 'minLength', value: 2, message: 'Nome muito curto' },
          { type: 'maxLength', value: 50, message: 'Nome muito longo' }
        ]
      }
    ]);
  }
}

export class CVDataValidator extends InputValidator {
  constructor() {
    super([
      {
        field: 'personalInfo.name',
        rules: [
          { type: 'required', message: 'Nome é obrigatório' },
          { type: 'pattern', value: VALIDATION_PATTERNS.name, message: 'Nome inválido' }
        ]
      },
      {
        field: 'personalInfo.email',
        rules: [
          { type: 'required', message: 'Email é obrigatório' },
          { type: 'email', message: 'Email inválido' }
        ]
      },
      {
        field: 'personalInfo.phone',
        rules: [
          { type: 'pattern', value: VALIDATION_PATTERNS.phone, message: 'Telefone inválido' }
        ]
      },
      {
        field: 'experiences',
        rules: [
          { 
            type: 'custom',
            message: 'Experiências devem ser um array válido',
            validator: (value) => Array.isArray(value) && value.length <= 20
          }
        ]
      }
    ]);
  }
}

export class APIDataValidator extends InputValidator {
  constructor() {
    super([
      {
        field: 'apiKey',
        rules: [
          { type: 'required', message: 'API Key é obrigatória' },
          { type: 'minLength', value: 32, message: 'API Key inválida' }
        ]
      }
    ]);
  }
}

// Função utilitária para validação rápida
export function quickValidate(
  data: Record<string, any>,
  validatorClass: typeof UserDataValidator | typeof CVDataValidator | typeof APIDataValidator
): ValidationResult {
  const validator = new validatorClass();
  return validator.validate(data);
}

// Middleware para validação em APIs
export function validationMiddleware(validatorClass: any) {
  return async (req: any, res: any, next: any) => {
    try {
      const validator = new validatorClass();
      const result = validator.validate(req.body);

      if (!result.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: result.errors
        });
      }

      // Substituir req.body pelos dados sanitizados
      req.body = result.sanitizedData;
      next();
    } catch (error) {
      console.error('Validation middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno de validação'
      });
    }
  };
}

// Função para detectar tentativas de injection
export function detectInjectionAttempts(input: string): boolean {
  const injectionPatterns = [
    // SQL Injection
    /union\s+select/i,
    /drop\s+table/i,
    /delete\s+from/i,
    /insert\s+into/i,
    /update\s+set/i,
    
    // XSS
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload\s*=/i,
    /onclick\s*=/i,
    
    // Command Injection
    /;\s*(rm|del|format)/i,
    /\|\s*(ls|dir|cat)/i,
    
    // Path Traversal
    /\.\.[\/\\]/,
    /%2e%2e/i
  ];

  return injectionPatterns.some(pattern => pattern.test(input));
}

// Sanitizador avançado para conteúdo HTML
export function sanitizeHTML(html: string, allowedTags?: string[]): string {
  const defaultTags = ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: allowedTags || defaultTags,
    ALLOWED_ATTR: ['href', 'target'],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'iframe'],
    FORBID_ATTR: ['style', 'on*']
  });
}
