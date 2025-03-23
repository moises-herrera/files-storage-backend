import { hash, verify } from 'argon2';

export class HasherService {
  static async hashPassword(password: string): Promise<string> {
    return hash(password);
  }

  static async verifyPassword(
    hashedPassword: string,
    password: string,
  ): Promise<boolean> {
    try {
      return verify(hashedPassword, password);
    } catch {
      return false;
    }
  }
}
