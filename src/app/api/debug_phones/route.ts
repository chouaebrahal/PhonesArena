import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Debugging phones API...');

    // Check database connection
    await prisma.$connect();
    console.log('✅ Database connected');

    // Count all phones (including soft deleted)
    const totalPhones = await prisma.phone.count();
    console.log(`📱 Total phones in DB: ${totalPhones}`);

    // Count active phones
    const activePhones = await prisma.phone.count({
      where: {
        deletedAt: null,
      }
    });
    console.log(`✅ Active phones (not deleted): ${activePhones}`);

    // Count by status
    const phonesByStatus = await prisma.phone.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });
    console.log('📊 Phones by status:', phonesByStatus);

    // Get first 5 phones with minimal data to see structure
    const samplePhones = await prisma.phone.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        deletedAt: true,
        createdAt: true,
        brandId: true,
      },
    });
    console.log('📋 Sample phones:', samplePhones);

    // Check brands
    const brandCount = await prisma.brand.count();
    const sampleBrands = await prisma.brand.findMany({
      take: 3,
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        deletedAt: true,
      },
    });
    console.log(`🏢 Total brands: ${brandCount}`);
    console.log('🏢 Sample brands:', sampleBrands);

    // Test the exact query from your phones API
    const apiQuery = await prisma.phone.findMany({
      where: {
        deletedAt: null, // This might be the issue
      },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
            displayName: true,
            logo: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });
    console.log(`🔎 API query result count: ${apiQuery.length}`);

    return NextResponse.json({
      success: true,
      debug: {
        totalPhones,
        activePhones,
        brandCount,
        phonesByStatus,
        samplePhones,
        sampleBrands,
        apiQueryCount: apiQuery.length,
        apiQuerySample: apiQuery.slice(0, 2), // First 2 results
      },
      message: 'Check your server console for detailed logs',
    });

  } catch (error:any) {
    console.error('❌ Debug error:', error);
    return NextResponse.json({
      success: false,
      error: 'Debug failed',
      details: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}

// Also add a simple version without any filters
export async function POST() {
  try {
    console.log('🔍 Simple query without filters...');
    
    const allPhones = await prisma.phone.findMany({
      take: 5,
    });
    
    console.log('📱 Simple query result:', allPhones.length, 'phones found');
    
    return NextResponse.json({
      success: true,
      count: allPhones.length,
      phones: allPhones,
    });
    
  } catch (error:any) {
    console.error('❌ Simple query error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
