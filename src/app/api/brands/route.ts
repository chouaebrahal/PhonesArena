import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        phones: {
          include: {
            images: true,
          },
        },
      },
    });
    
    // Transform brands to include image information
    const brandsWithImages = brands.map(brand => {
      // Find the first phone with an image, or use a default
      const firstPhoneWithImage = brand.phones.find(phone => phone.images.length > 0) || null;
      const firstImage = firstPhoneWithImage ? firstPhoneWithImage.images[0] : null;
      
      return {
        ...brand,
        image: firstImage ? {
          sourceUrl: firstImage.url,
          altText: `${brand.name} phone`
        } : {
          sourceUrl: '/images/default-brand.png',
          altText: `${brand.name} logo`
        }
      };
    });
    
    return NextResponse.json(brandsWithImages);
  } catch (error) {
    console.error('Error fetching brands:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}