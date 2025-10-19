/**
 * User Plans & Subscription Management
 * Manages user access levels and plan verification
 */

export interface UserPlan {
  userId: string;
  planType: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'expired' | 'canceled';
  purchaseDate: Date;
  expiryDate?: Date; // For enterprise monthly subscription
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  features: PlanFeatures;
}

export interface PlanFeatures {
  // Core features
  cvCreationLimit: number; // -1 for unlimited
  coverLetterLimit: number; // -1 for unlimited
  templatesAccess: 'basic' | 'premium' | 'all';
  
  // AI Chat features
  aiChatAccess: boolean;
  aiChatTokensPerDay: number; // Daily token limit for AI chat
  aiChatQuality: 'basic' | 'premium' | 'enterprise'; // AI model quality level
  
  // AI features
  aiOptimization: boolean;
  superAiChat: boolean;
  multiLanguageSupport: boolean;
  
  // Advanced features
  pdfAnalysis: boolean;
  atsOptimization: boolean;
  prioritySupport: boolean;
  
  // Enterprise features
  teamManagement: boolean;
  customTemplates: boolean;
  apiAccess: boolean;
  analytics: boolean;
  whiteLabel: boolean;
  dedicatedSupport: boolean;
  ssoIntegration: boolean;
  bulkProcessing: boolean;
}

/**
 * Plan configurations with features
 */
export const PLAN_CONFIGS: Record<UserPlan['planType'], PlanFeatures> = {
  free: {
    cvCreationLimit: 1,
    coverLetterLimit: 0,
    templatesAccess: 'basic',
    aiChatAccess: true,
    aiChatTokensPerDay: 1000, // Limited tokens per day for free users
    aiChatQuality: 'basic',
    aiOptimization: false,
    superAiChat: false,
    multiLanguageSupport: false,
    pdfAnalysis: false,
    atsOptimization: false,
    prioritySupport: false,
    teamManagement: false,
    customTemplates: false,
    apiAccess: false,
    analytics: false,
    whiteLabel: false,
    dedicatedSupport: false,
    ssoIntegration: false,
    bulkProcessing: false
  },
  
  pro: {
    cvCreationLimit: -1, // Unlimited
    coverLetterLimit: -1, // Unlimited
    templatesAccess: 'premium',
    aiChatAccess: true,
    aiChatTokensPerDay: -1, // Unlimited tokens for Pro users
    aiChatQuality: 'premium',
    aiOptimization: true,
    superAiChat: true,
    multiLanguageSupport: true,
    pdfAnalysis: true,
    atsOptimization: true,
    prioritySupport: true,
    teamManagement: false,
    customTemplates: false,
    apiAccess: false,
    analytics: false,
    whiteLabel: false,
    dedicatedSupport: false,
    ssoIntegration: false,
    bulkProcessing: false
  },
  
  enterprise: {
    cvCreationLimit: -1, // Unlimited
    coverLetterLimit: -1, // Unlimited
    templatesAccess: 'all',
    aiChatAccess: true,
    aiChatTokensPerDay: -1, // Unlimited tokens for Enterprise users
    aiChatQuality: 'enterprise',
    aiOptimization: true,
    superAiChat: true,
    multiLanguageSupport: true,
    pdfAnalysis: true,
    atsOptimization: true,
    prioritySupport: true,
    teamManagement: true,
    customTemplates: true,
    apiAccess: true,
    analytics: true,
    whiteLabel: true,
    dedicatedSupport: true,
    ssoIntegration: true,
    bulkProcessing: true
  }
};

/**
 * Token usage tracking
 */
export interface TokenUsage {
  userId: string;
  date: string; // YYYY-MM-DD
  tokensUsed: number;
  dailyLimit: number;
}

/**
 * In-memory storage for user plans (in production, use database)
 */
class UserPlanManager {
  private plans = new Map<string, UserPlan>();
  private tokenUsage = new Map<string, TokenUsage>();
  
  /**
   * Get user plan by userId
   */
  getUserPlan(userId: string): UserPlan {
    const existingPlan = this.plans.get(userId);
    if (existingPlan) {
      return existingPlan;
    }
    
    // Default to free plan if no plan exists
    const freePlan: UserPlan = {
      userId,
      planType: 'free',
      status: 'active',
      purchaseDate: new Date(),
      features: PLAN_CONFIGS.free
    };
    
    this.plans.set(userId, freePlan);
    return freePlan;
  }
  
  /**
   * Upgrade user to Pro plan (one-time payment)
   */
  upgradeToPro(userId: string, stripeCustomerId?: string): UserPlan {
    const proPlan: UserPlan = {
      userId,
      planType: 'pro',
      status: 'active',
      purchaseDate: new Date(),
      stripeCustomerId,
      features: PLAN_CONFIGS.pro
    };
    
    this.plans.set(userId, proPlan);
    return proPlan;
  }
  
  /**
   * Upgrade user to Enterprise plan (monthly subscription)
   */
  upgradeToEnterprise(userId: string, stripeCustomerId?: string, stripeSubscriptionId?: string): UserPlan {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1); // Monthly subscription
    
    const enterprisePlan: UserPlan = {
      userId,
      planType: 'enterprise',
      status: 'active',
      purchaseDate: new Date(),
      expiryDate,
      stripeCustomerId,
      stripeSubscriptionId,
      features: PLAN_CONFIGS.enterprise
    };
    
    this.plans.set(userId, enterprisePlan);
    return enterprisePlan;
  }
  
  /**
   * Check if user has access to a specific feature
   */
  hasFeatureAccess(userId: string, feature: keyof PlanFeatures): boolean {
    const plan = this.getUserPlan(userId);
    
    // Check if plan is still active
    if (plan.status !== 'active') {
      return PLAN_CONFIGS.free[feature] as boolean;
    }
    
    // Check expiry for enterprise subscriptions
    if (plan.planType === 'enterprise' && plan.expiryDate && plan.expiryDate < new Date()) {
      // Expired enterprise plan, downgrade to free
      plan.status = 'expired';
      plan.planType = 'free';
      plan.features = PLAN_CONFIGS.free;
      this.plans.set(userId, plan);
      return PLAN_CONFIGS.free[feature] as boolean;
    }
    
    return plan.features[feature] as boolean;
  }
  
  /**
   * Get usage limits for user
   */
  getUsageLimits(userId: string): { cvLimit: number; letterLimit: number } {
    const plan = this.getUserPlan(userId);
    return {
      cvLimit: plan.features.cvCreationLimit,
      letterLimit: plan.features.coverLetterLimit
    };
  }
  
  /**
   * Check if user can create more CVs
   */
  canCreateCV(userId: string, currentCount: number): boolean {
    const limits = this.getUsageLimits(userId);
    return limits.cvLimit === -1 || currentCount < limits.cvLimit;
  }
  
  /**
   * Check if user can create more cover letters
   */
  canCreateCoverLetter(userId: string, currentCount: number): boolean {
    const limits = this.getUsageLimits(userId);
    return limits.letterLimit === -1 || currentCount < limits.letterLimit;
  }
  
  /**
   * Get available templates based on user plan
   */
  getAvailableTemplates(userId: string): string[] {
    const plan = this.getUserPlan(userId);
    const access = plan.features.templatesAccess;
    
    switch (access) {
      case 'basic':
        return ['modern', 'clean'];
      case 'premium':
        return ['modern', 'clean', 'executive', 'linkedin', 'elegant', 'minimalist'];
      case 'all':
        return ['modern', 'clean', 'executive', 'linkedin', 'elegant', 'minimalist', 'custom', 'company-branded'];
      default:
        return ['modern'];
    }
  }
  
  /**
   * Process Stripe webhook to update user plan
   */
  processStripeWebhook(event: any): void {
    switch (event.type) {
      case 'checkout.session.completed':
        this.handleCheckoutCompleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        this.handlePaymentSucceeded(event.data.object);
        break;
      case 'customer.subscription.deleted':
        this.handleSubscriptionCanceled(event.data.object);
        break;
    }
  }
  
  private handleCheckoutCompleted(session: any): void {
    const userId = session.client_reference_id || session.customer_email;
    const planId = session.metadata?.product;
    
    if (!userId || !planId) return;
    
    if (planId === 'price_one_time') {
      this.upgradeToPro(userId, session.customer);
    } else if (planId === 'price_subscription') {
      this.upgradeToEnterprise(userId, session.customer, session.subscription);
    }
  }
  
  private handlePaymentSucceeded(invoice: any): void {
    // Handle recurring payments for enterprise plan
    if (invoice.subscription) {
      const userId = invoice.customer_email;
      if (userId) {
        const plan = this.getUserPlan(userId);
        if (plan.planType === 'enterprise') {
          // Extend expiry date by one month
          const expiryDate = new Date();
          expiryDate.setMonth(expiryDate.getMonth() + 1);
          plan.expiryDate = expiryDate;
          plan.status = 'active';
          this.plans.set(userId, plan);
        }
      }
    }
  }
  
  private handleSubscriptionCanceled(subscription: any): void {
    // Find user by subscription ID and cancel their plan
    for (const [userId, plan] of this.plans) {
      if (plan.stripeSubscriptionId === subscription.id) {
        plan.status = 'canceled';
        this.plans.set(userId, plan);
        break;
      }
    }
  }
  
  /**
   * Check if user can use AI chat (has tokens left)
   */
  canUseAIChat(userId: string, estimatedTokens: number = 100): { canUse: boolean; remainingTokens: number; dailyLimit: number } {
    const plan = this.getUserPlan(userId);
    if (!plan.features.aiChatAccess) {
      return { canUse: false, remainingTokens: 0, dailyLimit: 0 };
    }
    
    const dailyLimit = plan.features.aiChatTokensPerDay;
    if (dailyLimit === -1) {
      // Unlimited for Pro/Enterprise
      return { canUse: true, remainingTokens: -1, dailyLimit: -1 };
    }
    
    const today = new Date().toISOString().split('T')[0];
    const usageKey = `${userId}-${today}`;
    const usage = this.tokenUsage.get(usageKey) || {
      userId,
      date: today,
      tokensUsed: 0,
      dailyLimit
    };
    
    const remainingTokens = dailyLimit - usage.tokensUsed;
    const canUse = remainingTokens >= estimatedTokens;
    
    return { canUse, remainingTokens: Math.max(0, remainingTokens), dailyLimit };
  }
  
  /**
   * Consume tokens for AI chat usage
   */
  consumeTokens(userId: string, tokensUsed: number): boolean {
    const check = this.canUseAIChat(userId, tokensUsed);
    if (!check.canUse && check.dailyLimit !== -1) {
      return false;
    }
    
    const plan = this.getUserPlan(userId);
    if (plan.features.aiChatTokensPerDay === -1) {
      // Unlimited plan, no need to track
      return true;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const usageKey = `${userId}-${today}`;
    const usage = this.tokenUsage.get(usageKey) || {
      userId,
      date: today,
      tokensUsed: 0,
      dailyLimit: plan.features.aiChatTokensPerDay
    };
    
    usage.tokensUsed += tokensUsed;
    this.tokenUsage.set(usageKey, usage);
    
    return true;
  }
  
  /**
   * Get AI model quality level for user
   */
  getAIChatQuality(userId: string): 'basic' | 'premium' | 'enterprise' {
    const plan = this.getUserPlan(userId);
    return plan.features.aiChatQuality;
  }
  
  /**
   * Reset daily token usage (should be called daily via cron job)
   */
  resetDailyTokens(): void {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // Remove old usage records
    for (const [key, usage] of this.tokenUsage) {
      if (usage.date <= yesterdayStr) {
        this.tokenUsage.delete(key);
      }
    }
  }
  
  /**
   * Get user token usage statistics
   */
  getTokenUsageStats(userId: string): { todayUsed: number; dailyLimit: number; percentUsed: number } {
    const plan = this.getUserPlan(userId);
    const dailyLimit = plan.features.aiChatTokensPerDay;
    
    if (dailyLimit === -1) {
      return { todayUsed: 0, dailyLimit: -1, percentUsed: 0 };
    }
    
    const today = new Date().toISOString().split('T')[0];
    const usageKey = `${userId}-${today}`;
    const usage = this.tokenUsage.get(usageKey);
    const todayUsed = usage?.tokensUsed || 0;
    const percentUsed = Math.round((todayUsed / dailyLimit) * 100);
    
    return { todayUsed, dailyLimit, percentUsed };
  }

  /**
   * Get plan statistics for admin dashboard
   */
  getPlanStats(): { free: number; pro: number; enterprise: number; total: number } {
    let free = 0, pro = 0, enterprise = 0;
    
    for (const plan of this.plans.values()) {
      if (plan.status === 'active') {
        switch (plan.planType) {
          case 'free': free++; break;
          case 'pro': pro++; break;
          case 'enterprise': enterprise++; break;
        }
      }
    }
    
    return { free, pro, enterprise, total: free + pro + enterprise };
  }
}

export const userPlanManager = new UserPlanManager();

/**
 * Utility functions for checking access
 */
export const PlanUtils = {
  hasProAccess: (userId: string) => {
    const plan = userPlanManager.getUserPlan(userId);
    return ['pro', 'enterprise'].includes(plan.planType) && plan.status === 'active';
  },
  
  hasEnterpriseAccess: (userId: string) => {
    const plan = userPlanManager.getUserPlan(userId);
    return plan.planType === 'enterprise' && plan.status === 'active';
  },
  
  canUseSuperAI: (userId: string) => {
    return userPlanManager.hasFeatureAccess(userId, 'superAiChat');
  },
  
  canUseAIOptimization: (userId: string) => {
    return userPlanManager.hasFeatureAccess(userId, 'aiOptimization');
  },
  
  canUsePremiumTemplates: (userId: string) => {
    const plan = userPlanManager.getUserPlan(userId);
    return ['premium', 'all'].includes(plan.features.templatesAccess);
  },
  
  getPlanDisplayName: (userId: string) => {
    const plan = userPlanManager.getUserPlan(userId);
    return plan.planType.charAt(0).toUpperCase() + plan.planType.slice(1);
  }
};
