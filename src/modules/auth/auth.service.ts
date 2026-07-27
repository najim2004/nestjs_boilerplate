import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { EmailService } from '@/infrastructure/email/email.service';
import {
  SignUpDto,
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
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async me(userId: string): Promise<ApiResponseDto<UserProfileResponseDto>> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User profile not found');

    const profile: UserProfileResponseDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      role: user.role,
      phoneNumber: user.phoneNumber,
      country: user.country,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
    };

    return ApiResponseDto.ok(profile, 'Profile fetched successfully');
  }

  async register(
    dto: SignUpDto,
  ): Promise<ApiResponseDto<UserProfileResponseDto>> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException('User with this email already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: dto.password,
        firstName: dto.firstName,
        lastName: dto.lastName,
        type: dto.type ?? 'user',
      },
    });

    // Send welcome email
    await this.emailService.sendWelcomeEmail(user.email, user.name);

    const profile: UserProfileResponseDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      role: user.role,
      phoneNumber: user.phoneNumber,
      country: user.country,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
    };

    return ApiResponseDto.ok(profile, 'User registered successfully');
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<ApiResponseDto<UserProfileResponseDto>> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });

    const profile: UserProfileResponseDto = {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      emailVerified: updated.emailVerified,
      image: updated.image,
      role: updated.role,
      phoneNumber: updated.phoneNumber,
      country: updated.country,
      isTwoFactorEnabled: updated.isTwoFactorEnabled,
    };

    return ApiResponseDto.ok(profile, 'Profile updated successfully');
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<ApiResponseDto<null>> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      // Return success to avoid email enumeration
      return ApiResponseDto.ok(
        null,
        'If the email exists, a reset link has been sent',
      );
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiredAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await this.prisma.ucode.create({
      data: {
        userId: user.id,
        email: user.email,
        token,
        expiredAt,
      },
    });

    const resetLink = `https://app.example.com/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;
    await this.emailService.sendPasswordResetEmail(user.email, resetLink);

    return ApiResponseDto.ok(null, 'Password reset link sent successfully');
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<ApiResponseDto<null>> {
    const ucode = await this.prisma.ucode.findFirst({
      where: {
        email: dto.email,
        token: dto.token,
        status: 1,
      },
    });

    if (!ucode || (ucode.expiredAt && ucode.expiredAt < new Date())) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.prisma.user.update({
      where: { email: dto.email },
      data: { emailVerified: true },
    });

    await this.prisma.ucode.update({
      where: { id: ucode.id },
      data: { status: 0 },
    });

    return ApiResponseDto.ok(null, 'Email verified successfully');
  }

  async resendVerificationEmail(
    dto: ResendVerificationEmailDto,
  ): Promise<ApiResponseDto<null>> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new NotFoundException('User not found');

    const token = crypto.randomBytes(32).toString('hex');
    const expiredAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    await this.prisma.ucode.create({
      data: {
        userId: user.id,
        email: user.email,
        token,
        expiredAt,
      },
    });

    return ApiResponseDto.ok(null, 'Verification email resent successfully');
  }

  async resetPassword(dto: ResetPasswordDto): Promise<ApiResponseDto<null>> {
    const ucode = await this.prisma.ucode.findFirst({
      where: {
        email: dto.email,
        token: dto.token,
        status: 1,
      },
    });

    if (!ucode || (ucode.expiredAt && ucode.expiredAt < new Date())) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    await this.prisma.user.update({
      where: { email: dto.email },
      data: { password: dto.password },
    });

    await this.prisma.ucode.update({
      where: { id: ucode.id },
      data: { status: 0 },
    });

    return ApiResponseDto.ok(null, 'Password reset successfully');
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<ApiResponseDto<null>> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (user.password && user.password !== dto.oldPassword) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: dto.newPassword },
    });

    return ApiResponseDto.ok(null, 'Password changed successfully');
  }

  async requestEmailChange(
    userId: string,
    dto: RequestEmailChangeDto,
  ): Promise<ApiResponseDto<null>> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new BadRequestException('Email already in use');

    const token = crypto.randomBytes(32).toString('hex');
    await this.prisma.ucode.create({
      data: {
        userId,
        email: dto.email,
        token,
        expiredAt: new Date(Date.now() + 1000 * 60 * 60),
      },
    });

    return ApiResponseDto.ok(null, 'Email change verification token generated');
  }

  async changeEmail(
    userId: string,
    dto: ChangeEmailDto,
  ): Promise<ApiResponseDto<null>> {
    const ucode = await this.prisma.ucode.findFirst({
      where: {
        userId,
        email: dto.email,
        token: dto.token,
        status: 1,
      },
    });

    if (!ucode || (ucode.expiredAt && ucode.expiredAt < new Date())) {
      throw new BadRequestException('Invalid or expired email change token');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { email: dto.email },
    });

    await this.prisma.ucode.update({
      where: { id: ucode.id },
      data: { status: 0 },
    });

    return ApiResponseDto.ok(null, 'Email address changed successfully');
  }

  // 2FA Management
  async generate2FASecret(
    userId: string,
  ): Promise<ApiResponseDto<TwoFactorSecretResponseDto>> {
    const secret = crypto
      .randomBytes(20)
      .toString('hex')
      .toUpperCase()
      .slice(0, 16);
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret },
    });

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const qrCodeUrl = `otpauth://totp/App:${encodeURIComponent(user?.email || '')}?secret=${secret}`;

    return ApiResponseDto.ok(
      { secret, qrCodeUrl },
      '2FA secret generated successfully',
    );
  }

  async verify2FA(
    userId: string,
    dto: Verify2FADto,
  ): Promise<ApiResponseDto<null>> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('2FA is not initiated for this user');
    }

    if (dto.token.length !== 6) {
      throw new BadRequestException('Invalid 2FA TOTP token format');
    }

    return ApiResponseDto.ok(null, '2FA token verified successfully');
  }

  async enable2FA(userId: string): Promise<ApiResponseDto<null>> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isTwoFactorEnabled: 1 },
    });
    return ApiResponseDto.ok(null, '2FA enabled successfully');
  }

  async disable2FA(userId: string): Promise<ApiResponseDto<null>> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isTwoFactorEnabled: 0, twoFactorSecret: null },
    });
    return ApiResponseDto.ok(null, '2FA disabled successfully');
  }
}
