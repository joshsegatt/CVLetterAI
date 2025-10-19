import type { ChatCompletionMessage } from './types';
import { SuperIntelligentAI } from './super-intelligent-ai';
import { userPlanManager } from '../auth/userPlans';
import { freeAIService } from './free-ai-service-v2';
import { hybridAIService } from './hybrid-ai-service';

interface StreamOptions {
  locale?: string;
  useSimple?: boolean;
  sessionId?: string;
  userId?: string;
}

export async function* streamChatCompletion(
  history: ChatCompletionMessage[],
  options: StreamOptions = {}
) {
  // Get the last user message
  const lastMessage = history[history.length - 1]?.content ?? '';
  const userId = options.userId ?? 'anonymous';
  
  try {
    // Check available tokens
    const tokenCheck = userPlanManager.canUseAIChat(userId, 150); // Estimate 150 tokens
    
    if (!tokenCheck.canUse && tokenCheck.dailyLimit !== -1) {
      yield generateTokenLimitMessage(tokenCheck, options.locale);
      return;
    }
    
    // Get quality based on user plan
    const aiQuality = userPlanManager.getAIChatQuality(userId);
    
    // Use hybrid system (local + web search when necessary)
    const aiResponse = await hybridAIService.generateResponse(
      lastMessage,
      history.slice(-10).map(msg => ({ role: msg.role, content: msg.content })),
      userId
    );
    
    // Consume tokens if limited plan
    if (tokenCheck.dailyLimit !== -1) {
      userPlanManager.consumeTokens(userId, aiResponse.tokensUsed);
    }

    // Stream the response
    const response = aiResponse.content;
    const chunks = response.split(' ');
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i] + (i < chunks.length - 1 ? ' ' : '');
      yield chunk;
      
      // Pause based on quality (premium is faster)
      const delay = aiQuality === 'basic' ? 50 : aiQuality === 'premium' ? 30 : 20;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Add information about model and mode used
    if (aiQuality !== 'basic') {
      const modeIcon = aiResponse.mode === 'offline' ? '🧠' : aiResponse.mode === 'hybrid' ? '🌐' : '🔍';
      yield `\n\n_${modeIcon} ${aiResponse.model} (${aiResponse.mode})_`;
    }
    
    // Show token usage for limited plans
    if (tokenCheck.dailyLimit !== -1) {
      const usage = userPlanManager.getTokenUsageStats(userId);
      yield `\n\n📊 **Tokens:** ${usage.todayUsed}/${usage.dailyLimit} used today`;
      
      if (usage.percentUsed >= 80) {
        yield `\n⚠️ You've used ${usage.percentUsed}% of your daily tokens. [Upgrade to Pro →](/pricing)`;
      }
    }

  } catch (error) {
    console.error('AI Service Error:', error);
    
    // Fallback to local response
    yield generateLocalFallbackResponse(lastMessage, options.locale, userId);
  }
}

/**
 * Generate message when user hits token limit
 */
function generateTokenLimitMessage(tokenCheck: { dailyLimit: number; remainingTokens: number }, locale?: string): string {
  const isPortuguese = locale === 'pt' || locale === 'pt-BR';
  
  if (isPortuguese) {
    return `🔒 **Limite de Tokens Atingido**\n\n` +
           `Você usou todos os seus ${tokenCheck.dailyLimit} tokens diários gratuitos.\n\n` +
           `🚀 **Upgrade para Pro (£5.99 uma vez):**\n` +
           `• ✨ Tokens ilimitados\n` +
           `• 🧠 AI de qualidade premium\n` +
           `• 🌍 Suporte multilíngue\n` +
           `• 📊 Respostas mais precisas\n\n` +
           `[Upgrade agora →](/pricing?highlight=pro)\n\n` +
           `Os tokens são resetados amanhã às 00:00 GMT. Volte depois! ⏰`;
  } else {
    return `🔒 **Daily Token Limit Reached**\n\n` +
           `You've used all your ${tokenCheck.dailyLimit} free daily tokens.\n\n` +
           `🚀 **Upgrade to Pro (£5.99 one-time):**\n` +
           `• ✨ Unlimited tokens\n` +
           `• 🧠 Premium AI quality\n` +
           `• 🌍 Multi-language support\n` +
           `• 📊 More accurate responses\n\n` +
           `[Upgrade now →](/pricing?highlight=pro)\n\n` +
           `Tokens reset tomorrow at 00:00 GMT. Come back later! ⏰`;
  }
}

/**
 * Resposta de fallback local caso o sistema super inteligente falhe
 */
function generateLocalFallbackResponse(message: string, locale?: string, userId?: string): string {
  const isPortuguese = locale === 'pt' || /[áàâãéèêíìîóòôõúùû]/.test(message);
  
  if (isPortuguese) {
    return `🤖 **CVLetterAI - Super AI Ativo**\n\n` +
           `Oi! Sou sua assistente super inteligente para CV e carreira!\n\n` +
           `🚀 **Posso ajudar com:**\n` +
           `• CVs profissionais e modernos\n` +
           `• Cover letters eficazes\n` +
           `• Estratégias de carreira\n` +
           `• Preparação para entrevistas\n` +
           `• Análise de mercado de trabalho\n\n` +
           `� **Converso naturalmente em qualquer idioma!**\n` +
           `Pode me perguntar qualquer coisa sobre sua carreira. Como posso ajudar? ✨`;
  } else {
    return `🤖 **CVLetterAI - Super AI Active**\n\n` +
           `Hi! I'm your super intelligent assistant for CV and career development!\n\n` +
           `� **I can help with:**\n` +
           `• Professional and modern CVs\n` +
           `• Effective cover letters\n` +
           `• Career strategies\n` +
           `• Interview preparation\n` +
           `• Job market analysis\n\n` +
           `💬 **I speak naturally in any language!**\n` +
           `Ask me anything about your career. How can I help you? ✨`;
  }
}
