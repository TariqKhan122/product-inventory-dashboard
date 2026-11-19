import React, { useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../common/Icons';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  limit,
  onPageChange,
  isLoading,
}) => {
  const totalPages = Math.ceil(totalItems / limit) || 1;

  const startRange = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endRange = Math.min(currentPage * limit, totalItems);

  // Generate page numbers with ellipses
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const delta = 2; // Number of pages to show around current

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }

    return pages;
  }, [totalPages, currentPage]);

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
      {/* Range indicator */}
      <div className="text-xs text-slate-500 font-medium">
        Showing <span className="font-semibold text-slate-900">{startRange}</span> to{' '}
        <span className="font-semibold text-slate-900">{endRange}</span> of{' '}
        <span className="font-semibold text-slate-900">{totalItems}</span> products
      </div>

      {/* Page controls */}
      <div className="flex items-center gap-1">
        {/* Prev Page Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg border border-slate-200 transition-colors cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeftIcon size={16} />
        </button>

        {/* Number Buttons */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, idx) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-xs text-slate-400 select-none"
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={`page-${pageNum}`}
                type="button"
                onClick={() => onPageChange(pageNum)}
                disabled={isLoading}
                className={`min-w-[32px] h-8 px-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Page Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg border border-slate-200 transition-colors cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRightIcon size={16} />
        </button>
      </div>
    </div>
  );
};
