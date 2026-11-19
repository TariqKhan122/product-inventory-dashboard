import React from 'react';
import { Product, PatchProductDTO } from '../../types/product.types';
import { StockBadge, CategoryBadge, DiscountBadge, RatingBadge } from '../common/Badge';
import { TableSkeletonRow } from '../common/Skeleton';
import { EyeIcon, PencilIcon, TrashIcon } from '../common/Icons';
import { InlineStockEditor } from './InlineStockEditor';

interface InventoryTableProps {
  products: Product[];
  isLoading: boolean;
  onViewProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  onPatchProduct: (id: number, dto: PatchProductDTO) => Promise<boolean>;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  products,
  isLoading,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
  onPatchProduct,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th scope="col" className="py-3.5 pl-6 pr-3">
                Product Details
              </th>
              <th scope="col" className="px-3 py-3.5">
                Category
              </th>
              <th scope="col" className="px-3 py-3.5">
                Unit Price
              </th>
              <th scope="col" className="px-3 py-3.5">
                Stock Status & Quick Adjust
              </th>
              <th scope="col" className="px-3 py-3.5">
                Rating
              </th>
              <th scope="col" className="py-3.5 pl-3 pr-6 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <TableSkeletonRow key={`skeleton-${index}`} />
                ))
              : products.map((product) => (
                  <tr
                    key={product.id}
                    className="group hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Column 1: Thumbnail & Title/Brand */}
                    <td className="py-4 pl-6 pr-3">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200/80 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                            loading="lazy"
                            onError={(e) => {
                              // Fallback on broken image link
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=150&q=80';
                            }}
                          />
                        </div>

                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => onViewProduct(product)}
                            className="font-semibold text-slate-900 hover:text-indigo-600 text-left line-clamp-1 cursor-pointer transition-colors"
                            title={product.title}
                          >
                            {product.title}
                          </button>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                            <span>{product.brand || 'Unbranded'}</span>
                            {product.sku && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-[11px] text-slate-500">
                                  {product.sku}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Category */}
                    <td className="px-3 py-4 whitespace-nowrap">
                      <CategoryBadge category={product.category} />
                    </td>

                    {/* Column 3: Price & Discount */}
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.discountPercentage > 0 && (
                          <div className="mt-0.5">
                            <DiscountBadge discountPercentage={product.discountPercentage} />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Column 4: Stock Badge & Inline Stock Editor (PATCH) */}
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <StockBadge stock={product.stock} />
                        <InlineStockEditor
                          productId={product.id}
                          currentStock={product.stock}
                          onPatch={onPatchProduct}
                        />
                      </div>
                    </td>

                    {/* Column 5: Rating */}
                    <td className="px-3 py-4 whitespace-nowrap">
                      <RatingBadge rating={product.rating} />
                    </td>

                    {/* Column 6: Actions */}
                    <td className="py-4 pl-3 pr-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewProduct(product)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="View Product Specs"
                          aria-label={`View ${product.title}`}
                        >
                          <EyeIcon size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onEditProduct(product)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Full Edit (PUT)"
                          aria-label={`Edit ${product.title}`}
                        >
                          <PencilIcon size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteProduct(product)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Product (DELETE)"
                          aria-label={`Delete ${product.title}`}
                        >
                          <TrashIcon size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
