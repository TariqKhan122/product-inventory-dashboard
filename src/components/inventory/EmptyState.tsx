import React from 'react';
import { Button } from '../common/Button';
import { SearchIcon, RefreshIcon } from '../common/Icons';

interface EmptyStateProps {
  searchQuery?: string;
  onReset: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery, onReset }) => {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 mx-auto flex items-center justify-center mb-4">
        <SearchIcon size={32} />
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-1">No products found</h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        {searchQuery
          ? `We couldn't find any inventory items matching "${searchQuery}". Check for typos or adjust your filter parameters.`
          : 'There are currently no products matching your selected category and filter criteria.'}
      </p>

      <Button
        variant="primary"
        size="md"
        onClick={onReset}
        leftIcon={<RefreshIcon size={16} />}
      >
        Reset All Filters
      </Button>
    </div>
  );
};
