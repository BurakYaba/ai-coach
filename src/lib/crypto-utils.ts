/**
 * Simple client-side encryption utilities for localStorage data
 * Note: This provides basic obfuscation, not military-grade security
 * For production apps, consider more robust solutions
 */

// Simple base64 encoding with key rotation for basic obfuscation
const ENCRYPTION_KEY = "fluenta_secure_key_2024";

export function encryptData(data: string): string {
  try {
    // Convert string to base64 with simple character shifting
    const encoded = btoa(data);
    let encrypted = "";

    for (let i = 0; i < encoded.length; i++) {
      const keyChar = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      const encodedChar = encoded.charCodeAt(i);
      encrypted += String.fromCharCode(encodedChar ^ keyChar);
    }

    return btoa(encrypted);
  } catch (error) {
    console.error("Encryption error:", error);
    return data; // Fallback to unencrypted
  }
}

export function decryptData(encryptedData: string): string {
  try {
    const encrypted = atob(encryptedData);
    let decrypted = "";

    for (let i = 0; i < encrypted.length; i++) {
      const keyChar = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      const encryptedChar = encrypted.charCodeAt(i);
      decrypted += String.fromCharCode(encryptedChar ^ keyChar);
    }

    return atob(decrypted);
  } catch (error) {
    console.error("Decryption error:", error);
    return encryptedData; // Fallback to original
  }
}

export function encryptCredentials(credentials: {
  email: string;
  password: string;
  rememberMe: boolean;
}) {
  return {
    email: credentials.email, // Email doesn't need encryption
    password: encryptData(credentials.password),
    rememberMe: credentials.rememberMe,
  };
}

export function decryptCredentials(encryptedCredentials: {
  email: string;
  password: string;
  rememberMe: boolean;
}) {
  return {
    email: encryptedCredentials.email,
    password: decryptData(encryptedCredentials.password),
    rememberMe: encryptedCredentials.rememberMe,
  };
}
