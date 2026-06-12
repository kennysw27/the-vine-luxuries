import { NextResponse } from 'next/server';

// In production, this would be validated against the database or ENV vars securely
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "VineLuxuries2024";

export async function POST(request) {
  try {
    const { password } = await request.json();
    
    if (password === ADMIN_PASSWORD) {
      // Return a success flag. In a real app, you would return a signed JWT token here
      // and set it in an HttpOnly cookie. For this MVP, we return a success status
      // that the client uses to set sessionStorage.
      return NextResponse.json({ success: true, token: "admin_verified" });
    } else {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
