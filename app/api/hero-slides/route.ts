import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const heroSlides = await prisma.heroSlide.findMany({
      select: {
        id: true,
        image: true,
        position: true,
      },
      orderBy: [
        { position: 'asc' },
        { id: 'asc' },
      ],
    });

    return NextResponse.json(heroSlides);
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
