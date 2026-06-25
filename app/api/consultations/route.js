import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const consultations = await prisma.consultation.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(consultations);
  } catch (error) {
    console.error('Failed to fetch consultations:', error);
    return NextResponse.json({ error: 'Failed to fetch consultations' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    const consultation = await prisma.consultation.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        propertyName: data.propertyName,
        propertyType: data.propertyType,
        message: data.message,
        pdfBase64: data.pdfBase64 || null,
      },
    });

    return NextResponse.json(consultation, { status: 201 });
  } catch (error) {
    console.error('Failed to save consultation:', error);
    return NextResponse.json({ error: 'Failed to save consultation' }, { status: 500 });
  }
}
