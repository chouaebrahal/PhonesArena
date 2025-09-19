import PostCard from "@/components/postCard/PostCard";
import { PhoneType } from "@/lib/types";
import LoadMorePhones from "@/components/LoadMorePhones";

type LatesPostsProps = {
  phones: PhoneType[];
  searchTerm?: string;
  brandTerm?: string;
};

const LatestPosts = ({ phones, searchTerm, brandTerm }: LatesPostsProps) => {
  const [latest, ...others] = phones;
  const initialNextCursor = phones.length >= 5 ? phones[4].id : null;

  return (
    <div>
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-10">
        {/* Latest post (left side, half width) */}
        <div>
          {latest ? (
            <PostCard key={latest.id} post={latest} latest={true} />
          ) : (
            <div>No posts to display</div>
          )}
        </div>

        {/* Other posts (right side, half width) */}
        <div className="grid grid-cols-2 gap-4">
          {others.map((post) => (
            <PostCard key={post.id} post={post} latest={false} />
          ))}
        </div>
      </div>

      {/* Load More Button - Client Component */}
      <LoadMorePhones 
        initialNextCursor={initialNextCursor} 
        searchTerm={searchTerm}
        brandTerm={brandTerm}
      />
    </div>
  );
};

export default LatestPosts;
