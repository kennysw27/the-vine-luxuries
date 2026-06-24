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

    // Convert files to Base64 for database storage
    let applicationPdfBase64 = null;
    if (pdfFile && pdfFile.size > 0) {
      const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
      applicationPdfBase64 = `data:application/pdf;base64,${pdfBuffer.toString('base64')}`;
    }

    let resumeFileBase64 = null;
    if (resumeFile && resumeFile.size > 0) {
      const resumeBuffer = Buffer.from(await resumeFile.arrayBuffer());
      const ext = resumeFile.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 
                  resumeFile.name.toLowerCase().endsWith('.doc') ? 'application/msword' : 
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      resumeFileBase64 = `data:${ext};base64,${resumeBuffer.toString('base64')}`;
    }

    // --- STEP 1: Save to database (always runs) ---
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
          applicationPdfBase64,
          resumeFileBase64,
        },
      });
    } catch (dbErr) {
      console.error('Database save error (non-fatal):', dbErr);
    }

    // --- STEP 2: Send email notification ---
    const hasSmtp = process.env.SMTP_USER && process.env.SMTP_PASS;
    const hasResume = resumeFile && resumeFile.size > 0;

    if (hasSmtp) {
      // SMTP is configured — send full email with PDF + resume attachments
      try {
        const attachments = [];

        if (pdfFile && pdfFile.size > 0) {
          const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
          attachments.push({
            filename: pdfFile.name || `The-Vine-Luxuries-Employment-Application-${data.fullName.replace(/\s+/g, '-')}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          });
        }

        if (hasResume) {
          const resumeBuffer = Buffer.from(await resumeFile.arrayBuffer());
          attachments.push({
            filename: resumeFile.name || 'Resume',
            content: resumeBuffer,
          });
        }

        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
          connectionTimeout: 5000, // 5 seconds max to connect
          greetingTimeout: 5000,
          socketTimeout: 5000,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: process.env.SMTP_TO || 'inquiries@thevineluxuries.com',
          subject: `New Employment Application - The Vine Luxuries LLC - ${data.fullName}`,
          html: buildEmailHtml(data, hasResume),
          attachments,
        });
      } catch (smtpErr) {
        console.error('SMTP email error, falling back to FormSubmit:', smtpErr);
        // Fall back to FormSubmit if SMTP fails
        await sendFormSubmitFallback(data, hasResume, smtpErr.message);
      }
    } else {
      // No SMTP configured — use FormSubmit with full form data in email body
      await sendFormSubmitFallback(data, hasResume, 'SMTP not configured');
    }

    return NextResponse.json({ success: true, message: 'Application submitted successfully.' });
  } catch (error) {
    console.error('Submit application error:', error);
    return NextResponse.json(
      { success: false, error: `Failed to process application: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// --- FormSubmit fallback (no attachments, but includes all data in email body) ---
async function sendFormSubmitFallback(data, hasResume, smtpErrorMsg = '') {
  try {
    const res = await fetch('https://formsubmit.co/ajax/inquiries@thevineluxuries.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        _subject: `New Employment Application - The Vine Luxuries LLC - ${data.fullName}`,
        _template: 'table',
        '0. SMTP ERROR (Admin Only)': smtpErrorMsg || 'None',
        '1. Full Name': data.fullName,
        '2. Phone': data.phone,
        '3. Email': data.email,
        '4. Address': `${data.address}, ${data.city}, ${data.state} ${data.zip}`,
        '5. Authorized to Work in US': data.authorized,
        '6. 18 or Older': data.eighteenPlus,
        '7. Position Applying For': data.position,
        '8. How Heard About Us': data.heardAbout || '-',
        '9. Desired Pay': data.desiredPay || '-',
        '10. 1st Shift Availability': data.shift1,
        '11. 2nd Shift Availability': data.shift2,
        '12. 3rd Shift Availability': data.shift3,
        '13. Holidays': data.holidays,
        '14. Overnights': data.overnights,
        '15. Transportation': data.transportation,
        '16. Recent Employer': data.recentEmployer || '-',
        '17. Recent Position': data.recentPosition || '-',
        '18. Recent Dates': data.recentDates || '-',
        '19. Recent Reason for Leaving': data.recentLeaving || '-',
        '20. Previous Employer': data.prevCompany || '-',
        '21. Previous Position': data.prevPosition || '-',
        '22. Previous Dates': data.prevDates || '-',
        '23. Previous Reason for Leaving': data.prevLeaving || '-',
        '24. Prior Hospitality Experience': data.priorExperience || '-',
        '25. Experience Description': data.experienceDescription || '-',
        '26. Skills': data.skills || 'None selected',
        '27. Bilingual Languages': data.bilingualLanguages || '-',
        '28. Background Check Consent': data.backgroundCheck ? 'Agreed' : 'Not Agreed',
        '29. Certification': data.certification ? 'Certified' : 'Not Certified',
        '30. Resume Uploaded': hasResume ? 'Yes (see admin dashboard for full details)' : 'No',
      }),
    });
    const result = await res.json();
    if (result.success === 'false') {
      console.error('FormSubmit fallback error:', result.message);
    }
  } catch (err) {
    console.error('FormSubmit fallback error:', err);
  }
}

// --- Branded HTML email template ---
function buildEmailHtml(data, hasResume) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto;">
      <div style="background: #0f1e3c; padding: 20px; text-align: center;">
        <h1 style="color: #d4af37; margin: 0; font-size: 22px;">THE VINE LUXURIES</h1>
        <p style="color: #ccc; margin: 5px 0 0 0; font-style: italic; font-size: 12px;">Where Excellence Meets Hospitality</p>
      </div>
      <div style="padding: 25px; background: #fff; border: 1px solid #eee;">
        <h2 style="color: #0f1e3c; margin-top: 0;">New Employment Application</h2>
        <p>A new employment application has been submitted through The Vine Luxuries LLC website. The completed application PDF${hasResume ? ' and uploaded resume are' : ' is'} attached to this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        
        <h3 style="color: #d4af37; font-size: 14px; margin-bottom: 10px;">PERSONAL INFORMATION</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555; width: 180px;">Full Name:</td><td style="padding: 6px 0;">${data.fullName}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Phone:</td><td style="padding: 6px 0;">${data.phone}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Email:</td><td style="padding: 6px 0;">${data.email}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Address:</td><td style="padding: 6px 0;">${data.address}, ${data.city}, ${data.state} ${data.zip}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Authorized to Work:</td><td style="padding: 6px 0;">${data.authorized}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">18 or Older:</td><td style="padding: 6px 0;">${data.eighteenPlus}</td></tr>
        </table>

        <h3 style="color: #d4af37; font-size: 14px; margin-bottom: 10px;">POSITION INFORMATION</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555; width: 180px;">Position:</td><td style="padding: 6px 0;">${data.position}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">How Heard About Us:</td><td style="padding: 6px 0;">${data.heardAbout || '-'}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Desired Pay:</td><td style="padding: 6px 0;">${data.desiredPay || '-'}</td></tr>
        </table>

        <h3 style="color: #d4af37; font-size: 14px; margin-bottom: 10px;">AVAILABILITY</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555; width: 180px;">1st Shift (7AM-3PM):</td><td style="padding: 6px 0;">${data.shift1}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">2nd Shift (3PM-11PM):</td><td style="padding: 6px 0;">${data.shift2}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">3rd Shift (11PM-7AM):</td><td style="padding: 6px 0;">${data.shift3}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Holidays:</td><td style="padding: 6px 0;">${data.holidays}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Overnights:</td><td style="padding: 6px 0;">${data.overnights}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Transportation:</td><td style="padding: 6px 0;">${data.transportation}</td></tr>
        </table>

        <h3 style="color: #d4af37; font-size: 14px; margin-bottom: 10px;">WORK EXPERIENCE</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555; width: 180px;">Recent Employer:</td><td style="padding: 6px 0;">${data.recentEmployer || '-'}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Recent Position:</td><td style="padding: 6px 0;">${data.recentPosition || '-'}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Recent Dates:</td><td style="padding: 6px 0;">${data.recentDates || '-'}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Reason for Leaving:</td><td style="padding: 6px 0;">${data.recentLeaving || '-'}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Previous Employer:</td><td style="padding: 6px 0;">${data.prevCompany || '-'}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Previous Position:</td><td style="padding: 6px 0;">${data.prevPosition || '-'}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Previous Dates:</td><td style="padding: 6px 0;">${data.prevDates || '-'}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Reason for Leaving:</td><td style="padding: 6px 0;">${data.prevLeaving || '-'}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Prior Hospitality Exp:</td><td style="padding: 6px 0;">${data.priorExperience === 'Yes' ? data.experienceDescription : 'No'}</td></tr>
        </table>

        <h3 style="color: #d4af37; font-size: 14px; margin-bottom: 10px;">SKILLS & QUALIFICATIONS</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555; width: 180px;">Skills:</td><td style="padding: 6px 0;">${data.skills || 'None selected'}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Bilingual:</td><td style="padding: 6px 0;">${data.bilingualLanguages || '-'}</td></tr>
        </table>

        <h3 style="color: #d4af37; font-size: 14px; margin-bottom: 10px;">AUTHORIZATIONS</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555; width: 180px;">Background Check:</td><td style="padding: 6px 0;">${data.backgroundCheck ? '✅ Agreed' : '❌ Not Agreed'}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Certification:</td><td style="padding: 6px 0;">${data.certification ? '✅ Certified' : '❌ Not Certified'}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Resume Uploaded:</td><td style="padding: 6px 0;">${hasResume ? '✅ Attached' : '❌ Not uploaded'}</td></tr>
        </table>

        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #888; font-size: 12px;">Submitted: ${new Date().toLocaleString()}</p>
      </div>
    </div>
  `;
}
