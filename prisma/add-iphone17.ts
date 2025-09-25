const { PrismaClient } = require('@prisma/client');
const prisma2 = new PrismaClient();

async function createiPhone17Data() {
  try {
    console.log('Starting iPhone 17 data insertion...');

    // First, ensure Apple brand exists
    let appleBrand = await prisma2.brand.findUnique({
      where: { slug: 'apple' }
    });

    if (!appleBrand) {
      appleBrand = await prisma2.brand.create({
        data: {
          name: 'Apple',
          slug: 'apple',
          displayName: 'Apple Inc.',
          description: 'American multinational technology company known for innovative consumer electronics, software, and services.',
          logo: 'https://res.cloudinary.com/dnyuawepb/image/upload/apple-logo.png',
          website: 'https://www.apple.com',
          headquarters: 'Cupertino, California, USA',
          foundedYear: 1976,
          metaTitle: 'Apple - Think Different',
          metaDescription: 'Discover the innovative world of Apple and shop everything iPhone, iPad, Apple Watch, Mac, and Apple TV.',
          isActive: true,
          isVerified: true
        }
      });
      console.log('✅ Created Apple brand');
    } else {
      console.log('✅ Apple brand already exists');
    }

    // Create iPhone 17
    const iphone17 = await prisma2.phone.create({
      data: {
        name: 'iPhone 17',
        slug: 'iphone-17',
        model: 'A3001',
        series: 'iPhone 17 Series',
        status: 'UPCOMING',
        deletedAt:null,
        releaseDate: new Date('2025-09-15'),
        announcedAt: new Date('2025-09-10'),
        description: 'The iPhone 17 represents Apple\'s most advanced smartphone yet, featuring groundbreaking technology, enhanced AI capabilities, and revolutionary design. With its titanium construction, advanced camera system, and powerful A19 Bionic chip, the iPhone 17 sets a new standard for mobile innovation.',
        shortDescription: 'Apple\'s most advanced iPhone with titanium design, A19 Bionic chip, and revolutionary camera system.',
        keyFeatures: [
          'A19 Bionic chip with 3nm+ technology',
          'Titanium aerospace-grade construction',
          'Advanced triple-camera system with 48MP main sensor',
          '6.3-inch Super Retina XDR display with 120Hz ProMotion',
          '5G connectivity with enhanced speed',
          'All-day battery life with fast charging',
          'iOS 19 with advanced AI features',
          'Face ID with enhanced security',
          'MagSafe compatible',
          'IP68 water resistance'
        ],
        launchPrice: 1199.00,
        currentPrice: 1199.00,
        currency: 'USD',
        metaTitle: 'iPhone 17 - Apple\'s Most Advanced iPhone Yet',
        metaDescription: 'Experience the future with iPhone 17. Featuring titanium design, A19 Bionic chip, advanced cameras, and revolutionary AI capabilities.',
        keywords: [
          'iPhone 17',
          'Apple smartphone',
          'A19 Bionic',
          'titanium iPhone',
          '5G phone',
          'advanced camera',
          'iOS 19',
          'premium smartphone'
        ],
        primaryImage: 'https://res.cloudinary.com/dnyuawepb/image/upload/avendre_msgcqi.png',
        videos: [
          'https://www.apple.com/105/media/us/iphone-17/2025/video-intro.mp4',
          'https://www.apple.com/105/media/us/iphone-17/2025/video-features.mp4'
        ],
        isAvailable: true,
        stockStatus: 'limited',
        brandId: appleBrand.id
      }
    });

    console.log('✅ Created iPhone 17');

    // Add Phone Images to Gallery
    const galleryImages = [
      {
        url: 'https://res.cloudinary.com/dnyuawepb/image/upload/black_hmg55b.png',
        description: 'iPhone 17 in Space Black',
        altText: 'iPhone 17 Space Black color variant',
        order: 1
      },
      {
        url: 'https://res.cloudinary.com/dnyuawepb/image/upload/avendre_msgcqi.png',
        description: 'iPhone 17 in Natural Titanium',
        altText: 'iPhone 17 Natural Titanium color variant',
        order: 2
      },
      {
        url: 'https://res.cloudinary.com/dnyuawepb/image/upload/white_un9o2r.png',
        description: 'iPhone 17 in White Titanium',
        altText: 'iPhone 17 White Titanium color variant',
        order: 3
      },
      {
        url: 'https://res.cloudinary.com/dnyuawepb/image/upload/blue_xvipfp.png',
        description: 'iPhone 17 in Blue Titanium',
        altText: 'iPhone 17 Blue Titanium color variant',
        order: 4
      },
      {
        url: 'https://res.cloudinary.com/dnyuawepb/image/upload/sage_ks5ogh.png',
        description: 'iPhone 17 in Green Titanium',
        altText: 'iPhone 17 Green Titanium color variant',
        order: 5
      },
      {
        url: 'https://res.cloudinary.com/dnyuawepb/image/upload/bgimage2png-removebg-preview_2_dp5qsy.png',
        description: 'iPhone 17 Product Shot - Front View',
        altText: 'iPhone 17 front view product photography',
        order: 6
      },
      {
        url: 'https://res.cloudinary.com/dnyuawepb/image/upload/bgimage3-removebg-preview_1_cfkle9.png',
        description: 'iPhone 17 Product Shot - Side View',
        altText: 'iPhone 17 side view showing titanium construction',
        order: 7
      },
      {
        url: 'https://res.cloudinary.com/dnyuawepb/image/upload/Remove_background_project_f17jtk.png',
        description: 'iPhone 17 Product Shot - Back View',
        altText: 'iPhone 17 back view showing camera system',
        order: 8
      }
    ];

    for (const image of galleryImages) {
      await prisma2.phoneImage.create({
        data: {
          ...image,
          phoneId: iphone17.id
        }
      });
    }

    console.log('✅ Added gallery images');

    // Add Phone Colors
    const colors = [
      {
        name: 'Space Black',
        hexCode: '#1C1C1E',
        imageUrl: 'https://res.cloudinary.com/dnyuawepb/image/upload/black_hmg55b.png',
        isDefault: false,
        description: 'Deep space black titanium finish with matte texture'
      },
      {
        name: 'Natural Titanium',
        hexCode: '#A8A8A8',
        imageUrl: 'https://res.cloudinary.com/dnyuawepb/image/upload/avendre_msgcqi.png',
        isDefault: true,
        description: 'Premium natural titanium with brushed finish'
      },
      {
        name: 'White Titanium',
        hexCode: '#F5F5F7',
        imageUrl: 'https://res.cloudinary.com/dnyuawepb/image/upload/white_un9o2r.png',
        isDefault: false,
        description: 'Pure white titanium with elegant matte finish'
      },
      {
        name: 'Blue Titanium',
        hexCode: '#1E3A5F',
        imageUrl: 'https://res.cloudinary.com/dnyuawepb/image/upload/blue_xvipfp.png',
        isDefault: false,
        description: 'Deep blue titanium with premium aerospace finish'
      },
      {
        name: 'Green Titanium',
        hexCode: '#5A6B5D',
        imageUrl: 'https://res.cloudinary.com/dnyuawepb/image/upload/sage_ks5ogh.png',
        isDefault: false,
        description: 'Sage green titanium with sophisticated matte texture'
      }
    ];

    for (let i = 0; i < colors.length; i++) {
      await prisma2.phoneColor.create({
        data: {
          ...colors[i],
          phoneId: iphone17.id,
          priority: i + 1
        }
      });
    }

    console.log('✅ Added phone colors');

    // Add Phone Variants (Storage options)
    const variants = [
      {
        name: '128GB',
        storage: '128GB',
        ram: '8GB',
        price: 1199.00,
        isAvailable: true
      },
      {
        name: '256GB',
        storage: '256GB',
        ram: '8GB',
        price: 1299.00,
        isAvailable: true
      },
      {
        name: '512GB',
        storage: '512GB',
        ram: '8GB',
        price: 1499.00,
        isAvailable: true
      },
      {
        name: '1TB',
        storage: '1TB',
        ram: '8GB',
        price: 1699.00,
        isAvailable: true
      }
    ];

    for (const variant of variants) {
      await prisma2.phoneVariant.create({
        data: {
          ...variant,
          phoneId: iphone17.id
        }
      });
    }

    console.log('✅ Added phone variants');

    // Add Comprehensive Specifications
    const specifications = [
      // Display
      {
        key: 'display_size',
        value: '6.3',
        displayName: 'Screen Size',
        unit: 'inches',
        category: 'DISPLAY',
        description: 'Super Retina XDR display with edge-to-edge design',
        priority: 1,
        isHighlight: true
      },
      {
        key: 'display_resolution',
        value: '2556 x 1179',
        displayName: 'Resolution',
        unit: 'pixels',
        category: 'DISPLAY',
        description: '460 pixels per inch for incredible detail',
        priority: 2,
        isHighlight: false
      },
      {
        key: 'display_technology',
        value: 'Super Retina XDR OLED',
        displayName: 'Display Technology',
        category: 'DISPLAY',
        description: 'Advanced OLED technology with HDR10 and Dolby Vision',
        priority: 3,
        isHighlight: true
      },
      {
        key: 'refresh_rate',
        value: '120Hz',
        displayName: 'Refresh Rate',
        unit: 'Hz',
        category: 'DISPLAY',
        description: 'ProMotion technology with adaptive refresh rates up to 120Hz',
        priority: 4,
        isHighlight: true
      },
      {
        key: 'brightness',
        value: '2000',
        displayName: 'Peak Brightness',
        unit: 'nits',
        category: 'DISPLAY',
        description: 'Incredible brightness for outdoor visibility',
        priority: 5,
        isHighlight: false
      },

      // Performance
      {
        key: 'processor',
        value: 'A19 Bionic',
        displayName: 'Processor',
        category: 'PERFORMANCE',
        description: '3-nanometer technology with 16-core Neural Engine',
        priority: 1,
        isHighlight: true
      },
      {
        key: 'ram',
        value: '8GB',
        displayName: 'Memory',
        unit: 'GB',
        category: 'PERFORMANCE',
        description: 'High-performance unified memory architecture',
        priority: 2,
        isHighlight: true
      },
      {
        key: 'storage_options',
        value: '128GB, 256GB, 512GB, 1TB',
        displayName: 'Storage Options',
        category: 'PERFORMANCE',
        description: 'Fast NVMe storage with advanced encryption',
        priority: 3,
        isHighlight: false
      },

      // Camera
      {
        key: 'main_camera',
        value: '48MP',
        displayName: 'Main Camera',
        unit: 'MP',
        category: 'CAMERA',
        description: 'Advanced dual-camera system with 2x Telephoto',
        priority: 1,
        isHighlight: true
      },
      {
        key: 'ultra_wide_camera',
        value: '12MP',
        displayName: 'Ultra Wide Camera',
        unit: 'MP',
        category: 'CAMERA',
        description: '120° field of view with macro photography',
        priority: 2,
        isHighlight: false
      },
      {
        key: 'front_camera',
        value: '12MP',
        displayName: 'Front Camera',
        unit: 'MP',
        category: 'CAMERA',
        description: 'TrueDepth camera with autofocus',
        priority: 3,
        isHighlight: false
      },
      {
        key: 'video_recording',
        value: '4K ProRes, 8K',
        displayName: 'Video Recording',
        category: 'CAMERA',
        description: 'Cinematic mode, Action mode, and ProRes recording',
        priority: 4,
        isHighlight: true
      },

      // Battery
      {
        key: 'battery_capacity',
        value: '3877',
        displayName: 'Battery Capacity',
        unit: 'mAh',
        category: 'BATTERY',
        description: 'All-day battery life with intelligent power management',
        priority: 1,
        isHighlight: true
      },
      {
        key: 'wireless_charging',
        value: '25W MagSafe, 15W Qi',
        displayName: 'Wireless Charging',
        unit: 'W',
        category: 'BATTERY',
        description: 'Fast wireless charging with MagSafe technology',
        priority: 2,
        isHighlight: false
      },
      {
        key: 'wired_charging',
        value: '30W',
        displayName: 'Wired Charging',
        unit: 'W',
        category: 'BATTERY',
        description: 'USB-C fast charging with Power Delivery',
        priority: 3,
        isHighlight: false
      },

      // Connectivity
      {
        key: 'cellular',
        value: '5G (sub-6 GHz and mmWave)',
        displayName: '5G',
        category: 'CONNECTIVITY',
        description: 'Advanced 5G connectivity with global roaming',
        priority: 1,
        isHighlight: true
      },
      {
        key: 'wifi',
        value: 'Wi-Fi 7',
        displayName: 'Wi-Fi',
        category: 'CONNECTIVITY',
        description: '802.11be Wi-Fi 7 with 2x2 MIMO',
        priority: 2,
        isHighlight: false
      },
      {
        key: 'bluetooth',
        value: '5.4',
        displayName: 'Bluetooth',
        category: 'CONNECTIVITY',
        description: 'Enhanced connectivity with low power consumption',
        priority: 3,
        isHighlight: false
      },
      {
        key: 'port',
        value: 'USB-C',
        displayName: 'Charging Port',
        category: 'CONNECTIVITY',
        description: 'USB-C with Thunderbolt 4 support',
        priority: 4,
        isHighlight: true
      },

      // Build
      {
        key: 'materials',
        value: 'Titanium frame, Ceramic Shield front',
        displayName: 'Materials',
        category: 'BUILD',
        description: 'Aerospace-grade titanium with Ceramic Shield',
        priority: 1,
        isHighlight: true
      },
      {
        key: 'dimensions',
        value: '147.6 × 71.6 × 8.25',
        displayName: 'Dimensions',
        unit: 'mm',
        category: 'BUILD',
        description: 'Precision-crafted titanium design',
        priority: 2,
        isHighlight: false
      },
      {
        key: 'weight',
        value: '201',
        displayName: 'Weight',
        unit: 'g',
        category: 'BUILD',
        description: 'Lightweight titanium construction',
        priority: 3,
        isHighlight: false
      },
      {
        key: 'water_resistance',
        value: 'IP68',
        displayName: 'Water Resistance',
        category: 'BUILD',
        description: 'Water resistant up to 6 meters for up to 30 minutes',
        priority: 4,
        isHighlight: true
      },

      // Software
      {
        key: 'operating_system',
        value: 'iOS 19',
        displayName: 'Operating System',
        category: 'SOFTWARE',
        description: 'Latest iOS with advanced AI features and enhanced privacy',
        priority: 1,
        isHighlight: true
      },
      {
        key: 'security',
        value: 'Face ID, Secure Enclave',
        displayName: 'Security',
        category: 'SOFTWARE',
        description: 'Advanced facial recognition with privacy protection',
        priority: 2,
        isHighlight: true
      },

      // Audio
      {
        key: 'speakers',
        value: 'Stereo speakers',
        displayName: 'Speakers',
        category: 'AUDIO',
        description: 'Spatial audio playback with Dolby Atmos',
        priority: 1,
        isHighlight: false
      },
      {
        key: 'microphones',
        value: '3-mic array',
        displayName: 'Microphones',
        category: 'AUDIO',
        description: 'Studio-quality microphones with noise reduction',
        priority: 2,
        isHighlight: false
      },

      // Sensors
      {
        key: 'sensors',
        value: 'Face ID, LiDAR, Gyroscope, Accelerometer, Proximity, Ambient light',
        displayName: 'Sensors',
        category: 'SENSORS',
        description: 'Advanced sensor array for enhanced functionality',
        priority: 1,
        isHighlight: false
      }
    ];

    for (const spec of specifications) {
      await prisma2.phoneSpecification.create({
        data: {
          ...spec,
          phoneId: iphone17.id
        }
      });
    }

    console.log('✅ Added comprehensive specifications');

    console.log(`\n🎉 Successfully created iPhone 17 data!`);
    console.log(`📱 Phone ID: ${iphone17.id}`);
    console.log(`🏢 Brand: ${appleBrand.name}`);
    console.log(`🎨 Colors: 5 titanium finishes`);
    console.log(`💾 Variants: 4 storage options`);
    console.log(`📸 Gallery: 8 product images`);
    console.log(`📋 Specifications: ${specifications.length} detailed specs`);

  } catch (error) {
    console.error('❌ Error creating iPhone 17 data:', error);
    throw error;
  } finally {
    await prisma2.$disconnect();
  }
}

// Execute the function
createiPhone17Data()
  .then(() => {
    console.log('✅ iPhone 17 data insertion completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed to insert iPhone 17 data:', error);
    process.exit(1);
  });