import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await prisma.visitorLog.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete log:', error);
    return NextResponse.json({ error: 'Failed to delete log entry' }, { status: 500 });
  }
}
