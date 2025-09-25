/**
 * NOTE: This file is manually generated from the prisma/schema.prisma file.
 * For many use cases, it's better to use the auto-generated types from the Prisma client.
 * import { Phone, Brand } from '@prisma/client';
 */

// Enums
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
}

export enum PhoneStatus {
  ACTIVE = 'ACTIVE',
  DISCONTINUED = 'DISCONTINUED',
  UPCOMING = 'UPCOMING',
  DRAFT = 'DRAFT',
}

export enum SpecificationCategory {
  DISPLAY = 'DISPLAY',
  PERFORMANCE = 'PERFORMANCE',
  CAMERA = 'CAMERA',
  BATTERY = 'BATTERY',
  CONNECTIVITY = 'CONNECTIVITY',
  BUILD = 'BUILD',
  SOFTWARE = 'SOFTWARE',
  AUDIO = 'AUDIO',
  SENSORS = 'SENSORS',
  PRICING = 'PRICING',
  OTHER = 'OTHER',
}

export enum CommentStatus {
  PUBLISHED = 'PUBLISHED',
  PENDING = 'PENDING',
  HIDDEN = 'HIDDEN',
  REPORTED = 'REPORTED',
}

// Model Interfaces
export interface User {
  id: string;
  email: string;
  username?: string;
  name: string;
  password?: string; // Often omitted from client-side types
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  emailNotifications: boolean;
  marketingEmails: boolean;
  preferredCurrency: string;
  preferredLanguage: string;
  emailVerified: boolean;
  emailVerifiedAt?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  wishlists?: Wishlist[];
  comparisons?: Comparison[];
  comments?: Comment[];
  ratings?: Rating[];
  reviews?: Review[];
  followers?: Follow[];
  following?: Follow[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  displayName?: string;
  description?: string;
  logo?: string;
  website?: string;
  headquarters?: string;
  foundedYear?: number;
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
  isVerified: boolean;
  phoneCount: number;
  averageRating?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  phones?: Phone[];
}

export interface Phone {
  id: string;
  name: string;
  slug: string;
  model?: string;
  series?: string;
  status: PhoneStatus;
  releaseDate: string;
  discontinuedAt?: string;
  announcedAt?: string;
  description?: string;
  shortDescription?: string;
  keyFeatures: string[];
  launchPrice?: number;
  currentPrice?: number;
  currency: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  primaryImage?: string;
  gallery?: PhoneImage[];
  videos: string[];
  viewCount: number;
  likeCount: number;
  reviewCount: number;
  averageRating: number;
  isAvailable: boolean;
  stockStatus?: string;
  brandId: string;
  brand?: Brand;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  specifications?: PhoneSpecification[];
  colors?: PhoneColor[];
  variants?: PhoneVariant[];
  comments?: Comment[];
  reviews?: Review[];
  wishlists?: Wishlist[];
  comparisonItems?: ComparisonItem[];
  ratings?: Rating[];
}

export interface PhoneVariant {
  id: string;
  name: string;
  storage: string;
  ram: string;
  price?: number;
  currency: string;
  isAvailable: boolean;
  stockCount?: number;
  phoneId: string;
  phone?: Phone;
  createdAt: string;
  updatedAt: string;
}

export interface PhoneSpecification {
  id: string;
  key: string;
  value: string;
  displayName?: string;
  unit?: string;
  category: SpecificationCategory;
  imageUrl?: string;
  description?: string;
  priority: number;
  isHighlight: boolean;
  phoneId: string;
  phone?: Phone;
  createdAt: string;
  updatedAt: string;
}

export interface PhoneColor {
  id: string;
  name: string;
  hexCode: string;
  imageUrl: string;
  isDefault: boolean;
  isAvailable: boolean;
  priority: number;
  description?: string;
  phoneId: string;
  phone?: Phone;
  createdAt: string;
  updatedAt: string;
}

export interface PhoneImage {
  id: string;
  url: string;
  description?: string;
  altText?: string;
  order: number;
  phoneId: string;
  phone?: Phone;
  createdAt: string;
  updatedAt: string;
}

export interface Wishlist {
  id: string;
  notes?: string;
  priority: number;
  userId: string;
  phoneId: string;
  user?: User;
  phone?: Phone;
  createdAt: string;
  updatedAt: string;
}

export interface Comparison {
  id: string;
  name?: string;
  description?: string;
  isPublic: boolean;
  userId: string;
  user?: User;
  items?: ComparisonItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ComparisonItem {
  id: string;
  order: number;
  notes?: string;
  comparisonId: string;
  phoneId: string;
  comparison?: Comparison;
  phone?: Phone;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  status: CommentStatus;
  isEdited: boolean;
  editedAt?: string;
  moderatedBy?: string;
  moderatedAt?: string;
  reportCount: number;
  likeCount: number;
  dislikeCount: number;
  userId: string;
  phoneId: string;
  user?: User;
  phone?: Phone;
  parentId?: string;
  parent?: Comment;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  designRating?: number;
  performanceRating?: number;
  cameraRating?: number;
  batteryRating?: number;
  valueRating?: number;
  isVerifiedPurchase: boolean;
  isRecommended?: boolean;
  usageDuration?: string;
  pros: string[];
  cons: string[];
  images: string[];
  videos: string[];
  helpfulCount: number;
  notHelpfulCount: number;
  userId: string;
  phoneId: string;
  user?: User;
  phone?: Phone;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  id: string;
  value: number;
  userId: string;
  phoneId: string;
  user?: User;
  phone?: Phone;
  createdAt: string;
  updatedAt: string;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  follower?: User;
  following?: User;
  createdAt: string;
}

export interface PhoneView {
  id: string;
  phoneId: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  country?: string;
  city?: string;
  viewedAt: string;
}

export interface SearchQuery {
  id: string;
  query: string;
  results: number;
  userId?: string;
  ipAddress?: string;
  searchedAt: string;
}
export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}