import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '@/shared/decorators/public.decorator';
import { SignUpDto, SignInDto } from './dtos/auth.dto';

@ApiTags('auth')
@Controller('auth')
@Public()
export class AuthController {
  // We use BetterAuthMiddleware for actual auth routes handling under /api/auth
  // These controller methods exist primarily for Swagger documentation generation

  @Post('sign-up')
  @ApiOperation({
    summary: 'Register a new user (handled by BetterAuth middleware)',
  })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  signUp(@Body() signUpDto: SignUpDto): void {
    void signUpDto;
    // Handled by BetterAuth middleware
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'Sign in (handled by BetterAuth middleware)' })
  @ApiResponse({ status: 200, description: 'User successfully signed in' })
  signIn(@Body() signInDto: SignInDto): void {
    void signInDto;
    // Handled by BetterAuth middleware
  }

  @Post('sign-out')
  @ApiOperation({ summary: 'Sign out (handled by BetterAuth middleware)' })
  @ApiResponse({ status: 200, description: 'User successfully signed out' })
  signOut(): void {
    // Handled by BetterAuth middleware
  }
}
