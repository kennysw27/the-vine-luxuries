import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const formData = await request.formData();

    // Parse the application data JSON
    const applicationDataRaw = formData.get('applicationData');
    if (!applicationDataRaw) {
      return NextResponse.json({ success: false, error: 'Missing application data' }, { status: 400 });
    }
    const data = JSON.parse(applicationDataRaw);

    // Get file attachments
    const pdfFile = formData.get('applicationPdf');
    const resumeFile = formData.get('resume');

    // Build nodemailer attachments array
    const attachments = [];

    if (pdfFile && pdfFile.size > 0) {
      const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
      attachments.push({
        filename: pdfFile.name || `The-Vine-Luxuries-Employment-Application-${data.fullName.replace(/\s+/g, '-')}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      });
    }

    if (resumeFile && resumeFile.size > 0) {
      const resumeBuffer = Buffer.from(await resumeFile.arrayBuffer());
      attachments.push({
        filename: resumeFile.name || 'Resume',
        content: resumeBuffer,
      });
    }

    // Configure SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email with attachments
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.SMTP_TO || 'inquiries@thevineluxuries.com',
      subject: `New Employment Application - The Vine Luxuries LLC - ${data.fullName}`,
      text: `A new employment application has been submitted through The Vine Luxuries LLC website.\n\nThe completed application PDF and any uploaded resume are attached.\n\n--- Quick Summary ---\nApplicant: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone}\nPosition: ${data.position}\nSubmitted: ${new Date().toLocaleString()}\n`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0f1e3c; padding: 20px; text-align: center;">
            <h1 style="color: #d4af37; margin: 0; font-size: 22px;">THE VINE LUXURIES</h1>
            <p style="color: #ccc; margin: 5px 0 0 0; font-style: italic; font-size: 12px;">Where Excellence Meets Hospitality</p>
          </div>
          <div style="padding: 25px; background: #fff; border: 1px solid #eee;">
            <h2 style="color: #0f1e3c; margin-top: 0;">New Employment Application</h2>
            <p>A new employment application has been submitted through The Vine Luxuries LLC website.</p>
            <p>The completed application PDF${resumeFile && resumeFile.size > 0 ? ' and uploaded resume are' : ' is'} attached to this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Applicant:</td><td style="padding: 8px 0;">${data.fullName}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td><td style="padding: 8px 0;">${data.email}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td><td style="padding: 8px 0;">${data.phone}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Position:</td><td style="padding: 8px 0;">${data.position}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Resume:</td><td style="padding: 8px 0;">${resumeFile && resumeFile.size > 0 ? '✅ Attached' : '❌ Not uploaded'}</td></tr>
            </table>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #888; font-size: 12px;">Submitted: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
      attachments,
    });

    // Save to database
    try {
      await prisma.jobApplication.create({
        data: {
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zip: data.zip || '',
          authorized: data.authorized,
          eighteenPlus: data.eighteenPlus,
          position: data.position,
          heardAbout: data.heardAbout || '',
          desiredPay: data.desiredPay || '',
          shift1: data.shift1,
          shift2: data.shift2,
          shift3: data.shift3,
          holidays: data.holidays,
          overnights: data.overnights,
          transportation: data.transportation,
          recentCompany: data.recentEmployer || '',
          recentPosition: data.recentPosition || '',
          recentDates: data.recentDates || '',
          recentLeaving: data.recentLeaving || '',
          prevCompany: data.prevCompany || '',
          prevPosition: data.prevPosition || '',
          prevDates: data.prevDates || '',
          prevLeaving: data.prevLeaving || '',
          priorExperience: data.priorExperience || '',
          experienceDescription: data.experienceDescription || '',
          skills: data.skills || '',
          bilingualLanguages: data.bilingualLanguages || '',
          backgroundCheck: data.backgroundCheck,
          certification: data.certification,
        },
      });
    } catch (dbErr) {
      console.error('Database save error (non-fatal):', dbErr);
      // Don't fail the whole request if DB save fails
    }

    return NextResponse.json({ success: true, message: 'Application submitted successfully.' });
  } catch (error) {
    console.error('Submit application error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process application. Please try again.' },
      { status: 500 }
    );
  }
}
