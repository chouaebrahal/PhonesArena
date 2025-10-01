'use client';

import { useState } from 'react';
import { Phone, PhoneStatus, Brand } from '@prisma/client';
import LoadingSpinner from '../common/LoadingSpinner';

interface PhoneFormProps {
  phone?: Partial<Phone> | null;
  brands: Brand[];
  onSubmit: (data: Partial<Phone>) => Promise<void>;
  onCancel: () => void;
}

export default function PhoneForm({ phone, brands, onSubmit, onCancel }: PhoneFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [specifications, setSpecifications] = useState<Array<{ key: string; value: string }>>(
    Object.entries(phone?.specifications || {}).map(([key, value]) => ({ key, value: String(value) }))
  );
  const [formData, setFormData] = useState<Partial<Phone>>(phone || {
    name: '',
    slug: '',
    model: '',
    series: '',
    status: PhoneStatus.DRAFT,
    description: '',
    currentPrice: 0,
    launchPrice: 0,
    brandId: '',
    specifications: {},
    isAvailable: true,
    stockStatus: 'in-stock'
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.brandId) newErrors.brandId = 'Brand is required';
    if (!formData.currentPrice || formData.currentPrice <= 0) newErrors.currentPrice = 'Valid price is required';
    if (!formData.model?.trim()) newErrors.model = 'Model is required';
    if (formData.stock! < 0) newErrors.stock = 'Stock cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Convert specifications array to object
      const specsObject = specifications.reduce((acc, { key, value }) => {
        if (key && value) acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      await onSubmit({
        ...formData,
        specifications: specsObject
      });
    } catch (error) {
      setErrors({ submit: 'Failed to save phone' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>
      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700">Brand</label>
        <select
          value={formData.brandId || ''}
          onChange={e => setFormData({ ...formData, brandId: parseInt(e.target.value) })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        >
          <option value="">Select Brand</option>
          {brands.map(brand => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>
      {errors.brandId && <p className="text-sm text-red-500">{errors.brandId}</p>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <input
            type="text"
            value={formData.model || ''}
            onChange={e => setFormData({ ...formData, model: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Series</label>
          <input
            type="text"
            value={formData.series || ''}
            onChange={e => setFormData({ ...formData, series: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Price</label>
          <input
            type="number"
            value={formData.currentPrice || ''}
            onChange={e => setFormData({ ...formData, currentPrice: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Original Price</label>
          <input
            type="number"
            value={formData.originalPrice || ''}
            onChange={e => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          value={formData.status || PhoneStatus.DRAFT}
          onChange={e => setFormData({ ...formData, status: e.target.value as PhoneStatus })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value={PhoneStatus.DRAFT}>Draft</option>
          <option value={PhoneStatus.ACTIVE}>Active</option>
          <option value={PhoneStatus.DISCONTINUED}>Discontinued</option>
          <option value={PhoneStatus.UPCOMING}>Upcoming</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description || ''}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          rows={3}
        />
      </div>

      {/* Specifications Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Specifications</label>
        {specifications.map((spec, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              placeholder="Key"
              value={spec.key}
              onChange={e => updateSpecification(index, 'key', e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2"
            />
            <input
              type="text"
              placeholder="Value"
              value={spec.value}
              onChange={e => updateSpecification(index, 'value', e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addSpecification}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          + Add Specification
        </button>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              Saving...
            </div>
          ) : phone ? 'Update Phone' : 'Add Phone'}
        </button>
      </div>
      {errors.submit && (
        <p className="text-sm text-red-500 text-center">{errors.submit}</p>
      )}
    </form>
  );
}
