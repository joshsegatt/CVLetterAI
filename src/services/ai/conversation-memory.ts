import { CVData, LetterData } from '../../types/builder';

export interface ConversationMemory {
  sessionId: string;
  userId: string;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  extractedData: {
    cv?: Partial<CVData>;
    letter?: Partial<LetterData>;
    preferences?: {
      industry?: string;
      position?: string;
      experience_level?: string;
      template_preference?: string;
    };
  };
  lastUpdated: Date;
  status: 'active' | 'completed' | 'pdf_generated';
}

class ConversationMemoryService {
  private sessions = new Map<string, ConversationMemory>();

  createSession(userId: string): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.sessions.set(sessionId, {
      sessionId,
      userId,
      messages: [],
      extractedData: {},
      lastUpdated: new Date(),
      status: 'active'
    });

    return sessionId;
  }

  getSession(sessionId: string): ConversationMemory | undefined {
    return this.sessions.get(sessionId);
  }

  addMessage(sessionId: string, role: 'user' | 'assistant', content: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.messages.push({
      id: `msg_${Date.now()}`,
      role,
      content,
      timestamp: new Date()
    });

    session.lastUpdated = new Date();
    this.sessions.set(sessionId, session);
  }

  updateExtractedData(sessionId: string, data: Partial<ConversationMemory['extractedData']>): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.extractedData = {
      ...session.extractedData,
      ...data
    };

    session.lastUpdated = new Date();
    this.sessions.set(sessionId, session);
  }

  extractUserDataFromMessage(message: string): {
    cv?: Partial<CVData>;
    letter?: Partial<LetterData>;
    preferences?: any;
  } {
    const extracted: any = {
      cv: {},
      letter: {},
      preferences: {}
    };

    // Extract personal information
    const emailMatch = message.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    const phoneMatch = message.match(/(\+?[\d\s-()]+)/);
    const nameMatch = message.match(/(?:my name is|i'm|i am|call me)\s+([a-zA-Z\s]+)/i);

    if (emailMatch) {
      extracted.cv.personal = { ...extracted.cv.personal, email: emailMatch[1] };
      extracted.letter.senderInfo = { ...extracted.letter.senderInfo, email: emailMatch[1] };
    }

    if (phoneMatch && phoneMatch[1].replace(/\D/g, '').length >= 10) {
      extracted.cv.personal = { ...extracted.cv.personal, phone: phoneMatch[1] };
      extracted.letter.senderInfo = { ...extracted.letter.senderInfo, phone: phoneMatch[1] };
    }

    if (nameMatch) {
      const fullName = nameMatch[1].trim();
      const [firstName, ...lastNameParts] = fullName.split(' ');
      extracted.cv.personal = { 
        ...extracted.cv.personal, 
        firstName, 
        lastName: lastNameParts.join(' ') 
      };
      extracted.letter.senderInfo = { 
        ...extracted.letter.senderInfo, 
        name: fullName 
      };
    }

    // Extract work experience
    const experienceKeywords = ['worked at', 'job at', 'position at', 'employed by', 'work for'];
    const companyMatch = experienceKeywords.find(keyword => {
      const regex = new RegExp(`${keyword}\\s+([\\w\\s&,.-]+)`, 'i');
      return message.match(regex);
    });

    if (companyMatch) {
      const regex = new RegExp(`${companyMatch}\\s+([\\w\\s&,.-]+)`, 'i');
      const match = message.match(regex);
      if (match) {
        extracted.cv.experience = [{
          id: `exp_${Date.now()}`,
          company: match[1].trim(),
          position: 'Position Title',
          location: 'Location',
          startDate: '2023',
          endDate: '2024',
          current: false,
          description: ['Key responsibility or achievement']
        }];
      }
    }

    // Extract skills
    const skillsMatch = message.match(/(?:skills?|technologies?|programming)[\s:]*([a-zA-Z0-9,\s\-\+#\.]+)/i);
    if (skillsMatch) {
      const skills = skillsMatch[1].split(',').map(skill => ({
        id: `skill_${Date.now()}_${Math.random()}`,
        name: skill.trim(),
        level: 'Intermediate' as const,
        category: 'Technical' as const
      }));
      extracted.cv.skills = skills;
    }

    // Extract preferences
    const industryMatch = message.match(/(?:industry|field|sector)[\s:]*([a-zA-Z\s]+)/i);
    if (industryMatch) {
      extracted.preferences.industry = industryMatch[1].trim();
    }

    const positionMatch = message.match(/(?:position|role|job)[\s:]*([a-zA-Z\s]+)/i);
    if (positionMatch) {
      extracted.preferences.position = positionMatch[1].trim();
    }

    return extracted;
  }

  canGeneratePDF(sessionId: string, type: 'cv' | 'letter'): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    if (type === 'cv') {
      const cv = session.extractedData.cv;
      return !!(cv?.personal?.firstName && cv?.personal?.email);
    } else {
      const letter = session.extractedData.letter;
      return !!(letter?.senderInfo?.name && letter?.senderInfo?.email);
    }
  }

  markPDFGenerated(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.status = 'pdf_generated';
      this.sessions.set(sessionId, session);
    }
  }

  getConversationSummary(sessionId: string): string {
    const session = this.sessions.get(sessionId);
    if (!session) return '';

    const messageCount = session.messages.length;
    const userMessages = session.messages.filter(m => m.role === 'user');
    const lastMessage = session.messages[session.messages.length - 1];

    return `Conversation with ${messageCount} messages. Last activity: ${lastMessage?.content.slice(0, 50)}...`;
  }
}

export const conversationMemory = new ConversationMemoryService();
