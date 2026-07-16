import { randomBytes, createHash } from 'crypto';

/**
 * CryptoHelper - Secure hashing and token generation
 */
export class CryptoHelper {
  static generateToken(length = 32): string {
    return randomBytes(length).toString('hex');
  }

  static sha256(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }

  static generateOtp(length = 6): string {
    const digits = '0123456789';
    let otp = '';
    const bytes = randomBytes(length);
    for (let i = 0; i < length; i++) {
      otp += digits[bytes[i] % 10];
    }
    return otp;
  }
}
