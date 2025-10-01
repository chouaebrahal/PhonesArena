'use client'
import PostCard from "@/components/postCard/PostCard";
import { Pagination, Phone } from "@/lib/types";
import LoadMorePhones from "@/components/LoadMorePhones";
import { motion } from "framer-motion";

type LatestPostsProps = {
  initialPhones: Phone[];
  pagination: Pagination | null;
  searchTerm?: string;
  brandTerm?: string;
  simple:boolean;
};

const LatestPosts = ({ initialPhones, pagination, searchTerm, brandTerm,simple }: LatestPostsProps) => {
   const [latest, ...others] = initialPhones;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3, // add a 0.3s delay before starting the animation
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-10">
        {/* Latest post (left side, half width) */}
        <div>
          {latest ?  (
            <PostCard key={latest.id} post={latest} latest={true} />
          ) : (
            <div>No posts to display</div>
          )}
        </div>

        {/* Other posts (right side, half width) */}
        <motion.div
          className="grid grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {others.map((post) => (
            <motion.div key={post.id} variants={itemVariants}>
              <PostCard post={post} latest={false} />
            </motion.div>
          ))}
        </motion.div>
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