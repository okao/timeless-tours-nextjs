import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const langCode = (searchParams.get('lang') as string) || 'en';

    const tours = await prisma.tour.findMany({
      select: {
        id: true,
        destination: true,
        duration: true,
        price: true,
        type: true,
        image: true,
        i18n: {
          where: {
            langCode: {
              in: [langCode, 'en'],
            },
          },
          select: {
            langCode: true,
            title: true,
            shortDescription: true,
            fullDescription: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    const data = tours.map((tour) => {
      // Find the best language match
      const preferredTranslation = tour.i18n.find(i => i.langCode === langCode);
      const fallbackTranslation = tour.i18n.find(i => i.langCode === 'en');
      const selectedTranslation = preferredTranslation || fallbackTranslation;

      return {
        id: tour.id,
        destination: tour.destination,
        duration: tour.duration,
        price: tour.price,
        type: tour.type,
        image: tour.image,
        title: selectedTranslation?.title || null,
        shortDescription: selectedTranslation?.shortDescription || null,
        fullDescription: selectedTranslation?.fullDescription || null,
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching tours:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
