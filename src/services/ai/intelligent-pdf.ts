import { ConversationMemory } from './conversation-memory';
import { CVData, LetterData } from '../../types/builder';
import { sampleCVData } from '../../lib/sampleData';

export interface PDFGenerationResult {
  success: boolean;
  downloadUrl?: string;
  error?: string;
  type: 'cv' | 'letter';
}

class IntelligentPDFService {
  
  async generateCVFromConversation(memory: ConversationMemory): Promise<PDFGenerationResult> {
    try {
      // Build complete CV data from conversation
      const cvData = this.buildCompleteCV(memory);
      
      // Generate PDF using the template system
      const pdfBlob = await this.renderCVToPDF(cvData, memory.extractedData.preferences?.template_preference ?? 'modern');
      
      // Create download URL
      const downloadUrl = await this.createDownloadURL(pdfBlob, `${cvData.personal.firstName}_CV.pdf`);
      
      return {
        success: true,
        downloadUrl,
        type: 'cv'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate CV PDF',
        type: 'cv'
      };
    }
  }

  async generateLetterFromConversation(memory: ConversationMemory): Promise<PDFGenerationResult> {
    try {
      // Build complete letter data from conversation
      const letterData = this.buildCompleteLetter(memory);
      
      // Generate PDF using the template system
      const pdfBlob = await this.renderLetterToPDF(letterData, memory.extractedData.preferences?.template_preference ?? 'formal');
      
      // Create download URL
      const downloadUrl = await this.createDownloadURL(pdfBlob, `${letterData.senderInfo.name.replace(/\s/g, '_')}_Letter.pdf`);
      
      return {
        success: true,
        downloadUrl,
        type: 'letter'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate letter PDF',
        type: 'letter'
      };
    }
  }

  private buildCompleteCV(memory: ConversationMemory): CVData {
    const extracted = memory.extractedData.cv ?? {};
    
    // Start with sample data as base and merge with extracted info
    const completeCV: CVData = {
      personal: {
        firstName: extracted.personal?.firstName ?? 'John',
        lastName: extracted.personal?.lastName ?? 'Doe',
        email: extracted.personal?.email ?? 'john.doe@email.com',
        phone: extracted.personal?.phone ?? '+44 20 1234 5678',
        location: extracted.personal?.location ?? 'London, UK',
        website: extracted.personal?.website,
        linkedin: extracted.personal?.linkedin,
        github: extracted.personal?.github,
        summary: extracted.personal?.summary ?? this.generateSummaryFromConversation(memory)
      },
      experience: extracted.experience ?? sampleCVData.experience,
      education: extracted.education ?? sampleCVData.education,
      skills: extracted.skills ?? sampleCVData.skills,
      projects: extracted.projects ?? sampleCVData.projects,
      languages: extracted.languages ?? sampleCVData.languages,
      certificates: extracted.certificates ?? sampleCVData.certificates
    };

    return completeCV;
  }

  private buildCompleteLetter(memory: ConversationMemory): LetterData {
    const extracted = memory.extractedData.letter ?? {};
    
    const completeLetter: LetterData = {
      senderInfo: {
        name: extracted.senderInfo?.name ?? 'John Doe',
        address: extracted.senderInfo?.address ?? '123 Main Street, London, SW1A 1AA',
        phone: extracted.senderInfo?.phone ?? '+44 20 1234 5678',
        email: extracted.senderInfo?.email ?? 'john.doe@email.com'
      },
      recipientInfo: {
        name: extracted.recipientInfo?.name ?? 'Hiring Manager',
        title: extracted.recipientInfo?.title ?? 'Recruitment Team',
        company: extracted.recipientInfo?.company ?? 'Company Name',
        address: extracted.recipientInfo?.address ?? 'Company Address, London, UK'
      },
      letterInfo: {
        date: new Date().toLocaleDateString('en-GB'),
        subject: extracted.letterInfo?.subject ?? this.generateSubjectFromConversation(memory),
        salutation: extracted.letterInfo?.salutation ?? 'Dear Hiring Manager,',
        body: extracted.letterInfo?.body ?? this.generateBodyFromConversation(memory),
        closing: extracted.letterInfo?.closing ?? 'Yours faithfully,',
        signature: extracted.letterInfo?.signature ?? 'Professional Signature'
      }
    };

    return completeLetter;
  }

  private generateSummaryFromConversation(memory: ConversationMemory): string {
    const userMessages = memory.messages.filter(m => m.role === 'user');
    const preferences = memory.extractedData.preferences;
    
    let summary = `Experienced professional`;
    
    if (preferences?.position) {
      summary += ` in ${preferences.position}`;
    }
    
    if (preferences?.industry) {
      summary += ` within the ${preferences.industry} industry`;
    }
    
    summary += `. Passionate about delivering high-quality results and contributing to team success. Seeking opportunities to apply expertise and drive meaningful impact in a collaborative environment.`;
    
    return summary;
  }

  private generateSubjectFromConversation(memory: ConversationMemory): string {
    const preferences = memory.extractedData.preferences;
    
    if (preferences?.position) {
      return `Application for ${preferences.position} Position`;
    }
    
    return 'Job Application - Professional Interest';
  }

  private generateBodyFromConversation(memory: ConversationMemory): string {
    const userMessages = memory.messages.filter(m => m.role === 'user');
    const preferences = memory.extractedData.preferences;
    
    let body = `I am writing to express my strong interest in joining your organization`;
    
    if (preferences?.position) {
      body += ` as a ${preferences.position}`;
    }
    
    body += `.

My professional background and skills align well with your requirements. Throughout my career, I have developed expertise that enables me to contribute effectively to your team's objectives.

I am particularly drawn to this opportunity because it allows me to apply my experience while continuing to grow professionally. I am confident that my dedication to quality work and collaborative approach would make me a valuable addition to your organization.

I would welcome the opportunity to discuss how my background and enthusiasm can contribute to your team's success. Thank you for considering my application.`;
    
    return body;
  }

  private async renderCVToPDF(cvData: CVData, template: string): Promise<Blob> {
    // This would use the existing PDF generation logic
    // For now, return a mock PDF blob
    return new Blob(['Mock CV PDF content'], { type: 'application/pdf' });
  }

  private async renderLetterToPDF(letterData: LetterData, template: string): Promise<Blob> {
    // This would use the existing PDF generation logic
    // For now, return a mock PDF blob
    return new Blob(['Mock Letter PDF content'], { type: 'application/pdf' });
  }

  private async createDownloadURL(blob: Blob, filename: string): Promise<string> {
    // Create object URL for download
    return URL.createObjectURL(blob);
  }

  determineDocumentType(message: string): 'cv' | 'letter' | 'both' | 'unknown' {
    const lowerMessage = message.toLowerCase();
    
    const cvKeywords = ['cv', 'resume', 'curriculum vitae', 'work experience', 'skills', 'education'];
    const letterKeywords = ['cover letter', 'application letter', 'job application', 'dear', 'letter'];
    
    const hasCVKeywords = cvKeywords.some(keyword => lowerMessage.includes(keyword));
    const hasLetterKeywords = letterKeywords.some(keyword => lowerMessage.includes(keyword));
    
    if (hasCVKeywords && hasLetterKeywords) return 'both';
    if (hasCVKeywords) return 'cv';
    if (hasLetterKeywords) return 'letter';
    
    return 'unknown';
  }

  shouldOfferPDFGeneration(memory: ConversationMemory): {
    cv: boolean;
    letter: boolean;
    message: string;
  } {
    const messageCount = memory.messages.length;
    const hasEnoughData = messageCount >= 4;
    
    const cvData = memory.extractedData.cv;
    const letterData = memory.extractedData.letter;
    
    const canGenerateCV = !!(cvData?.personal?.firstName && cvData?.personal?.email);
    const canGenerateLetter = !!(letterData?.senderInfo?.name && letterData?.senderInfo?.email);
    
    let message = '';
    
    if (hasEnoughData && (canGenerateCV ?? canGenerateLetter)) {
      message = '🎉 Great! I have enough information to generate your documents. ';
      
      if (canGenerateCV && canGenerateLetter) {
        message += 'I can create both your CV and cover letter as PDFs. Which would you like me to generate first?';
      } else if (canGenerateCV) {
        message += 'I can create your CV as a PDF now. Would you like me to generate it?';
      } else {
        message += 'I can create your cover letter as a PDF now. Would you like me to generate it?';
      }
    }
    
    return {
      cv: canGenerateCV,
      letter: canGenerateLetter,
      message
    };
  }
}

export const intelligentPDFService = new IntelligentPDFService();
