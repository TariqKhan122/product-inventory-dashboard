import React from 'react';
import { Product, PatchProductDTO } from '../../types/product.types';
import { StockBadge, CategoryBadge, DiscountBadge, RatingBadge } from '../common/Badge';
import { CardSkeleton } from '../common/Skeleton';
import { EyeIcon, PencilIcon, TrashIcon } from '../common/Icons';
import { InlineStockEditor } from './InlineStockEditor';

interface InventoryGridProps {
  products: Product[];
  isLoading: boolean;
  onViewProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  onPatchProduct: (id: number, dto: PatchProductDTO) => Promise<boolean>;
}

export const InventoryGrid: React.FC<InventoryGridProps> = ({
  products,
  isLoading,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
  onPatchProduct,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <CardSkeleton key={`grid-skeleton-${index}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="group bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
        >
          <div>
            {/* Image Preview & Badges */}
            <div className="relative w-full h-44 bg-slate-50 rounded-lg overflow-hidden mb-3 border border-slate-100 flex items-center justify-center p-3">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=300&q=80';
                }}
              />
              <div className="absolute top-2 left-2">
                <CategoryBadge category={product.category} />
              </div>
              <div className="absolute top-2 right-2">
                <RatingBadge rating={product.rating} />
              </div>
            </div>

            {/* Title & Brand */}
            <div className="mb-2">
              <div className="text-[11px] font-medium text-slate-400">
                {product.brand || 'Unbranded'}
              </div>
              <button
                type="button"
                onClick={() => onViewProduct(product)}
                className="font-bold text-slate-900 hover:text-indigo-600 text-left line-clamp-1 cursor-pointer transition-colors"
                title={product.title}
              >
                {product.title}
              </button>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                {product.description}
              </p>
            </div>

            {/* Pricing & Stock status */}
            <div className="flex items-center justify-between mt-3 mb-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-slate-900">
                  ${product.price.toFixed(2)}
                </span>
                <DiscountBadge discountPercentage={product.discountPercentage} />
              </div>
              <StockBadge stock={product.stock} />
            </div>

            {/* Inline Stock Adjustment (PATCH) */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 mb-3">
              <span className="text-xs text-slate-500 font-medium">Quick Stock:</span>
              <InlineStockEditor
                productId={product.id}
                currentStock={product.stock}
                onPatch={onPatchProduct}
              />
            </div>
          </div>

          {/* Card Action Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onViewProduct(product)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
            >
              <EyeIcon size={14} /> Full Specs
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onEditProduct(product)}
                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                title="Edit Product (PUT)"
              >
                <PencilIcon size={15} />
              </button>
              <button
                type="button"
                onClick={() => onDeleteProduct(product)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Delete Product (DELETE)"
              >
                <TrashIcon size={15} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
