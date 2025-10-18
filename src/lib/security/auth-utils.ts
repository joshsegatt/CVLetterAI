import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Password hashing utilities
export class PasswordUtils {
  private static readonly SALT_ROUNDS = 12;
  
  /**
   * Hash a password securely using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Password hashing failed');
    }
  }
  
  /**
   * Verify a password against its hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }
  
  /**
   * Generate a secure random password
   */
  static generateSecurePassword(length: number = 16): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&';
    let password = '';
    
    // Ensure at least one character from each required category
    password += this.getRandomFromCharset('abcdefghijklmnopqrstuvwxyz');
    password += this.getRandomFromCharset('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    password += this.getRandomFromCharset('0123456789');
    password += this.getRandomFromCharset('@$!%*?&');
    
    // Fill the rest with random characters
    for (let i = password.length; i < length; i++) {
      password += this.getRandomFromCharset(charset);
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }
  
  private static getRandomFromCharset(charset: string): string {
    return charset[Math.floor(Math.random() * charset.length)];
  }
}

// JWT token utilities
export class TokenUtils {
  private static readonly JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-super-secret-jwt-key';
  private static readonly ACCESS_TOKEN_EXPIRES_IN = '24h'; // 24 hours
  private static readonly REFRESH_TOKEN_EXPIRES_IN = '7d'; // 7 days
  
  /**
   * Generate JWT access token
   */
  static generateAccessToken(payload: { userId: string; email: string }): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
      issuer: 'cvletterai',
      subject: payload.userId,
    });
  }
  
  /**
   * Generate JWT refresh token
   */
  static generateRefreshToken(payload: { userId: string }): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
      issuer: 'cvletterai',
      subject: payload.userId,
    });
  }
  
  /**
   * Verify and decode JWT token
   */
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }
  
  /**
   * Decode JWT token without verification (for expired tokens)
   */
  static decodeToken(token: string): any {
    try {
      return jwt.decode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}

// Security utilities
export class SecurityUtils {
  /**
   * Generate a secure random string for password reset tokens
   */
  static generateSecureToken(length: number = 32): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
      token += charset[Math.floor(Math.random() * charset.length)];
    }
    return token;
  }
  
  /**
   * Sanitize user input to prevent XSS
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
  
  /**
   * Check if password meets security requirements
   */
  static isPasswordSecure(password: string): { isSecure: boolean; reasons: string[] } {
    const reasons: string[] = [];
    let isSecure = true;
    
    if (password.length < 8) {
      reasons.push('Password must be at least 8 characters long');
      isSecure = false;
    }
    
    if (!/[a-z]/.test(password)) {
      reasons.push('Password must contain at least one lowercase letter');
      isSecure = false;
    }
    
    if (!/[A-Z]/.test(password)) {
      reasons.push('Password must contain at least one uppercase letter');
      isSecure = false;
    }
    
    if (!/\d/.test(password)) {
      reasons.push('Password must contain at least one number');
      isSecure = false;
    }
    
    if (!/[@$!%*?&]/.test(password)) {
      reasons.push('Password must contain at least one special character (@$!%*?&)');
      isSecure = false;
    }
    
    return { isSecure, reasons };
  }
  
  /**
   * Generate username suggestions based on name and email
   */
  static generateUsernameSuggestions(firstName: string, lastName: string, email: string): string[] {
    const suggestions: string[] = [];
    const emailPart = email.split('@')[0];
    
    // Clean names (remove spaces and special characters)
    const cleanFirst = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanLast = lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanEmail = emailPart.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Generate suggestions
    if (cleanFirst && cleanLast) {
      suggestions.push(cleanFirst + cleanLast);
      suggestions.push(cleanFirst + '.' + cleanLast);
      suggestions.push(cleanFirst + '_' + cleanLast);
      suggestions.push(cleanLast + cleanFirst);
      suggestions.push(cleanFirst + cleanLast.charAt(0));
      suggestions.push(cleanFirst.charAt(0) + cleanLast);
    }
    
    if (cleanEmail) {
      suggestions.push(cleanEmail);
      suggestions.push(cleanEmail + Math.floor(Math.random() * 100));
    }
    
    if (cleanFirst) {
      suggestions.push(cleanFirst + Math.floor(Math.random() * 1000));
    }
    
    // Remove duplicates and return first 5
    return [...new Set(suggestions)].slice(0, 5);
  }
}