import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'inquiries@thevineluxuries.com',
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
    });

    await transporter.verify();
    
    await transporter.sendMail({
      from: 'inquiries@thevineluxuries.com',
      to: 'inquiries@thevineluxuries.com',
      subject: 'Test Email from Server',
      text: 'This is a test email.',
    });

    return NextResponse.json({ success: true, message: 'SMTP is working perfectly!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
  }
}
