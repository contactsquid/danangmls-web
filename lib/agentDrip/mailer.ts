import 'server-only';

import nodemailer from 'nodemailer';

/**
 * Outbound mail for the onboarding drip, over the same Gmail account and app
 * password Supabase Auth already uses for the confirmation emails — so the
 * welcome email arrives from the same sender the agent just saw.
 *
 * Unset SMTP_USER / SMTP_PASS and mail is simply unavailable: callers check
 * isMailerConfigured first and skip, they do not crash.
 */

const USER = process.env.SMTP_USER ?? '';
const PASS = process.env.SMTP_PASS ?? '';

export const isMailerConfigured = Boolean(USER && PASS);

export async function sendMail(msg: {
  to: string;
  subject: string;
  html: string;
  text: string;
  unsubscribeUrl: string;
}): Promise<void> {
  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: USER, pass: PASS },
    connectionTimeout: 10_000,
    socketTimeout: 20_000,
  });

  await transport.sendMail({
    from: { name: 'DanangMLS', address: USER },
    to: msg.to,
    subject: msg.subject,
    html: msg.html,
    text: msg.text,
    headers: {
      // Lets Gmail show its own one-click "Unsubscribe" and keeps us on the
      // right side of Vietnam's anti-spam decree (Nghị định 91/2020/NĐ-CP).
      'List-Unsubscribe': `<${msg.unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  });
}
