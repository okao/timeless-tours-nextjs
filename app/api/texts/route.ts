import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { keys, lang } = body as { keys: string[]; lang?: string };
    const langCode = lang || 'en';

    if (!Array.isArray(keys) || keys.length === 0) {
      return NextResponse.json({ error: 'keys array required' }, { status: 400 });
    }

    const texts = await prisma.text.findMany({
      where: {
        key: {
          in: keys,
        },
      },
      include: {
        values: {
          where: {
            langCode: {
              in: [langCode, 'en'],
            },
          },
          select: {
            langCode: true,
            value: true,
          },
        },
      },
    });

    const result: Record<string, string> = {};

    for (const text of texts) {
      // Find the best language match
      const preferredTranslation = text.values.find(t => t.langCode === langCode);
      const fallbackTranslation = text.values.find(t => t.langCode === 'en');
      const selectedTranslation = preferredTranslation || fallbackTranslation;

      if (selectedTranslation) {
        result[text.key] = selectedTranslation.value;
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching texts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
