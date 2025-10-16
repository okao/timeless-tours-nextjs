import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const faqTopics = await prisma.faqTopic.findMany({
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

    return NextResponse.json(faqTopics);
  } catch (error) {
    console.error('Error fetching FAQ topics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
