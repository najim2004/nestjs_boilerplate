import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'password123',
    minLength: 8,
    description: 'Password',
  })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiPropertyOptional({ example: 'John', description: 'First name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'Last name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'user', description: 'User type' })
  @IsOptional()
  @IsString()
  type?: string;
}

export class SignInDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'password123', description: 'Password' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Registered email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}

export class VerifyEmailDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'token123abc', description: 'Verification token' })
  @IsString()
  @IsNotEmpty()
  token!: string;
}

export class ResendVerificationEmailDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'token123abc', description: 'Reset token' })
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({
    example: 'newPassword123',
    minLength: 8,
    description: 'New password',
  })
  @IsString()
  @MinLength(8)
  password!: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldPassword123', description: 'Current password' })
  @IsString()
  @IsNotEmpty()
  oldPassword!: string;

  @ApiProperty({
    example: 'newPassword123',
    minLength: 8,
    description: 'New password',
  })
  @IsString()
  @MinLength(8)
  newPassword!: string;
}

export class RequestEmailChangeDto {
  @ApiProperty({
    example: 'new.email@example.com',
    description: 'New email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}

export class ChangeEmailDto {
  @ApiProperty({
    example: 'new.email@example.com',
    description: 'New email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'token123abc',
    description: 'Verification token sent to new email',
  })
  @IsString()
  @IsNotEmpty()
  token!: string;
}

export class Verify2FADto {
  @ApiProperty({ example: '123456', description: '6-digit 2FA TOTP code' })
  @IsString()
  @IsNotEmpty()
  token!: string;
}

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John Doe', description: 'Full name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'USA', description: 'Country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: 'California', description: 'State' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: 'San Francisco', description: 'City' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'Avatar URL',
  })
  @IsOptional()
  @IsString()
  image?: string;
}

export class UserProfileResponseDto {
  @ApiProperty({ example: 'usr_123abc', description: 'User ID' })
  id!: string;

  @ApiProperty({ example: 'John Doe', description: 'Full Name' })
  name!: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address',
  })
  email!: string;

  @ApiProperty({ example: true, description: 'Email verification status' })
  emailVerified!: boolean;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Avatar image URL',
  })
  image!: string | null;

  @ApiProperty({ example: 'user', description: 'User role' })
  role!: string;

  @ApiProperty({ example: '+1234567890', description: 'Phone number' })
  phoneNumber!: string | null;

  @ApiProperty({ example: 'USA', description: 'Country' })
  country!: string | null;

  @ApiProperty({
    example: 0,
    description: '2FA status (1 enabled, 0 disabled)',
  })
  isTwoFactorEnabled!: number | null;
}

export class TwoFactorSecretResponseDto {
  @ApiProperty({ example: 'JBSWY3DPEHPK3PXP', description: '2FA Secret Key' })
  secret!: string;

  @ApiProperty({
    example: 'otpauth://totp/App:john.doe@example.com?secret=JBSWY3DPEHPK3PXP',
    description: 'QR Code URI',
  })
  qrCodeUrl!: string;
}
