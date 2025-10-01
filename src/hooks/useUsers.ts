import useSWR from 'swr';
import { fetcher } from '@/lib/utils';

export function useUsers(search: string = '') {
  const { data, error, mutate } = useSWR(
    `/api/users${search ? `?search=${search}` : ''}`,
    fetcher
  );

  return {
    users: data?.users ?? [],
    isLoading: !error && !data,
    error,
    mutate
  };
}
