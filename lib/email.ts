import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { promises as fs } from 'fs';
import path from 'path';

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

// 이메일 템플릿 디렉토리
const TEMPLATES_DIR = path.join(process.cwd(), 'emails');

// Ethereal Email 계정 생성
async function createTestAccount() {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

// 실제 SMTP 서버 설정
function createSmtpTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// 이메일 전송기 설정
let transporter: nodemailer.Transporter;

export async function sendEmail({ to, subject, template, data }: EmailOptions) {
  try {
    // 개발 환경에서는 항상 Ethereal 사용
    if (!transporter) {
      if (process.env.NODE_ENV === 'production' && process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        transporter = createSmtpTransport();
        console.log('Using real SMTP server');
      } else {
        transporter = await createTestAccount();
        console.log('Using Ethereal Email for testing');
      }
    }

    // 템플릿 파일 읽기
    const templatePath = path.join(TEMPLATES_DIR, `${template}.tsx`);
    const templateContent = await fs.readFile(templatePath, 'utf-8');

    // 템플릿 렌더링 (동기적으로 처리)
    const html = render(templateContent, data);

    // 이메일 전송
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"DigiSafe" <noreply@digisafe.com>',
      to,
      subject,
      html: html.toString(), // 문자열로 변환
    });

    // Ethereal을 사용하는 경우 미리보기 URL 출력
    if (process.env.NODE_ENV === 'development' && !process.env.SMTP_HOST) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
} 