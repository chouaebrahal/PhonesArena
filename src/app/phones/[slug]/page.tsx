import ImageCarousel from "@/components/imagecarousel/ImageCarousel";
import PhoneSpecDetail from "@/components/phonespecdetail/PhoneSpecDetail";
import PagesHeading from "@/components/pagesheading/PagesHeading";
import { notFound } from "next/navigation";
import { Phone } from "@/lib/types";
import CommentsClient from "@/components/comments/CommentsClient";

async function getPhone(slug: string): Promise<Phone> {
  const res = await fetch(`http://localhost:3000/api/phones/${slug}`);

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error('Failed to fetch phone');
  }

  return res.json();
}

export default async function PhoneDetailPage({ params }: { params: { slug: string } }) {
  const phone = await getPhone(params.slug);

  return (
    <div className="mx-auto py-10">
      <PagesHeading
        title={phone.name}
        author={{ name: phone.brand.name, avatar: phone.brand.logo || "" }}
        views={phone.viewCount}
        publishedAt={new Date(phone.releaseDate).toLocaleDateString()}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 ">
        <div>
          <ImageCarousel images={phone.gallery} phoneName={phone.name} />
        </div>
        <div>
          <PhoneSpecDetail specifications={phone.specifications} />
        </div>
      </div>
      <CommentsClient phoneId={phone.id} initialComments={phone.comments} />
    </div>
  );
}