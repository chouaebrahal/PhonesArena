import Categories from "@/components/categories/Categories";
import LatestPosts from "@/components/latestposts/LatestPosts";
import PagesHeading from "@/components/pagesheading/PagesHeading";
import { Phone, Pagination } from "@/lib/types";
import { Suspense } from "react";
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from "@/components/common/ErrorFallback";
import LoadingSpinner from "@/components/common/LoadingSpinner";

async function getPhones(searchParams: { [key: string]: string | undefined }): Promise<{ data: Phone[], pagination: Pagination | null }> {
  const { searchTerm, brandTerm, limit, sortBy, sortOrder, page } = searchParams;
  const query = new URLSearchParams({
    limit: limit || '5',
    page: page || '1',
    includeColors: 'true',
    ...(searchTerm && { searchTerm }),
    ...(brandTerm && { brandTerm }),
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder }),
  }).toString();

  const res = await fetch(`http://localhost:3000/api/phones?${query}`);
  
  if (!res.ok) {
    throw new Error('Failed to fetch phones');
  }

  const result = await res.json();
  return { data: result.data, pagination: result.pagination };
}

export default async function Home({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const { data, pagination } = await getPhones(searchParams);
  
  const { searchTerm, brandTerm } = searchParams;

  return (
    <div className=" min-h-screen">
     
      <PagesHeading
        title="All Phones"
        subtitle="Explore our comprehensive list of the latest smartphones."
      />
      <div className="container mx-auto">
      <Categories />
      
      <div className="container">
        <div className="text-2xl font-bold mb-6">
          Latest Smartphones – New Phone Releases
        </div>
      </div>
     
      
        <Suspense fallback={<LoadingSpinner />}>
          <LatestPosts initialPhones={data} pagination={pagination} searchTerm={searchTerm} brandTerm={brandTerm} simple={true} />
        </Suspense>
      
      
      </div>
    </div>
  );
}