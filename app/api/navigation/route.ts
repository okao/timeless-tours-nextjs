import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const langCode = (searchParams.get('lang') as string) || 'en';

    const navigationItems = await prisma.navigation.findMany({
      select: {
        id: true,
        key: true,
        path: true,
        position: true,
        isCta: true,
        i18n: {
          where: {
            langCode: {
              in: [langCode, 'en'],
            },
          },
          select: {
            langCode: true,
            label: true,
          },
        },
      },
      orderBy: [
        { position: 'asc' },
        { id: 'asc' },
      ],
    });

    const data = navigationItems.map((item) => {
      // Find the best language match
      const preferredTranslation = item.i18n.find(i => i.langCode === langCode);
      const fallbackTranslation = item.i18n.find(i => i.langCode === 'en');
      const selectedTranslation = preferredTranslation || fallbackTranslation;

      return {
        key: item.key,
        path: item.path,
        position: item.position,
        isCta: item.isCta,
        label: selectedTranslation?.label || null,
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
