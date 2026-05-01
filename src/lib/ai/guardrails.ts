export const CONTENT_CONSTRAINTS = {
  SUMMARY_MAX_CHARS: 600,
  EXPERIENCE_DESCRIPTION_MAX_CHARS: 1000,
  SKILLS_MAX_COUNT: 25,
  PHRASE_MAX_WORDS: 25,
};

export class ContentGuardrails {
  static sanitizeSummary(text: string): string {
    if (text.length > CONTENT_CONSTRAINTS.SUMMARY_MAX_CHARS) {
      return text.substring(0, CONTENT_CONSTRAINTS.SUMMARY_MAX_CHARS) + "...";
    }
    return text;
  }

  static validateBulletPoints(bullets: string[]): string[] {
    return bullets.map(bullet => {
      const words = bullet.split(" ");
      if (words.length > CONTENT_CONSTRAINTS.PHRASE_MAX_WORDS) {
        return words.slice(0, CONTENT_CONSTRAINTS.PHRASE_MAX_WORDS).join(" ") + "...";
      }
      return bullet;
    });
  }

  static checkQuality(text: string): boolean {
    // Simple checks for common AI artifacts
    const lowQualityPatterns = [
      "I hope this helps",
      "As an AI model",
      "Here is your resume",
      "Certainly!",
    ];
    
    return !lowQualityPatterns.some(pattern => text.includes(pattern));
  }
}
