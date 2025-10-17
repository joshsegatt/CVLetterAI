import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Validar que o JWT_SECRET existe e é seguro
const jwtSecret = process.env.JWT_SECRET || 'default-development-secret-that-should-be-changed-in-production';
const refreshSecret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-that-should-be-changed-in-production';

if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long for banking-level security');
  }
  
  if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET.length < 32) {
    throw new Error('JWT_REFRESH_SECRET must be at least 32 characters long');
  }
}

export interface JWTPayload {
  userId: string;
  email: string;
  role?: string;
  sessionId: string;
  iat?: number;
  exp?: number;
  aud?: string;
  iss?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Store de sessões ativas (em produção usar Redis)
const activeSessions = new Map<string, {
  userId: string;
  sessionId: string;
  createdAt: Date;
  lastUsed: Date;
  ipAddress: string;
  userAgent: string;
}>();

export function createTokenPair(
  payload: Omit<JWTPayload, 'sessionId' | 'iat' | 'exp'>,
  ipAddress: string,
  userAgent: string
): TokenPair {
  // Gerar ID de sessão único
  const sessionId = crypto.randomBytes(32).toString('hex');
  
  // Payload do Access Token (vida curta)
  const accessPayload: JWTPayload = {
    ...payload,
    sessionId,
    aud: 'cvletterai-app',
    iss: 'cvletterai-auth'
  };
  
  // Payload do Refresh Token (vida longa)
  const refreshPayload = {
    userId: payload.userId,
    sessionId,
    type: 'refresh',
    aud: 'cvletterai-refresh',
    iss: 'cvletterai-auth'
  };
  
  // Assinar tokens com diferentes secrets e tempos
  const accessToken = jwt.sign(accessPayload, jwtSecret, {
    expiresIn: '15m', // 15 minutos - curto para máxima segurança
    algorithm: 'HS256'
  });
  
  const refreshToken = jwt.sign(refreshPayload, refreshSecret, {
    expiresIn: '7d', // 7 dias
    algorithm: 'HS256'
  });
  
  // Armazenar sessão ativa
  activeSessions.set(sessionId, {
    userId: payload.userId,
    sessionId,
    createdAt: new Date(),
    lastUsed: new Date(),
    ipAddress,
    userAgent
  });
  
  return {
    accessToken,
    refreshToken,
    expiresIn: 15 * 60 * 1000 // 15 minutos em ms
  };
}

export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, jwtSecret, {
      algorithms: ['HS256'],
      audience: 'cvletterai-app',
      issuer: 'cvletterai-auth'
    }) as unknown as JWTPayload;
    
    // Verificar se a sessão ainda está ativa
    const session = activeSessions.get(decoded.sessionId);
    if (!session) {
      return null; // Sessão expirada ou inválida
    }
    
    // Atualizar última utilização
    session.lastUsed = new Date();
    
    return decoded;
  } catch (error) {
    console.warn('JWT verification failed:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

export function verifyRefreshToken(token: string): { userId: string; sessionId: string } | null {
  try {
    const decoded = jwt.verify(token, refreshSecret, {
      algorithms: ['HS256'],
      audience: 'cvletterai-refresh',
      issuer: 'cvletterai-auth'
    }) as any;
    
    // Verificar se a sessão ainda existe
    const session = activeSessions.get(decoded.sessionId);
    if (!session || session.userId !== decoded.userId) {
      return null;
    }
    
    return {
      userId: decoded.userId,
      sessionId: decoded.sessionId
    };
  } catch (error) {
    console.warn('Refresh token verification failed:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

export function refreshTokenPair(
  refreshToken: string,
  ipAddress: string,
  userAgent: string
): TokenPair | null {
  const refreshData = verifyRefreshToken(refreshToken);
  if (!refreshData) {
    return null;
  }
  
  const session = activeSessions.get(refreshData.sessionId);
  if (!session) {
    return null;
  }
  
  // Verificar se IP/UserAgent mudaram (possível hijacking)
  if (session.ipAddress !== ipAddress || session.userAgent !== userAgent) {
    console.warn(`Session hijacking attempt detected for user ${session.userId}`);
    revokeSession(refreshData.sessionId);
    return null;
  }
  
  // Invalidar a sessão atual
  revokeSession(refreshData.sessionId);
  
  // Criar novo par de tokens
  // Nota: Em uma implementação real, você precisaria buscar dados do usuário do banco
  return createTokenPair(
    {
      userId: refreshData.userId,
      email: '', // Buscar do banco de dados
      role: 'user' // Buscar do banco de dados
    },
    ipAddress,
    userAgent
  );
}

export function revokeSession(sessionId: string): boolean {
  return activeSessions.delete(sessionId);
}

export function revokeAllUserSessions(userId: string): number {
  let revokedCount = 0;
  for (const [sessionId, session] of activeSessions.entries()) {
    if (session.userId === userId) {
      activeSessions.delete(sessionId);
      revokedCount++;
    }
  }
  return revokedCount;
}

export function getActiveSessions(userId: string) {
  const userSessions = [];
  for (const [sessionId, session] of activeSessions.entries()) {
    if (session.userId === userId) {
      userSessions.push({
        sessionId,
        createdAt: session.createdAt,
        lastUsed: session.lastUsed,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        isCurrent: false // Seria definido no contexto da requisição atual
      });
    }
  }
  return userSessions;
}

// Cleanup de sessões expiradas (rodar periodicamente)
export function cleanupExpiredSessions(): number {
  const now = new Date();
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 dias
  let cleanedCount = 0;
  
  for (const [sessionId, session] of activeSessions.entries()) {
    if (now.getTime() - session.lastUsed.getTime() > maxAge) {
      activeSessions.delete(sessionId);
      cleanedCount++;
    }
  }
  
  return cleanedCount;
}

// Middleware para autenticação
export function requireAuth(token: string | undefined): JWTPayload | null {
  if (!token) {
    return null;
  }
  
  // Remover 'Bearer ' se presente
  const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
  
  return verifyAccessToken(cleanToken);
}

// Função para hash seguro de passwords (para complementar)
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, hash] = hashedPassword.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}
