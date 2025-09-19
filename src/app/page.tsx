import LatestPosts from "@/components/latestposts/LatestPosts";
import PagesHeading from "@/components/pagesheading/PagesHeading";
import prisma from "@/lib/prisma";

const getPhones = async (searchTerm?: string, brandTerm?: string) => {
  let where: any = {};
  if (searchTerm) {
    where.name = { contains: searchTerm, mode: 'insensitive' };
  }
  if (brandTerm) {
    where.brand = { slug: brandTerm };
  }

  const phones = await prisma.phone.findMany({
    take: 5,
    where,
    include: {
      brand: true,
      images: true,
      specifications: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return phones;
};

export default async function Home({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const searchTerm = searchParams.searchTerm;
  const brandTerm = searchParams.brandTerm;

  const phones = await getPhones(searchTerm, brandTerm);

  return (
    <div className=" min-h-screen">
      <PagesHeading
        title="Welcome to Our Blog"
        views={1234}
        author={{ name: "Chouaeb Rahal", avatar: "/images/49.png" }}
        publishedAt="September 11, 2025"
      />
      <LatestPosts phones={phones} searchTerm={searchTerm} brandTerm={brandTerm} />
    </div>
  );
}
