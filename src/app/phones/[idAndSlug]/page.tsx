import ImageCarousel from "@/components/imagecarousel/ImageCarousel";
import PhoneSpecDetail from "@/components/phonespecdetail/PhoneSpecDetail";
import PagesHeading from "@/components/pagesheading/PagesHeading";
import { notFound, redirect } from "next/navigation";
import { Phone } from "@/lib/types";
import CommentsClient from "@/components/comments/CommentsClient";
import SectionHeader from "@/components/SectionHeader";
import CommentsSection from "@/components/comments/CommentsClient";

// The API returns a different shape now, let's adjust the type
interface PhoneDetailsResponse {
  success: boolean;
  data: Phone; // The actual phone data is nested under 'data'
}

async function getPhone(id: string): Promise<Phone> { // Takes id now
  const res = await fetch(`http://localhost:3000/api/phones/${id}`, { cache: 'no-store' }); // Use id, add no-store for dynamic checking

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error('Failed to fetch phone');
  }

  const result: PhoneDetailsResponse = await res.json();
  return result.data; // Return the nested data object
}

export default async function PhoneDetailPage({ params }: { params: { idAndSlug: string } }) {
  const { idAndSlug } = params;
  const id = idAndSlug.split('-')[0];
  const slugFromUrl = idAndSlug.substring(id.length + 1);

  if (!id) {
    notFound();
  }

  const phone = await getPhone(id);
  console.log(phone);
  // Canonical URL check
  if (phone.slug !== slugFromUrl) {
    redirect(`/phones/${phone.id}-${phone.slug}`);
  }

  return (
    <div className="mx-auto py-10">
      <PagesHeading
        title={phone.name}
        author={{ name: phone.brand?.name, avatar: phone.brand?.logo || "" }}
        views={phone.viewCount}
        publishedAt={new Date(phone.releaseDate).toLocaleDateString()}
      />
      <div className="grid grid-cols-1 ">
          <SectionHeader title="Technical Specifications For" phone={phone} />
          <PhoneSpecDetail {...phone} />
          <SectionHeader title="Some Images For" phone={phone} />
        
      </div>
      <div>
          <ImageCarousel {...phone}  />
        </div>
      {/* <CommentsClient phoneId={phone.id} initialComments={phone.comments} /> */}
    </div>
  );
}