export interface Phone {
  id: number;
  name: string;
  brand: string;
  price: number;
  description: string;
  stock: number;
  viewCount: number;
  specifications: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PhoneFilters {
  search?: string;
  brand?: string;
  priceRange?: [number, number];
  inStock?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}
