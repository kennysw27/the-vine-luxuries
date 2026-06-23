import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const applications = await prisma.jobApplication.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(applications);
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    const application = await prisma.jobApplication.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        authorized: data.authorized,
        eighteenPlus: data.eighteenPlus,
        position: data.position,
        heardAbout: data.heardAbout || null,
        desiredPay: data.desiredPay || null,
        shift1: data.shift1 || null,
        shift2: data.shift2 || null,
        shift3: data.shift3 || null,
        holidays: data.holidays || null,
        overnights: data.overnights || null,
        transportation: data.transportation || null,
        recentCompany: data.recentCompany || null,
        recentPosition: data.recentPosition || null,
        recentDates: data.recentDates || null,
        recentLeaving: data.recentLeaving || null,
        prevCompany: data.prevCompany || null,
        prevPosition: data.prevPosition || null,
        prevDates: data.prevDates || null,
        prevLeaving: data.prevLeaving || null,
        priorExperience: data.priorExperience || null,
        experienceDescription: data.experienceDescription || null,
        skills: data.skills || null,
        bilingualLanguages: data.bilingualLanguages || null,
        backgroundCheck: data.backgroundCheck === true || data.backgroundCheck === 'agreed',
        certification: data.certification === true || data.certification === 'certified',
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Failed to save application:', error);
    return NextResponse.json({ error: 'Failed to save application' }, { status: 500 });
  }
}
