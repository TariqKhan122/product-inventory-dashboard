import React, { useMemo } from 'react';
import { Product } from '../../types/product.types';
import { PackageIcon, AlertCircleIcon, DollarIcon, TrendingUpIcon } from '../common/Icons';
import { StatsSkeleton } from '../common/Skeleton';

interface InventoryStatsProps {
  products: Product[];
  total: number;
  isLoading: boolean;
}

export const InventoryStats: React.FC<InventoryStatsProps> = ({
  products,
  total,
  isLoading,
}) => {
  const stats = useMemo(() => {
    const lowStock = products.filter((p) => p.stock > 0 && p.stock < 15).length;
    const outOfStock = products.filter((p) => p.stock <= 0).length;
    const totalPageValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const avgPrice = products.length > 0
      ? products.reduce((sum, p) => sum + p.price, 0) / products.length
      : 0;

    return {
      lowStock,
      outOfStock,
      totalPageValue,
      avgPrice,
    };
  }, [products]);

  if (isLoading && products.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsSkeleton />
        <StatsSkeleton />
        <StatsSkeleton />
        <StatsSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Metric 1: Total Catalog Size */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Inventory
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <PackageIcon size={18} />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{total}</span>
          <span className="text-xs font-medium text-slate-500">total SKUs recorded</span>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          {products.length} products on current view
        </p>
      </div>

      {/* Metric 2: Low Stock Warning */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Low Stock Alerts
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircleIcon size={18} />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-amber-600">{stats.lowStock}</span>
          <span className="text-xs font-medium text-amber-700">&lt; 15 units remaining</span>
        </div>
        <p className="mt-1 text-xs text-slate-400">Requires restocking attention</p>
      </div>

      {/* Metric 3: Out of Stock Warning */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Out of Stock
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircleIcon size={18} />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-rose-600">{stats.outOfStock}</span>
          <span className="text-xs font-medium text-rose-700">0 units in stock</span>
        </div>
        <p className="mt-1 text-xs text-slate-400">Unavailable for fulfillment</p>
      </div>

      {/* Metric 4: Average Item Price */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Avg Unit Price
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarIcon size={18} />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">
            ${stats.avgPrice.toFixed(2)}
          </span>
          <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5">
            <TrendingUpIcon size={12} /> Active view
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Page value: ${stats.totalPageValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
      </div>
    </div>
  );
};
