import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const consultation = await prisma.consultation.update({
      where: { id },
      data: { status: data.status },
    });

    return NextResponse.json(consultation);
  } catch (error) {
    console.error('Failed to update consultation:', error);
    return NextResponse.json({ error: 'Failed to update consultation' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.consultation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete consultation:', error);
    return NextResponse.json({ error: 'Failed to delete consultation' }, { status: 500 });
  }
}
