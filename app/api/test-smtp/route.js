import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        access_key: '222b5440-6fe3-45e4-bdec-5f9bcd39b159',
        subject: 'TEST - Email Notifications Are Working!',
        from_name: 'The Vine Luxuries Applications',
        'Full Name': 'Test Applicant',
        'Email': 'test@example.com',
        'Phone': '555-123-4567',
        'Position': 'Front Desk Concierge',
        'Message': 'If you received this email, application notifications are working correctly! You can delete this test.',
      }),
    });

    const data = await res.json();
    return NextResponse.json({ 
      success: data.success, 
      message: data.message || 'Check your inbox!',
      web3formsResponse: data 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
