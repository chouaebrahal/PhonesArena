import Image from "next/image";
import { Eye } from "lucide-react";
import { Phone } from "@/lib/types";
import Link from "next/link";

type PostCardProps = {
  post: Phone;
  latest?: boolean;
};

const  PostCard = ({ post, latest }: PostCardProps) => {
  const { name, slug, releaseDate, launchPrice, brand, primaryImage, description } = post;

  const excerpt = description;
 

  return (
    <Link
      href={`/phones/${slug}`}
      className={`overflow-hidden cursor-pointer rounded-lg  transition-all duration-300`}
    >
      {/* Image */}
      <div
        className={`relative w-full ${
          latest ? "h-[400px] sm:h-[500px]" : "h-[180px] sm:h-[220px]"
        } overflow-hidden`}
      >
        <Image
          alt={name}
          src={primaryImage ?? "/next.svg"}
          width={800}
          height={500}
          className="w-full h-full object-cover hover:scale-105 duration-300"
        />
        {/* Views badge */}
        <div className="absolute bottom-2 right-2 flex items-center bg-black/60 text-[13px] px-2 py-1 rounded-full text-yellow-100">
          <Eye className="text-white w-4 h-4 mr-1" />
          <span>{launchPrice}</span>
        </div>
      </div>

      {/* Content */}
      <div className={`py-4 flex flex-col ${latest ? "gap-4" : "gap-2"}`}>
        {/* Category */}
        <button className="px-3 py-1 text-[var(--foreground)] text-[13px] font-semibold w-fit rounded-full border bg-[var(--primary)] hover:bg-yellow-400 transition">
          {brand?.name}
        </button>

        {/* Title & Date */}
        <div>
          <h2
            className={`font-bold mb-2 ${
              latest ? "text-2xl leading-snug" : "text-lg leading-snug"
            } text-[var(--foreground)]`}
          >
            {name}
          </h2>
          <p
            className={`${
              latest ? "text-[15px]" : "text-[12px]"
            } text-[var(--primary)] mb-2`}
          >
            {new Date(releaseDate).toLocaleDateString()}
          </p>
        </div>

        {/* Excerpt */}
        <p
          className={`${
            latest ? "text-[16px]" : "text-[14px]"
          } text-[var(--foreground)] line-clamp-3`}
        >
          {excerpt}
        </p>
      </div>
    </Link>
  );
};

export default PostCard;

