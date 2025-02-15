import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { getConfig } from './config';

const config = getConfig();
const ENCRYPTION_KEY = config.sessionSecret || randomBytes(32).toString('hex');
const ALGORITHM = 'aes-256-cbc';

export async function encrypt(text: string): Promise<string> {
  const iv = randomBytes(16);
  const key = Buffer.from(ENCRYPTION_KEY, 'utf-8');
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(Buffer.from(text, 'utf-8')),
    cipher.final()
  ]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export async function decrypt(text: string): Promise<string> {
  const parts = text.split(':');
  if (parts.length !== 2) {
    throw new Error('Invalid encrypted text format');
  }
  const [ivHex, encryptedHex] = parts;
  if (!ivHex || !encryptedHex) {
    throw new Error('Invalid encrypted text format');
  }
  
  const iv = Buffer.from(ivHex, 'hex');
  const key = Buffer.from(ENCRYPTION_KEY, 'utf-8');
  const encryptedText = Buffer.from(encryptedHex, 'hex');
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final()
  ]);
  return decrypted.toString('utf-8');
}
