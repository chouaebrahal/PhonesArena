import LatestPosts from "@/components/latestposts/LatestPosts";
import PagesHeading from "@/components/pagesheading/PagesHeading";
import { Phone,Pagination } from "@/lib/types";

async function getPhones(searchParams: { [key: string]: string | undefined }): Promise<{ data: Phone[], pagination: Pagination | null }> {
  const { searchTerm, brandTerm, limit, sortBy, sortOrder } = await searchParams;
  const query = new URLSearchParams({
    ...(searchTerm && { searchTerm }),
    ...(brandTerm && { brandTerm }),
    ...(limit && { limit }),
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder }),
  }).toString();

  // In a real app, you'd fetch from your absolute URL
  // For this example, we'll assume it's running on localhost
  const res = await fetch(`http://localhost:3000/api/phones`)
  
  if (!res.ok) {
    throw new Error('Failed to fetch phones');
  }

  return res.json();
}

export default async function Home({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const { data, pagination } = await getPhones(searchParams);
  
  const { searchTerm, brandTerm } = await searchParams;

  return (
    <div className=" min-h-screen">
      <PagesHeading
        title="All Phones"
        subtitle="Explore our comprehensive list of the latest smartphones."
      />
      <LatestPosts initialPhones={data} nextCursor={pagination} searchTerm={searchTerm} brandTerm={brandTerm} />
    </div>
  );
}