# Enhanced Database Design for Phone Specification Website

## Current Schema Analysis
The current schema provides a solid foundation with models for brands, phones, specifications, images, users, comments, and likes. However, there are opportunities to enhance the design for better scalability and feature richness.

## Proposed Enhancements

### 1. Enhanced Brand Model
```prisma
model Brand {
  id          String     @id @map("_id") @default(auto()) @db.ObjectId
  name        String
  slug        String     @unique
  logo        String?    // Brand logo URL
  description String?    // Brand description
  website     String?    // Official brand website
  foundedYear Int?       // Year the brand was founded
  country     String?    // Country of origin
  phones      Phone[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}
```

### 2. Specification Category Model
```prisma
model SpecCategory {
  id          String         @id @map("_id") @default(auto()) @db.ObjectId
  name        String         @unique
  displayName String         // User-friendly name
  icon        String?        // Icon for the category
  order       Int            @default(0) // Display order
  specs       SpecificationType[]
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
}
```

### 3. Enhanced Specification Type Model
```prisma
model SpecificationType {
  id          String       @id @map("_id") @default(auto()) @db.ObjectId
  key         String       @unique // e.g., "screen_size", "battery_capacity"
  displayName String       // User-friendly name e.g., "Screen Size", "Battery Capacity"
  description String?      // Description of what this spec measures
  category    SpecCategory @relation(fields: [categoryId], references: [id])
  categoryId  String       @db.ObjectId
  dataType    SpecDataType // ENUM: TEXT, NUMBER, BOOLEAN, DATE
  unit        String?      // e.g., "inches", "mAh", "GB"
  unitSymbol  String?      // e.g., """, "mAh", "GB"
  isSearchable Boolean    @default(true) // Whether this spec should be searchable
  isComparable Boolean    @default(true) // Whether this spec should be comparable
  order       Int          @default(0) // Display order within category
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

enum SpecDataType {
  TEXT
  NUMBER
  BOOLEAN
  DATE
}
```

### 4. Enhanced Phone Specification Model
```prisma
model PhoneSpecification {
  id               String           @id @map("_id") @default(auto()) @db.ObjectId
  phone            Phone            @relation(fields: [phoneId], references: [id])
  phoneId          String           @db.ObjectId
  specType         SpecificationType @relation(fields: [specTypeId], references: [id])
  specTypeId       String           @db.ObjectId
  value            String           // Store all values as strings for flexibility
  numericValue     Float?           // For sorting and comparisons
  booleanValue     Boolean?         // For boolean specs
  displayValue     String?          // Formatted value for display (e.g., "6.5 inches")
  minValue         Float?           // For range specs
  maxValue         Float?           // For range specs
  createdAt        DateTime         @default(now())
  updatedAt        DateTime         @updatedAt

  @@unique([phoneId, specTypeId])
}
```

### 5. Category Model for Phones
```prisma
model PhoneCategory {
  id          String   @id @map("_id") @default(auto()) @db.ObjectId
  name        String   @unique
  slug        String   @unique
  description String?
  icon        String?  // Icon for the category
  parent      PhoneCategory? @relation("Subcategories", fields: [parentId], references: [id])
  parentId    String?  @db.ObjectId
  children    PhoneCategory[] @relation("Subcategories")
  phones      Phone[]
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@relation("Subcategories")
}
```

### 6. Enhanced Phone Image Model (with Carousel Support)
```prisma
model PhoneImage {
  id          String   @id @map("_id") @default(auto()) @db.ObjectId
  phone       Phone    @relation(fields: [phoneId], references: [id])
  phoneId     String   @db.ObjectId
  url         String   // Image URL
  thumbnail   String?  // Thumbnail URL
  altText     String?  // Alternative text for accessibility
  caption     String?  // Caption for the image (for carousel)
  description String?  // Longer description for the image
  isPrimary   Boolean  @default(false) // Primary image for the phone
  order       Int      @default(0) // Display order in carousel
  imageType   ImageType // Type of image (PHOTO, DIAGRAM, RENDER, etc.)
  color       String?  // Associated color (if applicable)
  tags        String[] // Tags for filtering/searching images
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([phoneId, url]) // Prevent duplicate images for the same phone
}

enum ImageType {
  PHOTO     // Actual photos of the device
  DIAGRAM   // Technical diagrams
  RENDER    // 3D renders
  SCREENSHOT // UI screenshots
  ADVERT    // Advertisement images
  OTHER     // Other types
}
```

### 7. Enhanced Phone Model
```prisma
model Phone {
  id              String              @id @map("_id") @default(auto()) @db.ObjectId
  name            String
  slug            String              @unique
  brand           Brand               @relation(fields: [brandId], references: [id])
  brandId         String              @db.ObjectId
  category        PhoneCategory?      @relation(fields: [categoryId], references: [id])
  categoryId      String?             @db.ObjectId
  description     String?             // Rich content description
  metaDescription String?             // SEO meta description
  shortDescription String?            // Short description for cards
  price           Float
  currency        String              @default("USD")
  releaseDate     DateTime
  discontinued    Boolean             @default(false)
  isAvailable     Boolean             @default(true)
  tags            String[]            // Tags for search and filtering
  viewCount       Int                 @default(0) // Page views
  specifications  PhoneSpecification[]
  images          PhoneImage[]        // All images including carousel images
  comments        Comment[]
  likes           Like[]
  ratings         PhoneRating[]       // User ratings
  variants        PhoneVariant[]      // Color/Storage variants
  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt
}
```

### 8. Phone Rating Model
```prisma
model PhoneRating {
  id        String   @id @map("_id") @default(auto()) @db.ObjectId
  phone     Phone    @relation(fields: [phoneId], references: [id])
  phoneId   String   @db.ObjectId
  user      User     @relation(fields: [userId], references: [id])
  userId    String   @db.ObjectId
  rating    Int      // 1-5 stars
  review    String?  // Text review
  title     String?  // Review title
  isVerified Boolean @default(false) // Verified purchase
  helpful   Int      @default(0) // Helpful count
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, phoneId]) // One rating per user per phone
}
```

### 9. Phone Variant Model
```prisma
model PhoneVariant {
  id          String      @id @map("_id") @default(auto()) @db.ObjectId
  phone       Phone       @relation(fields: [phoneId], references: [id])
  phoneId     String      @db.ObjectId
  name        String      // e.g., "128GB Black"
  color       String?     // e.g., "Black"
  colorHex    String?     // e.g., "#000000"
  storage     String?     // e.g., "128GB"
  price       Float?      // Variant-specific price
  sku         String?     // Stock Keeping Unit
  isAvailable Boolean     @default(true)
  images      PhoneImage[] // Variant-specific images
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}
```

### 10. Comparison Model
```prisma
model PhoneComparison {
  id        String   @id @map("_id") @default(auto()) @db.ObjectId
  user      User?    @relation(fields: [userId], references: [id])
  userId    String?  @db.ObjectId
  name      String?  // Custom name for the comparison
  phones    Phone[]  // Phones being compared
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 11. Wishlist Model
```prisma
model Wishlist {
  id        String   @id @map("_id") @default(auto()) @db.ObjectId
  user      User     @relation(fields: [userId], references: [id])
  userId    String   @db.ObjectId
  name      String   @default("My Wishlist")
  phones    Phone[]  // Phones in wishlist
  isPublic  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, name])
}
```

### 12. Search Analytics Model
```prisma
model SearchQuery {
  id          String   @id @map("_id") @default(auto()) @db.ObjectId
  query       String
  results     Int      // Number of results
  timestamp   DateTime @default(now())
  userId      String?  @db.ObjectId // If user is logged in
}
```

### 13. Media Gallery Model (Optional for more complex galleries)
```prisma
model MediaGallery {
  id          String       @id @map("_id") @default(auto()) @db.ObjectId
  phone       Phone        @relation(fields: [phoneId], references: [id])
  phoneId     String       @db.ObjectId
  title       String?      // Gallery title
  description String?      // Gallery description
  images      GalleryImage[] // Images in this gallery
  isFeatured  Boolean      @default(false) // Featured gallery
  order       Int          @default(0) // Display order
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model GalleryImage {
  id          String   @id @map("_id") @default(auto()) @db.ObjectId
  gallery     MediaGallery @relation(fields: [galleryId], references: [id])
  galleryId   String   @db.ObjectId
  url         String   // Image URL
  thumbnail   String?  // Thumbnail URL
  altText     String?  // Alternative text
  caption     String?  // Caption for carousel/gallery
  description String?  // Longer description
  order       Int      @default(0) // Display order
  tags        String[] // Tags for filtering
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Benefits of This Design

1. **Flexibility**: Specification system allows for any type of phone spec
2. **Scalability**: Categories and subcategories for better organization
3. **Enhanced UX**: Ratings, comparisons, and wishlists improve user engagement
4. **SEO Optimization**: Meta descriptions and tags for better search visibility
5. **Analytics**: Search tracking for better understanding of user needs
6. **Rich Media Support**: Carousel images with captions and descriptions
7. **Extensibility**: Easy to add new features without major schema changes

## Carousel Image Features

The enhanced `PhoneImage` model now supports:

1. **Captions**: Short text that appears with the image in the carousel
2. **Descriptions**: Longer text content for detailed information
3. **Image Types**: Categorization of images (photos, diagrams, renders, etc.)
4. **Ordering**: Control over the sequence of images in the carousel
5. **Tags**: For filtering and searching images
6. **Accessibility**: Alt text for screen readers
7. **Thumbnails**: Optimized smaller versions for faster loading

## Migration Considerations

When migrating from the current schema:
1. Preserve existing data
2. Map current specifications to the new specification system
3. Create default specification categories
4. Migrate images to include caption fields (can be initially empty)
5. Add new fields with default values where appropriate
6. Update API endpoints to handle the new image structure
7. Modify frontend components to display captions with carousel images