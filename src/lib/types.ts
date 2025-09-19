export interface BrandType {
  id: string;
  name: string;
  slug: string;
}

export interface PhoneImageType {
  id: string;
  url: string;
  color: string | null;
  isPrimary: boolean;
}

export interface SpecificationType {
  id: string;
  key: string;
  value: string;
}

export interface PhoneType {
  id: string;
  name: string;
  slug: string;
  price: number;
  releaseDate: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
  brand: BrandType;
  images: PhoneImageType[];
  specifications: SpecificationType[];
}
