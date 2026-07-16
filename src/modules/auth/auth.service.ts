import { Injectable } from '@nestjs/common';
import { BetterAuthService } from '@/infrastructure/auth-provider/better-auth.config.js';

@Injectable()
export class AuthService {
  constructor(private readonly betterAuthService: BetterAuthService) {}

  // Any custom auth logic that wraps BetterAuth API can go here
  // e.g. custom user initialization after signup, generating custom tokens, etc.
}
