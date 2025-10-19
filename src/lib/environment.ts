import { NextRequest } from 'next/server';

/**
 * Environment utilities for IP detection and environment helpers
 */

/**
 * Extract client IP address from various headers and request sources
 * @param request - Next.js request object
 * @returns Client IP address as string
 */
export function getClientIP(request: NextRequest): string {
  // Check for IP in various headers (order matters for priority)
  const headers = [
    'cf-connecting-ip', // Cloudflare
    'x-real-ip', // Nginx
    'x-forwarded-for', // Most common proxy header
    'x-client-ip', // Apache
    'x-cluster-client-ip', // Cluster
    'x-forwarded', // General forwarded
    'forwarded-for', // RFC 7239
    'forwarded', // RFC 7239
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // x-forwarded-for can contain multiple IPs, take the first one
      const ip = value.split(',')[0].trim();
      if (isValidIP(ip)) {
        return ip;
      }
    }
  }

  // Fallback to connection remote address or localhost
  return getRequestIP(request) || '127.0.0.1';
}

/**
 * Extract IP from request URL or connection info
 * @param request - Next.js request object
 * @returns IP address or null
 */
function getRequestIP(request: NextRequest): string | null {
  try {
    // Try to get from the request's connection info
    const url = new URL(request.url);
    
    // Check if we're in development and can access localhost info
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      return '127.0.0.1';
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Basic IP address validation
 * @param ip - IP address string to validate
 * @returns true if valid IP format
 */
function isValidIP(ip: string): boolean {
  // IPv4 regex pattern
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  
  // IPv6 basic pattern (simplified)
  const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  if (ipv4Pattern.test(ip)) {
    // Validate IPv4 octets are in valid range (0-255)
    const octets = ip.split('.');
    return octets.every(octet => {
      const num = parseInt(octet, 10);
      return num >= 0 && num <= 255;
    });
  }
  
  if (ipv6Pattern.test(ip)) {
    return true;
  }
  
  // Check for IPv6 shorthand formats
  if (ip.includes('::')) {
    return /^([0-9a-fA-F]{0,4}:)*::([0-9a-fA-F]{0,4}:)*[0-9a-fA-F]{0,4}$/.test(ip);
  }
  
  return false;
}

/**
 * Check if running in development environment
 * @returns true if in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if running in production environment
 * @returns true if in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running in test environment
 * @returns true if in test
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

/**
 * Get the current environment name
 * @returns Environment string (development, production, test, etc.)
 */
export function getEnvironment(): string {
  return process.env.NODE_ENV || 'development';
}

/**
 * Check if request is coming from localhost
 * @param request - Next.js request object
 * @returns true if from localhost
 */
export function isLocalhost(request: NextRequest): boolean {
  const ip = getClientIP(request);
  return ip === '127.0.0.1' || ip === '::1' || ip === 'localhost';
}

/**
 * Get user agent from request headers
 * @param request - Next.js request object
 * @returns User agent string or null
 */
export function getUserAgent(request: NextRequest): string | null {
  return request.headers.get('user-agent');
}

/**
 * Check if request is from a mobile device (basic detection)
 * @param request - Next.js request object
 * @returns true if likely mobile device
 */
export function isMobileDevice(request: NextRequest): boolean {
  const userAgent = getUserAgent(request);
  if (!userAgent) return false;
  
  const mobilePatterns = [
    /Android/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
    /Opera Mini/i,
    /IEMobile/i,
    /Mobile/i
  ];
  
  return mobilePatterns.some(pattern => pattern.test(userAgent));
}

/**
 * Create a unique identifier for rate limiting based on IP and user agent
 * @param request - Next.js request object
 * @returns Unique identifier string
 */
export function createRateLimitIdentifier(request: NextRequest): string {
  const ip = getClientIP(request);
  const userAgent = getUserAgent(request) || 'unknown';
  
  // Create a simple hash of IP + UserAgent for better rate limiting
  // In production, you might want to use a proper hashing function
  return `${ip}:${userAgent.slice(0, 50)}`;
}

/**
 * Environment configuration getter with defaults
 * @param key - Environment variable key
 * @param defaultValue - Default value if not found
 * @returns Environment variable value or default
 */
export function getEnvVar(key: string, defaultValue?: string): string | undefined {
  return process.env[key] || defaultValue;
}

/**
 * Required environment variable getter (throws if not found)
 * @param key - Environment variable key
 * @returns Environment variable value
 * @throws Error if environment variable is not set
 */
export function getRequiredEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}
