import { Brand } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

async function getBrands(): Promise<Brand[]> {
  // In a real app, you'd fetch from your absolute URL
  // For this example, we'll assume it's running on localhost
  const res = await fetch('http://localhost:3000/api/brands?limit=20&sortBy=phoneCount&sortOrder=desc', { next: { revalidate: 3600 } }); // Revalidate every hour
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch brands');
  }
 
  const data = await res.json();
  return data.data; // The API returns { success, data, pagination }
}


const Categories = async () => {
  const brands = await getBrands();

  return (
    <div className="py-5">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Shop by Brand</h2>
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {brands.map(brand => (
            <Link href={`/phones?brandTerm=${brand.slug}`} key={brand.id} className="flex-shrink-0 w-24 text-center">
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300">
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-xs text-gray-500">No Logo</span>
                )}
              </div>
              <p className="mt-2 text-sm font-semibold">{brand.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Categories;
