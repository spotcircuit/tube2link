import fs from 'fs/promises';
import path from 'path';

const TOKEN_FILE = path.join(process.cwd(), '.tokens.json');

interface TokenData {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}

export async function saveTokens(tokens: TokenData): Promise<void> {
  try {
    await fs.writeFile(TOKEN_FILE, JSON.stringify(tokens, null, 2));
  } catch (error) {
    console.error('Error saving tokens:', error);
    throw error;
  }
}

export async function loadTokens(): Promise<TokenData | null> {
  try {
    const data = await fs.readFile(TOKEN_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      return null;
    }
    console.error('Error loading tokens:', error);
    throw error;
  }
}

export async function clearTokens(): Promise<void> {
  try {
    await fs.unlink(TOKEN_FILE);
  } catch (error) {
    if ((error as any).code !== 'ENOENT') {
      console.error('Error clearing tokens:', error);
      throw error;
    }
  }
}
