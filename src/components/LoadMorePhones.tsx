'use client';

import { useState } from 'react';
import { Phone } from '@/lib/types';
import PostCard from './postCard/PostCard';

type LoadMorePhonesProps = {
  initialNextCursor: string | null;
  searchTerm?: string;
  brandTerm?: string;
};

export default function LoadMorePhones({ initialNextCursor, searchTerm, brandTerm }: LoadMorePhonesProps) {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [loading, setLoading] = useState(false);

  const handleLoadMore = async () => {
    if (!nextCursor || loading) return;

    setLoading(true);
    try {
      const url = new URL('/api/phones', window.location.origin);
      url.searchParams.append('cursor', nextCursor);
      if (searchTerm) url.searchParams.append('searchTerm', searchTerm);
      if (brandTerm) url.searchParams.append('brandTerm', brandTerm);

      const res = await fetch(url.toString());
      if (!res.ok) {
        throw new Error('Failed to fetch more phones');
      }
      const { phones: newPhones, nextCursor: newNextCursor } = await res.json();
      setPhones((prevPhones) => [...prevPhones, ...newPhones]);
      setNextCursor(newNextCursor);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-4">
        {phones.map((phone) => (
          <PostCard key={phone.id} post={phone} />
        ))}
      </div>
      {nextCursor && (
        <div className="w-full flex justify-center mt-7">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="block px-6 py-2 bg-[var(--primary)] text-blue-800 text-sm font-medium rounded-full hover:bg-blue-200 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </>
  );
}