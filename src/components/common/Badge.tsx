import React from 'react';
import { StarIcon } from './Icons';

interface StockBadgeProps {
  stock: number;
}

export const StockBadge: React.FC<StockBadgeProps> = ({ stock }) => {
  if (stock <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
        Out of Stock
      </span>
    );
  }

  if (stock < 15) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Low Stock ({stock})
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      In Stock ({stock})
    </span>
  );
};

export const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 capitalize">
      {category.replace('-', ' ')}
    </span>
  );
};

export const DiscountBadge: React.FC<{ discountPercentage?: number }> = ({ discountPercentage }) => {
  if (!discountPercentage || discountPercentage <= 0) return null;
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
      -{Math.round(discountPercentage)}%
    </span>
  );
};

export const RatingBadge: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
      <StarIcon size={13} className="text-amber-500 fill-amber-500" />
      {rating.toFixed(1)}
    </span>
  );
};
