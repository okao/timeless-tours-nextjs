import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const languages = await prisma.language.findMany({
      select: {
        code: true,
        name: true,
      },
      orderBy: {
        code: 'asc',
      },
    });

    return NextResponse.json(languages);
  } catch (error) {
    console.error('Error fetching languages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
