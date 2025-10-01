import useSWR from 'swr';
import { useState, useCallback } from 'react';
import { Phone, PhoneFilters, ApiResponse } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';

// Add response type
interface PhonesResponse {
  phones: Phone[];
  total: number;
}

// Add error type
interface ApiError {
  message: string;
  status: number;
}

export function usePhones() {
  const [filters, setFilters] = useState<PhoneFilters>({
    search: '',
    brand: '',
    priceRange: [0, 5000],
    inStock: undefined
  });

  const fetchPhones = useCallback(async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch phones');
    }
    return response.json();
  }, []);

  const { data, error, mutate } = useSWR<ApiResponse<{ phones: Phone[]; total: number }>>(
    `/api/phones?${new URLSearchParams(filters as any)}`,
    fetchPhones,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
      errorRetryCount: 3
    }
  )

  const addPhone = async (phone: Partial<Phone>) => {
    try {
      const optimisticPhone = { ...phone, id: Date.now() }
      mutate({ phones: [...(data?.phones || []), optimisticPhone] }, false)
      
      await fetch('/api/phones', {
        method: 'POST',
        body: JSON.stringify(phone)
      })
      
      toast({ title: 'Phone added successfully' })
      mutate() // Revalidate
    } catch (error) {
      toast({ 
        title: 'Error adding phone',
        variant: 'destructive'
      })
      mutate() // Revert on error
    }
  }

  const updatePhone = async (id: number, updates: Partial<Phone>) => {
    try {
      // Optimistic update
      const optimisticPhones = data?.phones.map(p => 
        p.id === id ? { ...p, ...updates } : p
      );
      mutate({ phones: optimisticPhones || [], total: data?.total || 0 }, false);

      const response = await fetch(`/api/phones/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update phone');

      toast({ title: 'Phone updated successfully' });
      mutate(); // Revalidate
    } catch (error) {
      toast({ 
        title: 'Error updating phone',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive'
      });
      mutate(); // Revert on error
    }
  };

  const deletePhone = async (id: number) => {
    try {
      // Optimistic delete
      const optimisticPhones = data?.phones.filter(p => p.id !== id);
      mutate({ 
        phones: optimisticPhones || [], 
        total: (data?.total || 0) - 1 
      }, false);

      const response = await fetch(`/api/phones/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete phone');

      toast({ title: 'Phone deleted successfully' });
      mutate(); // Revalidate
    } catch (error) {
      toast({ 
        title: 'Error deleting phone',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive'
      });
      mutate(); // Revert on error
    }
  };

  return {
    phones: data?.data.phones || [],
    total: data?.data.total || 0,
    isLoading: !error && !data,
    isError: error,
    filters,
    setFilters,
    addPhone,
    updatePhone,
    deletePhone,
    mutate
  }
}
