import FilterSidebar from "@/components/FilterSidebar";
import LatestPosts from "@/components/latestposts/LatestPosts";
import PagesHeading from "@/components/pagesheading/PagesHeading";
import { Phones } from "@/components/phonesPage";
import { Phone, Pagination } from "@/lib/types";

async function getPhones(searchParams: { [key: string]: string | string[] | undefined }): Promise<{ data: Phone[], pagination: Pagination | null }> {
  const params =  new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
      if (typeof value === 'string') {
        params.set(key, value);
      } else if (Array.isArray(value)) {
        params.set(key, value.join(','));
      }
  }
  params.set("includeColors" , 'true',)
  const query = params.toString();

  const res = await fetch(`http://localhost:3000/api/phones?${query}`, { cache: 'no-store' });
  
  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`API Error: ${res.status} ${res.statusText}`, errorBody);
    throw new Error('Failed to fetch phones');
  }

  return res.json();
}

export default async function PhonesPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const { data, pagination } = await getPhones(searchParams);

  return (
    <div className="w-full">
      <PagesHeading
        title="All Phones"
        subtitle="Explore our comprehensive list of the latest smartphones."
      />
      
      <div className="flex gap-4 w-full">
        <aside><FilterSidebar totalResults={pagination?.totalCount} /></aside>
        <main className="w-full sm:w-fit">
          <Phones phones={data} />
        </main>
      </div>
    </div>
  );
}
