import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build the query
    let query = {
      orderBy: { dateTime: 'desc' },
      where: {}
    };

    const unitNumber = searchParams.get('unitNumber');
    if (unitNumber) {
      query.where.unitNumber = { contains: unitNumber };
    }

    const visitorName = searchParams.get('visitorName');
    if (visitorName) {
      query.where.visitorName = { contains: visitorName };
    }

    const visitType = searchParams.get('visitType');
    if (visitType && visitType !== 'All') {
      query.where.visitType = visitType;
    }

    const conciergeName = searchParams.get('conciergeName');
    if (conciergeName) {
      query.where.conciergeName = { contains: conciergeName };
    }

    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (startDate || endDate) {
      query.where.dateTime = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query.where.dateTime.gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.where.dateTime.lte = end;
      }
    }

    console.log('DEBUG DATABASE_URL:', process.env.DATABASE_URL);
    console.log('DEBUG typeof DATABASE_URL:', typeof process.env.DATABASE_URL);

    const logs = await prisma.visitorLog.findMany(query);
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Failed to fetch logs:', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    const log = await prisma.visitorLog.create({
      data: {
        dateTime: new Date(data.dateTime || Date.now()),
        unitNumber: data.unitNumber,
        visitorName: data.visitorName,
        visitType: data.visitType,
        conciergeName: data.conciergeName,
        comments: data.comments || null
      }
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error('Failed to create log:', error);
    return NextResponse.json({ error: 'Failed to create log entry' }, { status: 500 });
  }
}
