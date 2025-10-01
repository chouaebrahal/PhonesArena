'use client';

import { Phone, Brand, PhoneStatus } from '@prisma/client';
import { useState } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

interface PhoneWithBrand extends Phone {
  brand: Brand;
}

interface PhoneTableProps {
  phones: PhoneWithBrand[];
  isLoading?: boolean;
  onEdit?: (phone: PhoneWithBrand) => void;
  onDelete?: (phone: PhoneWithBrand) => void;
}

const getStatusColor = (status: PhoneStatus) => {
  switch (status) {
    case PhoneStatus.ACTIVE:
      return 'bg-green-100 text-green-800';
    case PhoneStatus.DISCONTINUED:
      return 'bg-red-100 text-red-800';
    case PhoneStatus.UPCOMING:
      return 'bg-blue-100 text-blue-800';
    case PhoneStatus.DRAFT:
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function PhoneTable({ 
  phones, 
  isLoading,
  onEdit,
  onDelete 
}: PhoneTableProps) {
  const [sortField, setSortField] = useState<keyof Phone>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof Phone) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedPhones = [...phones].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return -direction;
    if (bValue == null) return direction;
    return aValue < bValue ? -direction : aValue > bValue ? direction : 0;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
              Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Brand
            </th>
            <th onClick={() => handleSort('model')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
              Model {sortField === 'model' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('currentPrice')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
              Price {sortField === 'currentPrice' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('status')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
              Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('viewCount')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
              Views {sortField === 'viewCount' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('averageRating')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
              Rating {sortField === 'averageRating' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedPhones.map(phone => (
            <tr key={phone.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{phone.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{phone.brand.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{phone.model}</td>
              <td className="px-6 py-4 whitespace-nowrap">${phone.currentPrice.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(phone.status)}`}>
                  {phone.status.toLowerCase()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{phone.viewCount}</td>
              <td className="px-6 py-4 whitespace-nowrap">{phone.averageRating.toFixed(1)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {onEdit && (
                  <button
                    onClick={() => onEdit(phone)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this phone?')) {
                        onDelete(phone);
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
