import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('phonesProject');

    // Create Brand
    const apple = {
      name: 'Apple',
      slug: 'apple',
      logo: 'https://res.cloudinary.com/dnyuawepb/image/upload/v1726688895/full-phones-app/apple-logo.png',
      description: 'Innovation distinguishes between a leader and a follower.',
      website: 'https://www.apple.com',
      foundedYear: 1976,
      country: 'USA',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const brandResult = await db.collection('Brand').insertOne(apple);
    const brandId = brandResult.insertedId;
    
    console.log('Created brand:', { ...apple, id: brandId });

    // Create Phone with enhanced fields
    const iphone17 = {
      name: 'iPhone 17',
      slug: 'iphone-17',
      brandId: brandId,
      price: 1299.99,
      currency: 'USD',
      releaseDate: new Date('2025-09-15T00:00:00Z'),
      description: 'The iPhone 17 represents the pinnacle of smartphone technology with its revolutionary design and cutting-edge features.',
      metaDescription: 'Discover the iPhone 17 with advanced camera system, powerful A19 Bionic chip, and stunning Super Retina XDR display.',
      shortDescription: 'Revolutionary smartphone with advanced features',
      tags: ['smartphone', 'apple', 'iphone', 'flagship'],
      isAvailable: true,
      discontinued: false,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const phoneResult = await db.collection('Phone').insertOne(iphone17);
    const phoneId = phoneResult.insertedId;
    
    console.log('Created phone:', { ...iphone17, id: phoneId });

    // Create Specifications
    const specifications = [
      { phoneId: phoneId, key: 'Display', value: '6.9-inch Super Retina XDR display', createdAt: new Date(), updatedAt: new Date() },
      { phoneId: phoneId, key: 'Processor', value: 'A19 Bionic chip', createdAt: new Date(), updatedAt: new Date() },
      { phoneId: phoneId, key: 'Main Camera', value: '48MP', createdAt: new Date(), updatedAt: new Date() },
      { phoneId: phoneId, key: 'Front Camera', value: '12MP', createdAt: new Date(), updatedAt: new Date() },
      { phoneId: phoneId, key: 'Storage', value: '256GB', createdAt: new Date(), updatedAt: new Date() },
      { phoneId: phoneId, key: 'Battery', value: 'Up to 30 hours of video playback', createdAt: new Date(), updatedAt: new Date() },
    ];

    await db.collection('Specification').insertMany(specifications);
    console.log('Created specifications');

    // Create enhanced Phone Images with carousel support
    const images = [
      {
        phoneId: phoneId,
        url: 'https://res.cloudinary.com/dnyuawepb/image/upload/v1726688895/full-phones-app/iphone-17-black.webp',
        thumbnail: 'https://res.cloudinary.com/dnyuawepb/image/upload/v1726688895/full-phones-app/iphone-17-black-thumb.webp',
        altText: 'Apple iPhone 17 in Black color',
        caption: 'Sleek Black Design',
        description: 'The iPhone 17 features a premium glass and stainless steel design in classic black.',
        color: 'Black',
        isPrimary: true,
        order: 1,
        imageType: 'PHOTO',
        tags: ['black', 'design', 'front'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        phoneId: phoneId,
        url: 'https://res.cloudinary.com/dnyuawepb/image/upload/v1726688895/full-phones-app/iphone-17-silver.webp',
        thumbnail: 'https://res.cloudinary.com/dnyuawepb/image/upload/v1726688895/full-phones-app/iphone-17-silver-thumb.webp',
        altText: 'Apple iPhone 17 in Silver color',
        caption: 'Elegant Silver Finish',
        description: 'The silver variant showcases Apple's signature aluminum finish with a clean aesthetic.',
        color: 'Silver',
        isPrimary: false,
        order: 2,
        imageType: 'PHOTO',
        tags: ['silver', 'design', 'side'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        phoneId: phoneId,
        url: 'https://res.cloudinary.com/dnyuawepb/image/upload/v1726688895/full-phones-app/iphone-17-gold.webp',
        thumbnail: 'https://res.cloudinary.com/dnyuawepb/image/upload/v1726688895/full-phones-app/iphone-17-gold-thumb.webp',
        altText: 'Apple iPhone 17 in Gold color',
        caption: 'Luxurious Gold Option',
        description: 'The gold variant offers a premium look with its distinctive warm tone.',
        color: 'Gold',
        isPrimary: false,
        order: 3,
        imageType: 'PHOTO',
        tags: ['gold', 'design', 'back'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        phoneId: phoneId,
        url: 'https://res.cloudinary.com/dnyuawepb/image/upload/v1726688895/full-phones-app/iphone-17-camera-diagram.png',
        thumbnail: 'https://res.cloudinary.com/dnyuawepb/image/upload/v1726688895/full-phones-app/iphone-17-camera-diagram-thumb.png',
        altText: 'iPhone 17 Camera System Diagram',
        caption: 'Advanced Camera System',
        description: 'Technical diagram showing the triple-camera system with LiDAR scanner.',
        isPrimary: false,
        order: 4,
        imageType: 'DIAGRAM',
        tags: ['camera', 'diagram', 'specification'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.collection('PhoneImage').insertMany(images);
    console.log('Created images with carousel support');

    console.log('Seed data created successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await client.close();
  }
}

main();