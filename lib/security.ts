// lib/security.ts
// import { KMSClient, EncryptCommand, DecryptCommand } from '@aws-sdk/client-kms';

// const client = new KMSClient({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_KEY,
//   },
// });

async function encrypt(plaintext: string): Promise<string> {
  // const command = new EncryptCommand({
  //   KeyId: process.env.AWS_KMS_KEY_ID,
  //   Plaintext: new TextEncoder().encode(plaintext),
  // });

  // const response = await client.send(command);
  // return Buffer.from(response.CiphertextBlob!).toString('base64');
  return plaintext; // Placeholder
}

async function decrypt(ciphertext: string): Promise<string> {
  // const command = new DecryptCommand({
  //   CiphertextBlob: Buffer.from(ciphertext, 'base64'),
  // });

  // const response = await client.send(command);
  // return new TextDecoder().decode(response.Plaintext);
  return ciphertext; // Placeholder
}

export { encrypt, decrypt };
