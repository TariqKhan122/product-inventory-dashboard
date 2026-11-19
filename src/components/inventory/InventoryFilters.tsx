import React from 'react';
import {
  CategoryItem,
  ProductFilterState,
  ProductSortField,
} from '../../types/product.types';
import {
  SearchIcon,
  CloseIcon,
  TableIcon,
  GridIcon,
  ArrowUpDownIcon,
} from '../common/Icons';

export type ViewMode = 'table' | 'grid';

interface InventoryFiltersProps {
  filters: ProductFilterState;
  searchInput: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  categories: CategoryItem[];
  isCategoriesLoading: boolean;
  onCategoryChange: (category: string) => void;
  onSortChange: (sortBy: ProductSortField) => void;
  onOrderToggle: () => void;
  onLimitChange: (limit: number) => void;
  onResetFilters: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const InventoryFilters: React.FC<InventoryFiltersProps> = ({
  filters,
  searchInput,
  onSearchChange,
  onClearSearch,
  categories,
  isCategoriesLoading,
  onCategoryChange,
  onSortChange,
  onOrderToggle,
  onLimitChange,
  onResetFilters,
  viewMode,
  onViewModeChange,
}) => {
  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.category && filters.category !== 'all') ||
    filters.sortBy !== 'price' ||
    filters.order !== 'asc';

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs mb-6 space-y-4">
      {/* Primary Row: Search Bar, Category Dropdown, Sort, View Toggle */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search Input with Debouncing */}
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <SearchIcon size={18} />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products by title, brand, or tag..."
            className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all"
          />
          {searchInput && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label="Clear search"
            >
              <CloseIcon size={16} />
            </button>
          )}
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Category Dropdown */}
          <div className="min-w-[140px] sm:min-w-[170px]">
            <select
              value={filters.category}
              onChange={(e) => onCategoryChange(e.target.value)}
              disabled={isCategoriesLoading}
              className="w-full text-xs sm:text-sm py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all cursor-pointer capitalize"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Field */}
          <div className="min-w-[120px]">
            <select
              value={filters.sortBy}
              onChange={(e) => onSortChange(e.target.value as ProductSortField)}
              className="w-full text-xs sm:text-sm py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all cursor-pointer"
            >
              <option value="price">Sort: Price</option>
              <option value="rating">Sort: Rating</option>
              <option value="stock">Sort: Stock</option>
              <option value="title">Sort: Title</option>
            </select>
          </div>

          {/* Ascending / Descending Toggle */}
          <button
            type="button"
            onClick={onOrderToggle}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
            title={`Sort order: ${filters.order === 'asc' ? 'Ascending' : 'Descending'}`}
          >
            <ArrowUpDownIcon size={14} />
            <span className="uppercase text-[11px] font-bold tracking-wider">
              {filters.order}
            </span>
          </button>

          {/* Limit selector */}
          <select
            value={filters.limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="text-xs sm:text-sm py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 cursor-pointer"
            title="Items per page"
          >
            <option value="10">10 / page</option>
            <option value="20">20 / page</option>
            <option value="50">50 / page</option>
          </select>

          {/* Table / Grid view switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <TableIcon size={16} />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <GridIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips & Reset */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium">Active filters:</span>

          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">
              Query: "{filters.search}"
              <button
                type="button"
                onClick={onClearSearch}
                className="hover:text-indigo-900 cursor-pointer"
              >
                <CloseIcon size={12} />
              </button>
            </span>
          )}

          {filters.category && filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-medium border border-indigo-100 capitalize">
              Category: {filters.category}
              <button
                type="button"
                onClick={() => onCategoryChange('all')}
                className="hover:text-indigo-900 cursor-pointer"
              >
                <CloseIcon size={12} />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer ml-auto"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
