export type Language = 'en' | 'pt' | 'es' | 'fr' | 'de' | 'it';

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export interface TranslationKeys {
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    edit: string;
    create: string;
    back: string;
    next: string;
    previous: string;
    download: string;
    upload: string;
    search: string;
    filter: string;
    sort: string;
    language: string;
    theme: string;
    settings: string;
    or: string;
  };

  // Navigation
  nav: {
    home: string;
    dashboard: string;
    cvBuilder: string;
    letterBuilder: string;
    pricing: string;
    security: string;
    signIn: string;
    signUp: string;
    signOut: string;
    profile: string;
    overview: string;
    chat: string;
    cvAnalysis: string;
    coverLetters: string;
    getStarted: string;
    features: string;
    learnMore: string;
    tryNow: string;
  };

  // Home/Marketing
  home: {
    title: string;
    subtitle: string;
    hero: string;
    getStarted: string;
    learnMore: string;
    features: {
      title: string;
      cvBuilder: {
        title: string;
        description: string;
      };
      letterBuilder: {
        title: string;
        description: string;
      };
      aiPowered: {
        title: string;
        description: string;
      };
    };
  };

  // CV Builder
  cvBuilder: {
    title: string;
    subtitle: string;
    templates: {
      title: string;
      selectTemplate: string;
      preview: string;
      customize: string;
    };
    sections: {
      personalInfo: string;
      experience: string;
      education: string;
      skills: string;
      languages: string;
      certifications: string;
    };
    placeholders: {
      fullName: string;
      email: string;
      phone: string;
      address: string;
      jobTitle: string;
      company: string;
      description: string;
    };
  };

  // Letter Builder
  letterBuilder: {
    title: string;
    subtitle: string;
    templates: {
      title: string;
      selectTemplate: string;
      preview: string;
      customize: string;
    };
    types: {
      coverLetter: string;
      businessLetter: string;
      recommendation: string;
      resignation: string;
    };
  };

  // Chat AI
  chat: {
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    clear: string;
    language: string;
    selectLanguage: string;
    thinking: string;
    examples: {
      cv: string;
      letter: string;
      tips: string;
      review: string;
    };
    messages: {
      welcome: string;
      error: string;
      thinking: string;
    };
  };

  // Pricing
  pricing: {
    title: string;
    subtitle: string;
    monthly: string;
    annually: string;
    free: {
      name: string;
      price: string;
      features: string[];
    };
    pro: {
      name: string;
      price: string;
      features: string[];
    };
    enterprise: {
      name: string;
      price: string;
      features: string[];
    };
  };

  // Security
  security: {
    title: string;
    subtitle: string;
    features: {
      encryption: string;
      privacy: string;
      compliance: string;
      audit: string;
    };
  };

  // Auth
  auth: {
    welcomeBack: string;
    signInToAccess: string;
    continueWithGoogle: string;
    signInWithEmail: string;
    tryAIChatGuest: string;
    email: string;
    password: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    signIn: string;
    signUp: string;
    backToOptions: string;
    noAccount: string;
    createOne: string;
    googleSignInError: string;
    unexpectedGoogleError: string;
    invalidCredentials: string;
    signInError: string;
    signInDescription: string;
    signUpDescription: string;
    firstName: string;
    lastName: string;
    confirmPassword: string;
    terms: string;
    hasAccount: string;
    rememberMe: string;
    forgotPassword: string;
  };

  // Dashboard
  dashboard: {
    welcome: string;
    overview: {
      title: string;
      stats: {
        cvs: string;
        letters: string;
        downloads: string;
        views: string;
      };
    };
    recent: {
      title: string;
      empty: string;
    };
    quickActions: {
      title: string;
      createCV: string;
      createLetter: string;
      chatAI: string;
      viewTemplates: string;
    };
  };

  // Settings
  settings: {
    title: string;
    profile: {
      title: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      address: string;
    };
    preferences: {
      title: string;
      language: string;
      theme: string;
      notifications: string;
    };
    security: {
      title: string;
      changePassword: string;
      twoFactor: string;
      sessions: string;
    };
  };

  // Errors
  errors: {
    notFound: string;
    serverError: string;
    unauthorized: string;
    forbidden: string;
    validation: string;
    network: string;
  };
}
