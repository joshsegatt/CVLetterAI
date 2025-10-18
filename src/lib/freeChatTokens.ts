/**
 * Free Chat Token Management
 * Manages token limits for unauthenticated users
 */

interface FreeChatSession {
  sessionId: string;
  tokensUsed: number;
  messagesCount: number;
  lastActivity: number;
  dailyReset: number;
}

// Global store for free sessions
declare global {
  var freeChatSessions: Map<string, FreeChatSession> | undefined;
}

export const FREE_CHAT_LIMITS = {
  dailyTokens: 5000, // 5k tokens per day for free users
  dailyMessages: 20, // 20 messages per day
  sessionTimeout: 3600000, // 1 hour session timeout
  maxConcurrentSessions: 100 // Max free sessions stored
};

export class FreeChatTokenManager {
  private static getStore(): Map<string, FreeChatSession> {
    if (!global.freeChatSessions) {
      global.freeChatSessions = new Map();
    }
    return global.freeChatSessions;
  }

  static generateSessionId(): string {
    return `free_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static getSession(sessionId: string): FreeChatSession | null {
    const store = this.getStore();
    const session = store.get(sessionId);
    
    if (!session) return null;
    
    // Check if session expired
    if (Date.now() - session.lastActivity > FREE_CHAT_LIMITS.sessionTimeout) {
      store.delete(sessionId);
      return null;
    }
    
    // Check if daily reset needed
    const now = new Date();
    const resetTime = new Date(session.dailyReset);
    
    if (now.getDate() !== resetTime.getDate() || 
        now.getMonth() !== resetTime.getMonth() || 
        now.getFullYear() !== resetTime.getFullYear()) {
      session.tokensUsed = 0;
      session.messagesCount = 0;
      session.dailyReset = Date.now();
    }
    
    return session;
  }

  static createSession(sessionId?: string): FreeChatSession {
    const store = this.getStore();
    
    // Clean old sessions if too many
    if (store.size >= FREE_CHAT_LIMITS.maxConcurrentSessions) {
      this.cleanOldSessions();
    }
    
    const newSessionId = sessionId || this.generateSessionId();
    const session: FreeChatSession = {
      sessionId: newSessionId,
      tokensUsed: 0,
      messagesCount: 0,
      lastActivity: Date.now(),
      dailyReset: Date.now()
    };
    
    store.set(newSessionId, session);
    return session;
  }

  static updateSession(sessionId: string, tokensUsed: number): void {
    const store = this.getStore();
    const session = store.get(sessionId);
    
    if (session) {
      session.tokensUsed += tokensUsed;
      session.messagesCount += 1;
      session.lastActivity = Date.now();
      store.set(sessionId, session);
    }
  }

  static canUseTokens(sessionId: string, requestedTokens: number): {
    allowed: boolean;
    remaining: { tokens: number; messages: number };
    session?: FreeChatSession;
  } {
    let session = this.getSession(sessionId);
    
    if (!session) {
      session = this.createSession(sessionId);
    }
    
    const tokensRemaining = FREE_CHAT_LIMITS.dailyTokens - session.tokensUsed;
    const messagesRemaining = FREE_CHAT_LIMITS.dailyMessages - session.messagesCount;
    
    const allowed = tokensRemaining >= requestedTokens && messagesRemaining > 0;
    
    return {
      allowed,
      remaining: {
        tokens: Math.max(0, tokensRemaining),
        messages: Math.max(0, messagesRemaining)
      },
      session
    };
  }

  static getUsageInfo(sessionId: string): {
    tokensUsed: number;
    messagesUsed: number;
    tokensRemaining: number;
    messagesRemaining: number;
    resetTime: string;
  } {
    const session = this.getSession(sessionId);
    
    if (!session) {
      return {
        tokensUsed: 0,
        messagesUsed: 0,
        tokensRemaining: FREE_CHAT_LIMITS.dailyTokens,
        messagesRemaining: FREE_CHAT_LIMITS.dailyMessages,
        resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
    }
    
    const tokensRemaining = Math.max(0, FREE_CHAT_LIMITS.dailyTokens - session.tokensUsed);
    const messagesRemaining = Math.max(0, FREE_CHAT_LIMITS.dailyMessages - session.messagesCount);
    
    // Calculate next reset time (next day at midnight)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    return {
      tokensUsed: session.tokensUsed,
      messagesUsed: session.messagesCount,
      tokensRemaining,
      messagesRemaining,
      resetTime: tomorrow.toISOString()
    };
  }

  private static cleanOldSessions(): void {
    const store = this.getStore();
    const cutoff = Date.now() - FREE_CHAT_LIMITS.sessionTimeout;
    
    for (const [sessionId, session] of store.entries()) {
      if (session.lastActivity < cutoff) {
        store.delete(sessionId);
      }
    }
  }

  static getStats(): {
    activeSessions: number;
    totalTokensUsed: number;
    totalMessages: number;
  } {
    const store = this.getStore();
    let totalTokens = 0;
    let totalMessages = 0;
    
    for (const session of store.values()) {
      totalTokens += session.tokensUsed;
      totalMessages += session.messagesCount;
    }
    
    return {
      activeSessions: store.size,
      totalTokensUsed: totalTokens,
      totalMessages
    };
  }
}

// Helper function to estimate tokens from text
export function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token for Portuguese/English
  return Math.ceil(text.length / 4);
}

// Response helper for free chat limits
export function createFreeUsageResponse(sessionId: string) {
  const usage = FreeChatTokenManager.getUsageInfo(sessionId);
  
  return {
    isFreeUser: true,
    usage,
    limits: FREE_CHAT_LIMITS,
    upgradeMessage: usage.messagesRemaining <= 3 ? 
      "Suas mensagens gratuitas estão acabando! Faça upgrade para Pro (£5.99) para chat ilimitado." :
      undefined
  };
}