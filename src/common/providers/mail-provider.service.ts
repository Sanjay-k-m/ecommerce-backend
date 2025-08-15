/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { mailConfig, mailFrom } from 'src/config';

@Injectable()
export class MailService {
  private transporter;
  private mailFrom;

  constructor() {
    this.mailFrom = mailFrom();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.transporter = nodemailer.createTransport(mailConfig());
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await this.transporter.sendMail({
        from: `"Your App" <${this.mailFrom}>`,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Mail sending error:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
