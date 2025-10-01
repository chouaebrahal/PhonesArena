// components/dashboard/DataTable.tsx
'use client';

import { useState, useEffect } from 'react';
import { TableHeader, TableData } from '@/lib/types/dashboard';
import { 
  ArrowDownIcon, 
  ArrowUpIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  EllipsisVerticalIcon 
} from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface DataTableProps {
  headers: TableHeader[];
  data: TableData[];
  itemsPerPage?: number;
  isLoading?: boolean;
  actionButtons?: ('edit' | 'delete')[];
  onEdit?: (row: TableData) => void;
  onDelete?: (row: TableData) => void;
  enableExport?: boolean;
  filename?: string;
  onBulkDelete?: (ids: (string | number)[]) => void;
}

export default function DataTable({ 
  headers, 
  data, 
  itemsPerPage = 10,
  isLoading,
  actionButtons,
  onEdit,
  onDelete,
  enableExport = false,
  filename = 'export',
  onBulkDelete,
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' }>({ 
    key: null, 
    direction: 'asc' 
  });
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(headers.map(h => h.key))
  );

  // Pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  // Sorting
  const sortedData = [...paginatedData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle bulk selection
  const handleSelectAll = () => {
    if (selectedRows.size === sortedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(sortedData.map(row => row.id)));
    }
  };

  const handleSelectRow = (id: string | number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  // Filter data based on search term
  const filteredData = searchTerm
    ? data.filter(row => 
        Object.values(row).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  const handleExportCSV = () => {
    const visibleData = filteredData.map(row => {
      const exportRow: Record<string, any> = {};
      headers.forEach(header => {
        if (visibleColumns.has(header.key)) {
          exportRow[header.label] = row[header.key];
        }
      });
      return exportRow;
    });

    const csv = [
      Object.keys(visibleData[0]).join(','),
      ...visibleData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && selectedRows.size > 0) {
      onBulkDelete(Array.from(selectedRows));
      setSelectedRows(new Set());
    }
  };

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'f':
            e.preventDefault();
            document.querySelector<HTMLInputElement>('input[placeholder="Search..."]')?.focus();
            break;
          case 'e':
            e.preventDefault();
            if (enableExport) handleExportCSV();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [enableExport]);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-2 border rounded-lg w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2">
            {selectedRows.size > 0 ? (
              <>
                <button className="btn-secondary">
                  Selected: {selectedRows.size}
                </button>
                <button 
                  className="btn-danger"
                  onClick={handleBulkDelete}
                >
                  Delete Selected
                </button>
              </>
            ) : (
              <>
                <div className="relative">
                  <button className="btn-secondary flex items-center gap-1">
                    <FunnelIcon className="w-4 h-4" />
                    Columns
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                    {headers.map(header => (
                      <label key={header.key} className="flex items-center px-4 py-2 hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={visibleColumns.has(header.key)}
                          onChange={() => {
                            const newColumns = new Set(visibleColumns);
                            if (newColumns.has(header.key)) {
                              newColumns.delete(header.key);
                            } else {
                              newColumns.add(header.key);
                            }
                            setVisibleColumns(newColumns);
                          }}
                          className="mr-2"
                        />
                        {header.label}
                      </label>
                    ))}
                  </div>
                </div>
                {enableExport && (
                  <button 
                    onClick={handleExportCSV}
                    className="btn-secondary flex items-center gap-1"
                  >
                    <DocumentArrowDownIcon className="w-4 h-4" />
                    Export
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 w-4">
                <input
                  type="checkbox"
                  checked={selectedRows.size === sortedData.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              {headers.map((header) => (
                visibleColumns.has(header.key) && (
                  <th 
                    key={header.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort(header.key)}
                  >
                    <div className="flex items-center">
                      {header.label}
                      {sortConfig.key === header.key && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' 
                            ? <ArrowUpIcon className="w-4 h-4" />
                            : <ArrowDownIcon className="w-4 h-4" />
                          }
                        </span>
                      )}
                    </div>
                  </th>
                )
              ))}
              {actionButtons && (
                <th className="px-6 py-3 text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={headers.length + 2} className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <LoadingSpinner />
                    <span className="text-gray-500">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={headers.length + 2} className="px-6 py-8 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  {headers.map((header) => 
                    visibleColumns.has(header.key) && (
                      <td key={header.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row[header.key]}
                      </td>
                    )
                  )}
                  {actionButtons && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {actionButtons.includes('edit') && (
                          <button
                            onClick={() => onEdit?.(row)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                        )}
                        {actionButtons.includes('delete') && (
                          <button
                            onClick={() => onDelete?.(row)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{Math.min(startIndex + itemsPerPage, data.length)}</span> of{' '}
              <span className="font-medium">{data.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === i + 1
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Keyboard shortcuts help */}
      <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100">
        Keyboard shortcuts: 
        <kbd className="mx-1 px-1 py-0.5 bg-gray-100 rounded">⌘/Ctrl + F</kbd> Search,
        <kbd className="mx-1 px-1 py-0.5 bg-gray-100 rounded">⌘/Ctrl + E</kbd> Export
      </div>
    </div>
  );
}