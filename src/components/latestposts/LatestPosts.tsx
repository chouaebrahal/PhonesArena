import PostCard from "@/components/postCard/PostCard";
import { Pagination, Phone } from "@/lib/types";
import LoadMorePhones from "@/components/LoadMorePhones";

type LatestPostsProps = {
  initialPhones: Phone[];
  pagination: Pagination | null;
  searchTerm?: string;
  brandTerm?: string;
};

const LatestPosts = ({ initialPhones, pagination, searchTerm, brandTerm }: LatestPostsProps) => {
  
  const [latest, ...others] = initialPhones;

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
      {/* <LoadMorePhones 
        initialNextCursor={pagination.hasNextPage} 
        searchTerm={searchTerm}
        brandTerm={brandTerm}
      /> */}
    </div>
  );
};

export default LatestPosts;