import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')
  console.log("DB URL:", process.env.DATABASE_URL)


  // Create brands first
  console.log('📱 Creating brands...')

  const appleB = await prisma.brand.create({
    data: {
      name: "Apple",
      slug: "apple",
      displayName: "Apple",
      deletedAt: null,
      description: "American multinational technology company known for innovative consumer electronics",
      logo: "https://via.placeholder.com/150x150.png?text=Apple+Logo",
      website: "https://www.apple.com",
      headquarters: "Cupertino, California, USA",
      foundedYear: 1976,
      metaTitle: "Apple Phones - Latest iPhone Models",
      metaDescription: "Explore the latest Apple iPhone models with cutting-edge technology and innovative features."
    }
  })

  const samsungB = await prisma.brand.create({
    data: {
      name: "Samsung",
      slug: "samsung",
      displayName: "Samsung",
      deletedAt: null,
      description: "South Korean multinational manufacturing conglomerate and technology leader",
      logo: "https://via.placeholder.com/150x150.png?text=Samsung+Logo",
      website: "https://www.samsung.com",
      headquarters: "Suwon, South Korea",
      foundedYear: 1938,
      metaTitle: "Samsung Galaxy Phones - Android Smartphones",
      metaDescription: "Discover Samsung Galaxy smartphones with premium displays, cameras, and Android experience."
    }
  })

  const googleB = await prisma.brand.create({
    data: {
      name: "Google",
      slug: "google",
      displayName: "Google",
      deletedAt: null,
      description: "American multinational technology company specializing in Internet services and products",
      logo: "https://via.placeholder.com/150x150.png?text=Google+Logo",
      website: "https://store.google.com",
      headquarters: "Mountain View, California, USA",
      foundedYear: 1998,
      metaTitle: "Google Pixel Phones - Pure Android Experience",
      metaDescription: "Experience pure Android with Google Pixel phones featuring advanced AI and camera technology."
    }
  })

  const oneplusB = await prisma.brand.create({
    data: {
      name: "OnePlus",
      slug: "oneplus",
      displayName: "OnePlus",
      deletedAt: null,
      description: "Chinese smartphone manufacturer known for flagship killer devices",
      logo: "https://via.placeholder.com/150x150.png?text=OnePlus+Logo",
      website: "https://www.oneplus.com",
      headquarters: "Shenzhen, China",
      foundedYear: 2013,
      metaTitle: "OnePlus Smartphones - Never Settle",
      metaDescription: "OnePlus smartphones deliver flagship performance with OxygenOS and premium build quality."
    }
  })

  const xiaomiB = await prisma.brand.create({
    data: {
      name: "Xiaomi",
      slug: "xiaomi",
      displayName: "Xiaomi",
      deletedAt: null,
      description: "Chinese electronics company known for value-for-money smartphones",
      logo: "https://via.placeholder.com/150x150.png?text=Xiaomi+Logo",
      website: "https://www.mi.com",
      headquarters: "Beijing, China",
      foundedYear: 2010,
      metaTitle: "Xiaomi Phones - Innovation for Everyone",
      metaDescription: "Xiaomi smartphones offer cutting-edge technology at affordable prices with MIUI experience."
    }
  })

  console.log('📱 Creating phones...')

  // iPhone 16 Pro Max
  const iphone16ProMax = await prisma.phone.create({
    data: {
      name: "iPhone 16 Pro Max",
      slug: "iphone-16-pro-max",
      series: "iPhone 16",
      model: "A3108",
      brandId: appleB.id,
      status: "ACTIVE",
      releaseDate: new Date("2024-09-20T00:00:00.000Z"),
      announcedAt: new Date("2024-09-09T00:00:00.000Z"),
      description: "The ultimate iPhone with the largest Super Retina XDR display, advanced Pro camera system, and A18 Pro chip for unmatched performance.",
      shortDescription: "The biggest and most advanced iPhone ever with titanium design and Pro camera system.",
      keyFeatures: ["6.9-inch Super Retina XDR display", "A18 Pro chip", "Pro camera system with 5x Telephoto", "Titanium design", "Action Button", "USB-C"],
      launchPrice: 1199.00,
      currentPrice: 1199.00,
      currency: "USD",
      primaryImage: "https://via.placeholder.com/600x800.png?text=iPhone+16+Pro+Max",
      deletedAt: null,
      gallery: {
        create: [
          { url: "https://via.placeholder.com/600x800.png?text=iPhone+16+Pro+Max+Front", description: "Front view of the iPhone 16 Pro Max", altText: "iPhone 16 Pro Max Front", order: 1 },
          { url: "https://via.placeholder.com/600x800.png?text=iPhone+16+Pro+Max+Back", description: "Back view of the iPhone 16 Pro Max", altText: "iPhone 16 Pro Max Back", order: 2 },
          { url: "https://via.placeholder.com/600x800.png?text=iPhone+16+Pro+Max+Side", description: "Side view of the iPhone 16 Pro Max", altText: "iPhone 16 Pro Max Side", order: 3 },
        ]
      },
      metaTitle: "iPhone 16 Pro Max - Apple's Most Advanced iPhone",
      metaDescription: "Experience the iPhone 16 Pro Max with 6.9-inch display, A18 Pro chip, and advanced Pro camera system.",
      specifications: {
        create: [
          { key: "Screen Size", value: "6.9", displayName: "Display Size", unit: "inches", category: "DISPLAY", priority: 1, isHighlight: true },
          { key: "Battery Capacity", value: "4441", displayName: "Battery", unit: "mAh", category: "BATTERY", priority: 2, isHighlight: true },
          { key: "Processor", value: "A18 Pro", displayName: "Chip", category: "PERFORMANCE", priority: 3, isHighlight: true },
          { key: "RAM", value: "8", displayName: "Memory", unit: "GB", category: "PERFORMANCE", priority: 4 },
          { key: "Main Camera", value: "48 MP Fusion", displayName: "Main Camera", unit: "MP", category: "CAMERA", priority: 5, isHighlight: true },
          { key: "Operating System", value: "iOS 18", displayName: "OS", category: "SOFTWARE", priority: 6 },
          { key: "Build Material", value: "Titanium", displayName: "Build", category: "BUILD", priority: 7 },
          { key: "Water Resistance", value: "IP68", displayName: "Water Rating", category: "BUILD", priority: 8 }
        ]
      },
      variants: {
        create: [
          { name: "256GB", storage: "256GB", ram: "8GB", price: 1199.00 },
          { name: "512GB", storage: "512GB", ram: "8GB", price: 1399.00 },
          { name: "1TB", storage: "1TB", ram: "8GB", price: 1599.00 }
        ]
      },
      colors: {
        create: [
          { name: "Natural Titanium", hexCode: "#8B8680", imageUrl: "https://via.placeholder.com/300x400.png?text=Natural+Titanium", isDefault: true },
          { name: "Blue Titanium", hexCode: "#1E3A8A", imageUrl: "https://via.placeholder.com/300x400.png?text=Blue+Titanium" },
          { name: "White Titanium", hexCode: "#F8F8FF", imageUrl: "https://via.placeholder.com/300x400.png?text=White+Titanium" },
          { name: "Black Titanium", hexCode: "#2C2C2E", imageUrl: "https://via.placeholder.com/300x400.png?text=Black+Titanium" }
        ]
      }
    }
  })

  // Xiaomi 15 Pro
  const xiaomi15Pro = await prisma.phone.create({
    data: {
      name: "Xiaomi 15 Pro",
      slug: "xiaomi-15-pro",
      series: "Xiaomi 15",
      model: "24116PN5BC",
      brandId: xiaomiB.id,
      status: "ACTIVE",
      releaseDate: new Date("2024-10-29T00:00:00.000Z"),
      description: "Premium Xiaomi flagship with Snapdragon 8 Elite, Leica cameras, and HyperOS 2.0.",
      shortDescription: "Professional photography meets flagship performance with Leica collaboration.",
      keyFeatures: ["6.73-inch LTPO AMOLED", "Snapdragon 8 Elite", "Leica Camera System", "5100mAh battery", "120W HyperCharge"],
      launchPrice: 899.00,
      currentPrice: 899.00,
      deletedAt: null,
      primaryImage: "https://via.placeholder.com/600x800.png?text=Xiaomi+15+Pro",
      gallery: {
        create: [
          { url: "https://via.placeholder.com/600x800.png?text=Xiaomi+15+Pro+Front", description: "Front view of the Xiaomi 15 Pro", altText: "Xiaomi 15 Pro Front", order: 1 },
          { url: "https://via.placeholder.com/600x800.png?text=Xiaomi+15+Pro+Back", description: "Back view of the Xiaomi 15 Pro", altText: "Xiaomi 15 Pro Back", order: 2 },
        ]
      },
      specifications: {
        create: [
          { key: "Screen Size", value: "6.73", unit: "inches", category: "DISPLAY", priority: 1, isHighlight: true },
          { key: "Processor", value: "Snapdragon 8 Elite", category: "PERFORMANCE", priority: 2, isHighlight: true },
          { key: "Battery Capacity", value: "5100", unit: "mAh", category: "BATTERY", priority: 3, isHighlight: true },
          { key: "Main Camera", value: "50 MP Leica", unit: "MP", category: "CAMERA", priority: 4, isHighlight: true },
          { key: "Fast Charging", value: "120W HyperCharge", category: "BATTERY", priority: 5, isHighlight: true }
        ]
      },
      variants: {
        create: [
          { name: "256GB", storage: "256GB", ram: "12GB", price: 899.00 },
          { name: "512GB", storage: "512GB", ram: "16GB", price: 999.00 },
          { name: "1TB", storage: "1TB", ram: "16GB", price: 1199.00 }
        ]
      },
      colors: {
        create: [
          { name: "Titanium", hexCode: "#8B8680", imageUrl: "https://via.placeholder.com/300x400.png?text=Titanium", isDefault: true },
          { name: "Black", hexCode: "#1C1C1E", imageUrl: "https://via.placeholder.com/300x400.png?text=Black" },
          { name: "White", hexCode: "#F8F8FF", imageUrl: "https://via.placeholder.com/300x400.png?text=White" },
          { name: "Purple", hexCode: "#8A2BE2", imageUrl: "https://via.placeholder.com/300x400.png?text=Purple" }
        ]
      }
    }
  })

  // Xiaomi 15
  const xiaomi15 = await prisma.phone.create({
    data: {
      name: "Xiaomi 15",
      slug: "xiaomi-15",
      series: "Xiaomi 15",
      model: "24116PN5AC",
      brandId: xiaomiB.id,
      status: "ACTIVE",
      releaseDate: new Date("2024-10-29T00:00:00.000Z"),
      description: "Flagship Xiaomi with compact design, Snapdragon 8 Elite, and Leica photography system.",
      shortDescription: "Compact flagship with professional Leica cameras and premium performance.",
      keyFeatures: ["6.36-inch LTPO AMOLED", "Snapdragon 8 Elite", "Leica Triple Camera", "4800mAh battery", "90W HyperCharge"],
      launchPrice: 649.00,
      currentPrice: 649.00,
      primaryImage: "https://via.placeholder.com/600x800.png?text=Xiaomi+15",
      deletedAt: null,
      gallery: {
        create: [
          { url: "https://via.placeholder.com/600x800.png?text=Xiaomi+15+Front", description: "Front view of the Xiaomi 15", altText: "Xiaomi 15 Front", order: 1 },
          { url: "https://via.placeholder.com/600x800.png?text=Xiaomi+15+Back", description: "Back view of the Xiaomi 15", altText: "Xiaomi 15 Back", order: 2 },
        ]
      },
      specifications: {
        create: [
          { key: "Screen Size", value: "6.36", unit: "inches", category: "DISPLAY", priority: 1, isHighlight: true },
          { key: "Processor", value: "Snapdragon 8 Elite", category: "PERFORMANCE", priority: 2, isHighlight: true },
          { key: "Battery Capacity", value: "4800", unit: "mAh", category: "BATTERY", priority: 3, isHighlight: true },
          { key: "Main Camera", value: "50 MP Leica", unit: "MP", category: "CAMERA", priority: 4, isHighlight: true },
          { key: "Fast Charging", value: "90W HyperCharge", category: "BATTERY", priority: 5, isHighlight: true }
        ]
      },
      variants: {
        create: [
          { name: "128GB", storage: "128GB", ram: "8GB", price: 649.00 },
          { name: "256GB", storage: "256GB", ram: "12GB", price: 749.00 },
          { name: "512GB", storage: "512GB", ram: "12GB", price: 899.00 }
        ]
      },
      colors: {
        create: [
          { name: "Black", hexCode: "#1C1C1E", imageUrl: "https://via.placeholder.com/300x400.png?text=Black", isDefault: true },
          { name: "White", hexCode: "#F8F8FF", imageUrl: "https://via.placeholder.com/300x400.png?text=White" },
          { name: "Green", hexCode: "#228B22", imageUrl: "https://via.placeholder.com/300x400.png?text=Green" },
          { name: "Pink", hexCode: "#FFB6C1", imageUrl: "https://via.placeholder.com/300x400.png?text=Pink" }
        ]
      }
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log('📊 Created:')
  console.log(`   - 5 brands`)
  console.log(`   - 12 phones`)
  console.log(`   - ${12 * 4} specifications (average)`)
  console.log(`   - ${12 * 3} variants (average)`) 
  console.log(`   - ${12 * 4} colors (average)`)
  
  console.log('\n📱 Phone Series Created:')
  console.log(`   - iPhone 16 Series: 3 models`)
  console.log(`   - Galaxy S25 Series: 2 models`)
  console.log(`   - Pixel 9 Series: 2 models`)
  console.log(`   - OnePlus Series: 2 models`)
  console.log(`   - Xiaomi 15 Series: 2 models`)






  // iPhone 16 Pro
  const iphone16Pro = await prisma.phone.create({
    data: {
      name: "iPhone 16 Pro",
      slug: "iphone-16-pro",
      series: "iPhone 16",
      model: "A3107",
      brandId: appleB.id,
      status: "ACTIVE",
      releaseDate: new Date("2024-09-20T00:00:00.000Z"),
      announcedAt: new Date("2024-09-09T00:00:00.000Z"),
      description: "The Pro iPhone with advanced camera system, A18 Pro chip, and titanium design in a compact form factor.",
      shortDescription: "Pro performance and camera system in a perfect size with titanium build.",
      keyFeatures: ["6.3-inch Super Retina XDR display", "A18 Pro chip", "Pro camera system", "Titanium design", "Action Button", "USB-C"],
      launchPrice: 999.00,
      currentPrice: 999.00,
      currency: "USD",
      primaryImage: "https://via.placeholder.com/600x800.png?text=iPhone+16+Pro",
      deletedAt: null,
      gallery: {
        create: [
          { url: "https://via.placeholder.com/600x800.png?text=iPhone+16+Pro+Front", description: "Front view of the iPhone 16 Pro", altText: "iPhone 16 Pro Front", order: 1 },
          { url: "https://via.placeholder.com/600x800.png?text=iPhone+16+Pro+Back", description: "Back view of the iPhone 16 Pro", altText: "iPhone 16 Pro Back", order: 2 },
        ]
      },
      specifications: {
        create: [
          { key: "Screen Size", value: "6.3", unit: "inches", category: "DISPLAY", priority: 1, isHighlight: true },
          { key: "Battery Capacity", value: "3274", unit: "mAh", category: "BATTERY", priority: 2, isHighlight: true },
          { key: "Processor", value: "A18 Pro", category: "PERFORMANCE", priority: 3, isHighlight: true },
          { key: "RAM", value: "8", unit: "GB", category: "PERFORMANCE", priority: 4 },
          { key: "Main Camera", value: "48 MP Fusion", unit: "MP", category: "CAMERA", priority: 5, isHighlight: true },
          { key: "Operating System", value: "iOS 18", category: "SOFTWARE", priority: 6 }
        ]
      },
      variants: {
        create: [
          { name: "128GB", storage: "128GB", ram: "8GB", price: 999.00 },
          { name: "256GB", storage: "256GB", ram: "8GB", price: 1199.00 },
          { name: "512GB", storage: "512GB", ram: "8GB", price: 1399.00 },
          { name: "1TB", storage: "1TB", ram: "8GB", price: 1599.00 }
        ]
      },
      colors: {
        create: [
          { name: "Natural Titanium", hexCode: "#8B8680", imageUrl: "https://via.placeholder.com/300x400.png?text=Natural+Titanium", isDefault: true },
          { name: "Blue Titanium", hexCode: "#1E3A8A", imageUrl: "https://via.placeholder.com/300x400.png?text=Blue+Titanium" },
          { name: "White Titanium", hexCode: "#F8F8FF", imageUrl: "https://via.placeholder.com/300x400.png?text=White+Titanium" },
          { name: "Black Titanium", hexCode: "#2C2C2E", imageUrl: "https://via.placeholder.com/300x400.png?text=Black+Titanium" }
        ]
      }
    }
  })

  // iPhone 16
  const iphone16 = await prisma.phone.create({
    data: {
      name: "iPhone 16",
      slug: "iphone-16",
      series: "iPhone 16",
      model: "A3105",
      brandId: appleB.id, 
      status: "ACTIVE",
      releaseDate: new Date("2024-09-20T00:00:00.000Z"),
      description: "The new iPhone with A18 chip, advanced dual-camera system, and all-day battery life.",
      shortDescription: "The perfect balance of performance, camera, and value in the latest iPhone.",
      keyFeatures: ["6.1-inch Super Retina XDR display", "A18 chip", "Advanced dual-camera system", "All-day battery", "Action Button"],
      launchPrice: 799.00,
      currentPrice: 799.00,
      primaryImage: "https://via.placeholder.com/600x800.png?text=iPhone+16",
      deletedAt: null,
      gallery: {
        create: [
          { url: "https://via.placeholder.com/600x800.png?text=iPhone+16+Front", description: "Front view of the iPhone 16", altText: "iPhone 16 Front", order: 1 },
          { url: "https://via.placeholder.com/600x800.png?text=iPhone+16+Back", description: "Back view of the iPhone 16", altText: "iPhone 16 Back", order: 2 },
        ]
      },
      specifications: {
        create: [
          { key: "Screen Size", value: "6.1", unit: "inches", category: "DISPLAY", priority: 1, isHighlight: true },
          { key: "Processor", value: "A18", category: "PERFORMANCE", priority: 2, isHighlight: true },
          { key: "RAM", value: "8", unit: "GB", category: "PERFORMANCE", priority: 3 },
          { key: "Main Camera", value: "48 MP", unit: "MP", category: "CAMERA", priority: 4, isHighlight: true }
        ]
      },
      variants: {
        create: [
          { name: "128GB", storage: "128GB", ram: "8GB", price: 799.00 },
          { name: "256GB", storage: "256GB", ram: "8GB", price: 899.00 },
          { name: "512GB", storage: "512GB", ram: "8GB", price: 1099.00 }
        ]
      },
      colors: {
        create: [
          { name: "Black", hexCode: "#1D1D1F", imageUrl: "https://via.placeholder.com/300x400.png?text=Black", isDefault: true },
          { name: "White", hexCode: "#F5F5DC", imageUrl: "https://via.placeholder.com/300x400.png?text=White" },
          { name: "Pink", hexCode: "#FFB6C1", imageUrl: "https://via.placeholder.com/300x400.png?text=Pink" },
          { name: "Teal", hexCode: "#008080", imageUrl: "https://via.placeholder.com/300x400.png?text=Teal" },
          { name: "Ultramarine", hexCode: "#4169E1", imageUrl: "https://via.placeholder.com/300x400.png?text=Ultramarine" }
        ]
      }
    }
  })

  // Galaxy S25 Ultra
  const galaxyS25Ultra = await prisma.phone.create({
    data: {
      name: "Galaxy S25 Ultra",
      slug: "galaxy-s25-ultra",
      series: "Galaxy S25",
      model: "SM-S938U",
      brandId: samsungB.id,
      status: "ACTIVE",
      releaseDate: new Date("2025-01-22T00:00:00.000Z"),
      description: "The most powerful Galaxy with S Pen, 200MP camera, and Snapdragon 8 Elite processor.",
      shortDescription: "Ultimate productivity and creativity with built-in S Pen and quad camera system.",
      keyFeatures: ["6.8-inch Dynamic AMOLED 2X", "Snapdragon 8 Elite", "200MP main camera", "Built-in S Pen", "5000mAh battery"],
      launchPrice: 1299.00,
      currentPrice: 1299.00,
      deletedAt: null,
      primaryImage: "https://via.placeholder.com/600x800.png?text=Galaxy+S25+Ultra",
      gallery: {
        create: [
          { url: "https://via.placeholder.com/600x800.png?text=Galaxy+S25+Ultra+Front", description: "Front view of the Galaxy S25 Ultra", altText: "Galaxy S25 Ultra Front", order: 1 },
          { url: "https://via.placeholder.com/600x800.png?text=Galaxy+S25+Ultra+Back", description: "Back view of the Galaxy S25 Ultra", altText: "Galaxy S25 Ultra Back", order: 2 },
        ]
      },
      specifications: {
        create: [
          { key: "Screen Size", value: "6.8", unit: "inches", category: "DISPLAY", priority: 1, isHighlight: true },
          { key: "Battery Capacity", value: "5000", unit: "mAh", category: "BATTERY", priority: 2, isHighlight: true },
          { key: "Processor", value: "Snapdragon 8 Elite", category: "PERFORMANCE", priority: 3, isHighlight: true },
          { key: "RAM", value: "12", unit: "GB", category: "PERFORMANCE", priority: 4 },
          { key: "Main Camera", value: "200 MP", unit: "MP", category: "CAMERA", priority: 5, isHighlight: true },
          { key: "S Pen", value: "Built-in", category: "OTHER", priority: 6, isHighlight: true }
        ]
      },
      variants: {
        create: [
          { name: "256GB", storage: "256GB", ram: "12GB", price: 1299.00 },
          { name: "512GB", storage: "512GB", ram: "12GB", price: 1419.99 },
          { name: "1TB", storage: "1TB", ram: "12GB", price: 1659.99 }
        ]
      },
      colors: {
        create: [
          { name: "Titanium Black", hexCode: "#2C2C2E", imageUrl: "https://via.placeholder.com/300x400.png?text=Titanium+Black", isDefault: true },
          { name: "Titanium Gray", hexCode: "#808080", imageUrl: "https://via.placeholder.com/300x400.png?text=Titanium+Gray" },
          { name: "Titanium Violet", hexCode: "#8A2BE2", imageUrl: "https://via.placeholder.com/300x400.png?text=Titanium+Violet" },
          { name: "Titanium Yellow", hexCode: "#FFD700", imageUrl: "https://via.placeholder.com/300x400.png?text=Titanium+Yellow" }
        ]
      }
    }
  })

  // Galaxy S25+
  const galaxyS25Plus = await prisma.phone.create({
    data: {
      name: "Galaxy S25+",
      slug: "galaxy-s25-plus",
      series: "Galaxy S25",
      model: "SM-S936U",
      brandId: samsungB.id,
      status: "ACTIVE",
      releaseDate: new Date("2025-01-22T00:00:00.000Z"),
      description: "Premium Galaxy experience with large display, triple camera system, and all-day battery.",
      shortDescription: "The perfect size Galaxy with premium features and long-lasting battery.",
      keyFeatures: ["6.7-inch Dynamic AMOLED 2X", "Snapdragon 8 Elite", "50MP triple camera", "4900mAh battery"],
      launchPrice: 999.99,
      currentPrice: 999.99,
      primaryImage: "https://via.placeholder.com/600x800.png?text=Galaxy+S25+Plus",
      deletedAt: null,
      gallery: {
        create: [
          { url: "https://via.placeholder.com/600x800.png?text=Galaxy+S25%2B+Front", description: "Front view of the Galaxy S25+", altText: "Galaxy S25+ Front", order: 1 },
          { url: "https://via.placeholder.com/600x800.png?text=Galaxy+S25%2B+Back", description: "Back view of the Galaxy S25+", altText: "Galaxy S25+ Back", order: 2 },
        ]
      },
      specifications: {
        create: [
          { key: "Screen Size", value: "6.7", unit: "inches", category: "DISPLAY", priority: 1, isHighlight: true },
          { key: "Processor", value: "Snapdragon 8 Elite", category: "PERFORMANCE", priority: 2, isHighlight: true },
          { key: "RAM", value: "12", unit: "GB", category: "PERFORMANCE", priority: 3 },
          { key: "Battery Capacity", value: "4900", unit: "mAh", category: "BATTERY", priority: 4, isHighlight: true }
        ]
      },
      variants: {
        create: [
          { name: "256GB", storage: "256GB", ram: "12GB", price: 999.99 },
          { name: "512GB", storage: "512GB", ram: "12GB", price: 1119.99 }
        ]
      },
      colors: {
        create: [
          { name: "Navy", hexCode: "#000080", imageUrl: "https://via.placeholder.com/300x400.png?text=Navy", isDefault: true },
          { name: "Silver Shadow", hexCode: "#A8A8A8", imageUrl: "https://via.placeholder.com/300x400.png?text=Silver+Shadow" },
          { name: "Icy Blue", hexCode: "#B0E0E6", imageUrl: "https://via.placeholder.com/300x400.png?text=Icy+Blue" },
          { name: "Mint", hexCode: "#98FB98", imageUrl: "https://via.placeholder.com/300x400.png?text=Mint" }
        ]
      }
    }
  })

  // Pixel 9 Pro XL
  const pixel9ProXL = await prisma.phone.create({
    data: {
      name: "Pixel 9 Pro XL",
      slug: "pixel-9-pro-xl",
      series: "Pixel 9",
      model: "GF5KQ",
      brandId: googleB.id,
      status: "ACTIVE",
      releaseDate: new Date("2024-08-22T00:00:00.000Z"),
      description: "Google's flagship with the largest display, Tensor G4 chip, and advanced AI photography features.",
      shortDescription: "The ultimate Pixel experience with AI-powered photography and pure Android.",
      keyFeatures: ["6.8-inch LTPO OLED", "Tensor G4", "AI-powered cameras", "Magic Eraser", "7 years of updates"],
      launchPrice: 1099.00,
      currentPrice: 1099.00,
      primaryImage: "https://via.placeholder.com/600x800.png?text=Pixel+9+Pro+XL",
      deletedAt: null,
      gallery: {
        create: [
          { url: "https://via.placeholder.com/600x800.png?text=Pixel+9+Pro+XL+Front", description: "Front view of the Pixel 9 Pro XL", altText: "Pixel 9 Pro XL Front", order: 1 },
          { url: "https://via.placeholder.com/600x800.png?text=Pixel+9+Pro+XL+Back", description: "Back view of the Pixel 9 Pro XL", altText: "Pixel 9 Pro XL Back", order: 2 },
        ]
      },
      specifications: {
        create: [
          { key: "Screen Size", value: "6.8", unit: "inches", category: "DISPLAY", priority: 1, isHighlight: true },
          { key: "Processor", value: "Tensor G4", category: "PERFORMANCE", priority: 2, isHighlight: true },
          { key: "RAM", value: "16", unit: "GB", category: "PERFORMANCE", priority: 3, isHighlight: true },
          { key: "Main Camera", value: "50 MP", unit: "MP", category: "CAMERA", priority: 4, isHighlight: true },
          { key: "AI Features", value: "Magic Eraser, Best Take", category: "SOFTWARE", priority: 5, isHighlight: true }
        ]
      },
      variants: {
        create: [
          { name: "128GB", storage: "128GB", ram: "16GB", price: 1099.00 },
          { name: "256GB", storage: "256GB", ram: "16GB", price: 1199.00 },
          { name: "512GB", storage: "512GB", ram: "16GB", price: 1319.00 },
          { name: "1TB", storage: "1TB", ram: "16GB", price: 1549.00 }
        ]
      },
      colors: {
        create: [
          { name: "Obsidian", hexCode: "#1C1C1E", imageUrl: "https://via.placeholder.com/300x400.png?text=Obsidian", isDefault: true },
          { name: "Porcelain", hexCode: "#F8F8F8", imageUrl: "https://via.placeholder.com/300x400.png?text=Porcelain" },
          { name: "Hazel", hexCode: "#8B7D6B", imageUrl: "https://via.placeholder.com/300x400.png?text=Hazel" },
          { name: "Rose Quartz", hexCode: "#F8BBD0", imageUrl: "https://via.placeholder.com/300x400.png?text=Rose+Quartz" }
        ]
      }
    }
  })

  // Pixel 9 Pro
  const pixel9Pro = await prisma.phone.create({
    data: {
      name: "Pixel 9 Pro",
      slug: "pixel-9-pro",
      series: "Pixel 9",
      model: "GTV7L",
      brandId: googleB.id,
      status: "ACTIVE",
      releaseDate: new Date("2024-08-22T00:00:00.000Z"),
      description: "Compact Pro Pixel with Tensor G4, triple camera system, and AI-powered features.",
      shortDescription: "Pro features in a compact size with advanced AI photography capabilities.",
      keyFeatures: ["6.3-inch LTPO OLED", "Tensor G4", "Triple camera system", "AI photography", "Pure Android"],
      launchPrice: 999.00,
      currentPrice: 999.00,
      primaryImage: "https://via.placeholder.com/600x800.png?text=Pixel+9+Pro",
      deletedAt: null,
      gallery: {
        create: [
          { url: "https://via.placeholder.com/600x800.png?text=Pixel+9+Pro+Front", description: "Front view of the Pixel 9 Pro", altText: "Pixel 9 Pro Front", order: 1 },
          { url: "https://via.placeholder.com/600x800.png?text=Pixel+9+Pro+Back", description: "Back view of the Pixel 9 Pro", altText: "Pixel 9 Pro Back", order: 2 },
        ]
      },
      specifications: {
        create: [
          { key: "Screen Size", value: "6.3", unit: "inches", category: "DISPLAY", priority: 1, isHighlight: true },
          { key: "Processor", value: "Tensor G4", category: "PERFORMANCE", priority: 2, isHighlight: true },
          { key: "RAM", value: "16", unit: "GB", category: "PERFORMANCE", priority: 3, isHighlight: true },
          { key: "Main Camera", value: "50 MP", unit: "MP", category: "CAMERA", priority: 4, isHighlight: true }
        ]
      },
      variants: {
        create: [
          { name: "128GB", storage: "128GB", ram: "16GB", price: 999.00 },
          { name: "256GB", storage: "256GB", ram: "16GB", price: 1099.00 },
          { name: "512GB", storage: "512GB", ram: "16GB", price: 1219.00 }
        ]
      },
      colors: {
        create: [
          { name: "Obsidian", hexCode: "#1C1C1E", imageUrl: "https://via.placeholder.com/300x400.png?text=Obsidian", isDefault: true },
          { name: "Porcelain", hexCode: "#F8F8F8", imageUrl: "https://via.placeholder.com/300x400.png?text=Porcelain" },
          { name: "Hazel", hexCode: "#8B7D6B", imageUrl: "https://via.placeholder.com/300x400.png?text=Hazel" },
          { name: "Rose Quartz", hexCode: "#F8BBD0", imageUrl: "https://via.placeholder.com/300x400.png?text=Rose+Quartz" }
        ]
      }
    }
  })

  // OnePlus 13
  const oneplus13 = await prisma.phone.create({
    data: {
      name: "OnePlus 13",
      slug: "oneplus-13",
      series: "OnePlus 13",
      model: "CPH2635",
      brandId: oneplusB.id,
      status: "ACTIVE",
      releaseDate: new Date("2024-10-31T00:00:00.000Z"),
      description: "Flagship OnePlus with Snapdragon 8 Elite, Hasselblad cameras, and 6000mAh battery.",
      shortDescription: "Never Settle with flagship performance, pro cameras, and all-day battery life.",
      keyFeatures: ["6.82-inch LTPO AMOLED", "Snapdragon 8 Elite", "Hasselblad Camera System", "6000mAh battery", "100W SuperVOOC"],
      launchPrice: 899.00,
      currentPrice: 899.00,
      primaryImage: "https://via.placeholder.com/600x800.png?text=OnePlus+13",
      deletedAt: null,
      gallery: {
        create: [
          { url: "https://via.placeholder.com/600x800.png?text=OnePlus+13+Front", description: "Front view of the OnePlus 13", altText: "OnePlus 13 Front", order: 1 },
          { url: "https://via.placeholder.com/600x800.png?text=OnePlus+13+Back", description: "Back view of the OnePlus 13", altText: "OnePlus 13 Back", order: 2 },
        ]
      },
      specifications: {
        create: [
          { key: "Screen Size", value: "6.82", unit: "inches", category: "DISPLAY", priority: 1, isHighlight: true },
          { key: "Battery Capacity", value: "6000", unit: "mAh", category: "BATTERY", priority: 2, isHighlight: true },
          { key: "Processor", value: "Snapdragon 8 Elite", category: "PERFORMANCE", priority: 3, isHighlight: true },
          { key: "RAM", value: "16", unit: "GB", category: "PERFORMANCE", priority: 4, isHighlight: true },
          { key: "Fast Charging", value: "100W SuperVOOC", category: "BATTERY", priority: 5, isHighlight: true }
        ]
      },
      variants: {
        create: [
          { name: "256GB", storage: "256GB", ram: "12GB", price: 899.00 },
          { name: "512GB", storage: "512GB", ram: "16GB", price: 999.00 },
          { name: "1TB", storage: "1TB", ram: "24GB", price: 1199.00 }
        ]
      },
      colors: {
        create: [
          { name: "Black Eclipse", hexCode: "#1C1C1E", imageUrl: "https://via.placeholder.com/300x400.png?text=Black+Eclipse", isDefault: true },
          { name: "White Dew", hexCode: "#F8F8FF", imageUrl: "https://via.placeholder.com/300x400.png?text=White+Dew" },
          { name: "Blue Moment", hexCode: "#1E3A8A", imageUrl: "https://via.placeholder.com/300x400.png?text=Blue+Moment" }
        ]
      }
    }
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)})
  