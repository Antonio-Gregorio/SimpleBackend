import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '';

interface DecodedToken {
  userId: string;
  // Adicione outras informações personalizadas do token, se necessário
}

export function generateToken(userId: string, name: string, email: string, avatar: string): string {
  const token = jwt.sign({ userId, name, email, avatar }, JWT_SECRET, { expiresIn: '1h' });
  return token;
}

export function validateToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (err) {
    return null; // Token inválido
  }
}