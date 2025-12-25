import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Model, FilterOptions, LicenseType } from '../types';
import { marketplaceService } from '../services/marketplaceService';
import ModelCard from '../components/ModelCard';
import ModelFilter from '../components/ModelFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import { SearchIcon } from '../components/IconComponents';
import { SORT_OPTIONS, APP_NAME } from '../constants';
import { useDebounce } from '../hooks/useDebounce';

const ITEMS_PER_PAGE = 9;

const HomePage: React.FC = () => {
  const [allModels, setAllModels] = useState<Model[]>([]);
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortOption, setSortOption] = useState<string>(SORT_OPTIONS[0].value);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.title = `Explore AI Models | ${APP_NAME}`;
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      setIsLoading(true);
      try {
        const models = await marketplaceService.getModels();
        setAllModels(models);
        setFilteredModels(models); // Initially show all models
      } catch (err) {
        setError('Failed to fetch models. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchModels();
  }, []);

  const applyFiltersAndSort = useCallback(() => {
    let MtempModels = [...allModels];

    // Apply search term
    if (debouncedSearchTerm) {
      MtempModels = MtempModels.filter(model =>
        model.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        model.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        model.tags.some(tag => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
        model.creator.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.category) {
      MtempModels = MtempModels.filter(model => model.category === filters.category);
    }
    if (filters.license) {
      MtempModels = MtempModels.filter(model => model.license === filters.license);
    }
    if (filters.architecture) {
      MtempModels = MtempModels.filter(model => model.architecture === filters.architecture);
    }
    if (filters.pricing) {
        if (filters.pricing === 'free') {
            MtempModels = MtempModels.filter(model => model.costIndicator.toLowerCase() === 'free' || model.costIndicator.toLowerCase().includes('open source'));
        } else if (filters.pricing === 'paid') {
            MtempModels = MtempModels.filter(model => model.costIndicator.toLowerCase() !== 'free' && !model.costIndicator.toLowerCase().includes('open source'));
        } else if (filters.pricing === 'open-source') {
            MtempModels = MtempModels.filter(model => model.license !== LicenseType.PROPRIETARY && model.license !== LicenseType.COMMERCIAL && (model.costIndicator.toLowerCase().includes('open source') || model.costIndicator.toLowerCase() === 'free'));
        }
    }

    // Apply sort
    switch (sortOption) {
      case 'rating':
        MtempModels.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'popularity':
        MtempModels.sort((a, b) => b.totalReviews - a.totalReviews);
        break;
      case 'name_asc':
        MtempModels.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        MtempModels.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest': // Assuming models are fetched with newest first or have a date property
        // For mock data, let's assume original order is newest or use ID as proxy
        MtempModels.reverse(); // Simple reverse, or sort by an ID/date if available
        break;
    }
    
    setFilteredModels(MtempModels);
    setCurrentPage(1); // Reset to first page after filtering/sorting
  }, [allModels, debouncedSearchTerm, filters, sortOption]);


  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);


  const handleFilterChange = <K extends keyof FilterOptions,>(key: K, value: FilterOptions[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const handleResetFilters = () => {
    setFilters({});
    // setSearchTerm(''); // Optionally reset search term too
  };

  const paginatedModels = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredModels.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredModels, currentPage]);

  const totalPages = Math.ceil(filteredModels.length / ITEMS_PER_PAGE);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]"><LoadingSpinner size="lg" text="Loading models..." /></div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-text-light dark:text-text-dark mb-2">Explore AI Models</h1>
        <p className="text-lg text-text-muted-light dark:text-text-muted-dark">Discover, integrate, and build with the latest AI capabilities.</p>
      </div>

      {/* Search and Sort Bar */}
      <div className="mb-8 p-4 bg-card-light dark:bg-card-dark rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search models by name, tag, or creator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-primary-DEFAULT focus:border-primary-DEFAULT"
            />
            <SearchIcon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex-shrink-0">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-primary-DEFAULT focus:border-primary-DEFAULT"
            >
              {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-3">
          <ModelFilter 
            filters={filters} 
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </div>
        
        <div className="md:col-span-9">
          {paginatedModels.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedModels.map(model => (
                  <ModelCard key={model.id} model={model} />
                ))}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-text-light dark:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    // Show limited page numbers e.g. max 5 buttons
                    .filter(pageNumber => Math.abs(pageNumber - currentPage) < 3 || pageNumber === 1 || pageNumber === totalPages) 
                    .map((pageNumber, index, arr) => (
                      <React.Fragment key={pageNumber}>
                        {index > 0 && pageNumber - arr[index-1] > 1 && <span className="px-2">...</span>}
                        <button
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`px-4 py-2 border rounded-md text-sm font-medium
                            ${currentPage === pageNumber 
                              ? 'bg-primary-DEFAULT text-white border-primary-DEFAULT' 
                              : 'border-gray-300 dark:border-gray-600 text-text-light dark:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                          {pageNumber}
                        </button>
                      </React.Fragment>
                    ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-text-light dark:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10 col-span-full">
              <p className="text-xl text-text-muted-light dark:text-text-muted-dark">No models match your criteria.</p>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-2">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;