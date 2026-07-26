import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import * as path from 'path';

export interface ISendMailOptions {
  to: string | string[];
  subject: string;
  template: string;
  context?: Record<string, unknown>;
  from?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private readonly templateDir = path.join(__dirname, 'templates');

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('email.host'),
      port: this.configService.get<number>('email.port'),
      secure: this.configService.get<boolean>('email.secure'),
      auth: this.configService.get<string>('email.username')
        ? {
            user: this.configService.get<string>('email.username'),
            pass: this.configService.get<string>('email.password'),
          }
        : undefined,
    });
  }

  async send(options: ISendMailOptions): Promise<void> {
    try {
      let html = '';
      if (options.template) {
        const templatePath = path.join(
          this.templateDir,
          `${options.template}.ejs`,
        );
        html = await ejs.renderFile(templatePath, options.context || {});
      }

      const defaultFrom = `"${this.configService.get<string>('email.fromName')}" <${this.configService.get<string>('email.fromAddress')}>`;

      const info = (await this.transporter.sendMail({
        from: options.from || defaultFrom,
        to: options.to,
        subject: options.subject,
        html,
      })) as { messageId?: string };

      this.logger.log(`Email sent: ${info.messageId || ''}`);
    } catch (error) {
      const recipient = Array.isArray(options.to)
        ? options.to.join(', ')
        : options.to;
      this.logger.error(`Error sending email to ${recipient}`, error);
      throw error;
    }
  }
}
