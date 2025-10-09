import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET ?? 'development-secret';

export function signJwt<T extends object>(payload: T, options?: jwt.SignOptions) {
  return jwt.sign(payload, jwtSecret, { expiresIn: '1h', ...options });
}

export function verifyJwt<T>(token: string) {
  return jwt.verify(token, jwtSecret) as T;
}
