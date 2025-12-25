
import React from 'react';
import { ModelCategory, LicenseType, ModelArchitecture, FilterOptions } from '../types';
import { CATEGORY_OPTIONS, LICENSE_OPTIONS, ARCHITECTURE_OPTIONS, PRICING_FILTER_OPTIONS } from '../constants';
import { FilterIcon, XMarkIcon } from './IconComponents';

interface ModelFilterProps {
  filters: FilterOptions;
  onFilterChange: <K extends keyof FilterOptions,>(key: K, value: FilterOptions[K]) => void;
  onResetFilters: () => void;
  uniqueTagOptions?: string[];
}

const ModelFilter: React.FC<ModelFilterProps> = ({ filters, onFilterChange, onResetFilters }) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, key: keyof FilterOptions) => {
    const value = e.target.value === 'all' ? undefined : e.target.value;
    onFilterChange(key, value as any); // Cast as any due to dynamic key/value types
  };
  
  const hasActiveFilters = Object.values(filters).some(value => value !== undefined);

  return (
    <div className="p-6 bg-card-light dark:bg-card-dark rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-text-light dark:text-text-dark flex items-center">
          <FilterIcon size={22} className="mr-2 text-primary-DEFAULT" />
          Filter Models
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-sm text-primary-DEFAULT hover:text-primary-dark dark:hover:text-primary-light flex items-center"
          >
            <XMarkIcon size={16} className="mr-1" />
            Reset Filters
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Category</label>
          <select
            id="category-filter"
            value={filters.category || 'all'}
            onChange={(e) => handleSelectChange(e, 'category')}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-primary-DEFAULT focus:border-primary-DEFAULT"
          >
            <option value="all">All Categories</option>
            {CATEGORY_OPTIONS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="license-filter" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">License</label>
          <select
            id="license-filter"
            value={filters.license || 'all'}
            onChange={(e) => handleSelectChange(e, 'license')}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-primary-DEFAULT focus:border-primary-DEFAULT"
          >
            <option value="all">All Licenses</option>
            {LICENSE_OPTIONS.map(lic => <option key={lic} value={lic}>{lic}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="architecture-filter" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Architecture</label>
          <select
            id="architecture-filter"
            value={filters.architecture || 'all'}
            onChange={(e) => handleSelectChange(e, 'architecture')}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-primary-DEFAULT focus:border-primary-DEFAULT"
          >
            <option value="all">All Architectures</option>
            {ARCHITECTURE_OPTIONS.map(arch => <option key={arch} value={arch}>{arch}</option>)}
          </select>
        </div>
        
        <div>
          <label htmlFor="pricing-filter" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Pricing Model</label>
          <select
            id="pricing-filter"
            value={filters.pricing || 'all'}
            onChange={(e) => handleSelectChange(e, 'pricing')}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-primary-DEFAULT focus:border-primary-DEFAULT"
          >
            {PRICING_FILTER_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ModelFilter;
