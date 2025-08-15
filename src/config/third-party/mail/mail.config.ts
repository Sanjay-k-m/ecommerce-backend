import { mailValidateEnv, MailEnvConfig } from './mail.config.validation';

const validatedEnv: MailEnvConfig = mailValidateEnv(process.env);

export const mailConfig = () => ({
  host: validatedEnv.MAIL_HOST,
  port: validatedEnv.MAIL_PORT,
  secure: validatedEnv.MAIL_SECURE,
  auth: {
    user: validatedEnv.MAIL_USER,
    pass: validatedEnv.MAIL_PASS,
  },
});

export const mailFrom = () => validatedEnv.MAIL_FROM;
