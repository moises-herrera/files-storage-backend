import { hash, verify } from 'argon2';

export class HasherService {
  static async hashPassword(password: string): Promise<string> {
    return hash(password);
  }

  static async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return verify(hashedPassword, password);
  }
}
