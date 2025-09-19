import ImageCarousel from "@/components/imagecarousel/ImageCarousel";
import PhoneSpecDetail from "@/components/phonespecdetail/PhoneSpecDetail";
import PagesHeading from "@/components/pagesheading/PagesHeading";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

const getPhone = async (slug: string) => {
  const phone = await prisma.phone.findUnique({
    where: { slug },
    include: {
      brand: true,
      images: true,
      specifications: true,
    },
  });

  if (!phone) {
    notFound();
  }

  return phone;
};

export default async function PhoneDetailPage({ params }: { params: { slug: string } }) {
  const phone = await getPhone(await params.slug);
  
  console.log("server side"+phone.images[0].url)
  return (
    <div className="mx-auto py-10">
      <PagesHeading
        title={phone.name}
        author={{ name: phone.brand.name, avatar: "" }} // Assuming brand doesn't have an avatar
        views={phone.price} // Using price for views as a placeholder
        publishedAt={new Date(phone.releaseDate).toLocaleDateString()}
      />
      <div className="grid grid-cols-1  gap-10 ">
        <div>
          <PhoneSpecDetail specifications={phone.specifications} images={phone.images} />
        </div>

      </div>
      <ImageCarousel images={phone.images} phoneName={phone.name} />
    </div>
  );
}