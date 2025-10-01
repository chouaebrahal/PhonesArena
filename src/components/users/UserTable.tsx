'use client';

import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import DataTable from '@/components/dashboard/DataTable';

const headers = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
];

export default function UserTable() {
  const [search, setSearch] = useState('');
  const { users, isLoading, error } = useUsers(search);

  if (error) return <div>Failed to load users</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full md:w-64 px-4 py-2 border rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <DataTable
        headers={headers}
        data={users}
        itemsPerPage={10}
        actionButtons={['edit', 'delete']}
      />
    </>
  );
}
