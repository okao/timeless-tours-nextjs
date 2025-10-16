import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const values = await prisma.companyValue.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        icon: true,
        position: true,
      },
      orderBy: [
        { position: 'asc' },
        { id: 'asc' },
      ],
    });

    return NextResponse.json(values);
  } catch (error) {
    console.error('Error fetching values:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
