import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        question: true,
        answer: true,
        position: true,
      },
      orderBy: [
        { position: 'asc' },
        { id: 'asc' },
      ],
    });

    return NextResponse.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
