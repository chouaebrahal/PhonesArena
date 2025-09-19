"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import { Share2, Heart, ArrowLeft } from "lucide-react";
import { addLikes, removeLikes } from "@/lib/queries"; // Import both functions
import { useRouter } from "next/navigation";

const SinglePostHeader = ({ likess, postid }: { likess: number, postid: number }) => {
  const [likes, setLikes] = useState(likess);
  const [hasLiked, setHasLiked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check local storage for this specific post ID
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
    if (likedPosts[postid]) {
      setHasLiked(true);
    }
  }, [postid]);

  const handleLikes = async () => {
    try {
      if (hasLiked) {
        // Optimistic UI update: decrease the count
        setLikes(prevLikes => Math.max(0, prevLikes - 1));
        setHasLiked(false);
        
        // Call the removeLikes function to update the backend
        await removeLikes(postid);
        
        // Update local storage
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
        delete likedPosts[postid];
        localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
      } else {
        // Optimistic UI update: increase the count
        setLikes(prevLikes => prevLikes + 1);
        setHasLiked(true);
        
        // Call the addLikes function to update the backend
        await addLikes(postid);
        
        // Update local storage
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
        likedPosts[postid] = true;
        localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
      }
      
      router.refresh(); // Optional: refetch data to keep server state in sync
      
    } catch (error) {
      console.error("Failed to update likes:", error);
      // Revert the UI update on error
      if (hasLiked) {
        setLikes(prevLikes => prevLikes + 1);
        setHasLiked(true);
      } else {
        setLikes(prevLikes => prevLikes - 1);
        setHasLiked(false);
      }
    }
  };

  return (
    <header className="bg-[var(--background)] after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-gradient-to-r after:from-pink-500 after:to-[var(--primary)] sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button className="flex items-center space-x-2  text-[var(--foreground)] hover:text-[var(--primary)] transition-colors" onClick={() => router.back()}>
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back to Blog</span>
          </button>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg  transition-colors">
              <Share2 size={20} className="text-[var(--foreground)] hover:text-[var(--primary)]" />
            </button>
            <button
              className="p-2 rounded-lg transition-colors"
              onClick={handleLikes}
            >
              <div className="flex items-center justify-center space-x-2">
                <Heart
                  size={20}
                  className={`cursor-pointer ${hasLiked ? "text-red-500 fill-red-500" : "text-gray-600"}`}
                />
                <span className="text-[var(--foreground)] text-[22px] m-0">{likes}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SinglePostHeader;