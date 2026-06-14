import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    await prisma.visitorLog.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete log:', error);
    return NextResponse.json({ error: 'Failed to delete log entry' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const log = await prisma.visitorLog.update({
      where: { id },
      data: {
        dateTime: data.dateTime ? new Date(data.dateTime) : undefined,
        unitNumber: data.unitNumber,
        visitorName: data.visitorName,
        visitType: data.visitType,
        conciergeName: data.conciergeName,
        comments: data.comments
      }
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error('Failed to update log:', error);
    return NextResponse.json({ error: 'Failed to update log entry' }, { status: 500 });
  }
}
