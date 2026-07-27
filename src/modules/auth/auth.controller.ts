import { Controller, Get, Post, Patch, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Public } from '@/shared/decorators/public.decorator';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { IUserContext } from '@/shared/interfaces/user-context.interface';
import { AuthService } from './auth.service';
import {
  SignUpDto,
  SignInDto,
  ForgotPasswordDto,
  VerifyEmailDto,
  ResendVerificationEmailDto,
  ResetPasswordDto,
  ChangePasswordDto,
  RequestEmailChangeDto,
  ChangeEmailDto,
  Verify2FADto,
  UpdateProfileDto,
  UserProfileResponseDto,
  TwoFactorSecretResponseDto,
} from './dtos/auth.dto';
import { ApiResponseDto } from '@/shared/dtos/api-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, type: UserProfileResponseDto })
  async signUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<ApiResponseDto<UserProfileResponseDto>> {
    return this.authService.register(signUpDto);
  }

  @Public()
  @Post('sign-in')
  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({
    status: 200,
    description:
      'User successfully signed in (Handled via BetterAuth middleware)',
  })
  signIn(@Body() signInDto: SignInDto): void {
    void signInDto;
  }

  @Post('sign-out')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sign out' })
  @ApiResponse({ status: 200, description: 'User successfully signed out' })
  signOut(): void {}

  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile details' })
  @ApiResponse({ status: 200, type: UserProfileResponseDto })
  async me(
    @CurrentUser() user: IUserContext,
  ): Promise<ApiResponseDto<UserProfileResponseDto>> {
    return this.authService.me(user.userId);
  }

  @ApiBearerAuth()
  @Patch('update')
  @ApiOperation({ summary: 'Update user profile details' })
  @ApiResponse({ status: 200, type: UserProfileResponseDto })
  async updateProfile(
    @CurrentUser() user: IUserContext,
    @Body() dto: UpdateProfileDto,
  ): Promise<ApiResponseDto<UserProfileResponseDto>> {
    return this.authService.updateProfile(user.userId, dto);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset email' })
  @ApiResponse({ status: 200, description: 'Password reset link sent' })
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<ApiResponseDto<null>> {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email with token' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  async verifyEmail(
    @Body() dto: VerifyEmailDto,
  ): Promise<ApiResponseDto<null>> {
    return this.authService.verifyEmail(dto);
  }

  @Public()
  @Post('resend-verification-email')
  @ApiOperation({ summary: 'Resend email verification token' })
  @ApiResponse({ status: 200, description: 'Verification email resent' })
  async resendVerificationEmail(
    @Body() dto: ResendVerificationEmailDto,
  ): Promise<ApiResponseDto<null>> {
    return this.authService.resendVerificationEmail(dto);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<ApiResponseDto<null>> {
    return this.authService.resetPassword(dto);
  }

  @ApiBearerAuth()
  @Post('change-password')
  @ApiOperation({ summary: 'Change current user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  async changePassword(
    @CurrentUser() user: IUserContext,
    @Body() dto: ChangePasswordDto,
  ): Promise<ApiResponseDto<null>> {
    return this.authService.changePassword(user.userId, dto);
  }

  @ApiBearerAuth()
  @Post('request-email-change')
  @ApiOperation({ summary: 'Request change of email address' })
  @ApiResponse({ status: 200, description: 'Email change verification sent' })
  async requestEmailChange(
    @CurrentUser() user: IUserContext,
    @Body() dto: RequestEmailChangeDto,
  ): Promise<ApiResponseDto<null>> {
    return this.authService.requestEmailChange(user.userId, dto);
  }

  @ApiBearerAuth()
  @Post('change-email')
  @ApiOperation({ summary: 'Confirm change of email address with token' })
  @ApiResponse({
    status: 200,
    description: 'Email address changed successfully',
  })
  async changeEmail(
    @CurrentUser() user: IUserContext,
    @Body() dto: ChangeEmailDto,
  ): Promise<ApiResponseDto<null>> {
    return this.authService.changeEmail(user.userId, dto);
  }

  @ApiBearerAuth()
  @Post('generate-2fa-secret')
  @ApiOperation({ summary: 'Generate 2FA TOTP secret' })
  @ApiResponse({ status: 200, type: TwoFactorSecretResponseDto })
  async generate2FASecret(
    @CurrentUser() user: IUserContext,
  ): Promise<ApiResponseDto<TwoFactorSecretResponseDto>> {
    return this.authService.generate2FASecret(user.userId);
  }

  @ApiBearerAuth()
  @Post('verify-2fa')
  @ApiOperation({ summary: 'Verify 2FA TOTP code' })
  @ApiResponse({ status: 200, description: '2FA code verified' })
  async verify2FA(
    @CurrentUser() user: IUserContext,
    @Body() dto: Verify2FADto,
  ): Promise<ApiResponseDto<null>> {
    return this.authService.verify2FA(user.userId, dto);
  }

  @ApiBearerAuth()
  @Post('enable-2fa')
  @ApiOperation({ summary: 'Enable 2FA for user account' })
  @ApiResponse({ status: 200, description: '2FA enabled' })
  async enable2FA(
    @CurrentUser() user: IUserContext,
  ): Promise<ApiResponseDto<null>> {
    return this.authService.enable2FA(user.userId);
  }

  @ApiBearerAuth()
  @Post('disable-2fa')
  @ApiOperation({ summary: 'Disable 2FA for user account' })
  @ApiResponse({ status: 200, description: '2FA disabled' })
  async disable2FA(
    @CurrentUser() user: IUserContext,
  ): Promise<ApiResponseDto<null>> {
    return this.authService.disable2FA(user.userId);
  }
}
