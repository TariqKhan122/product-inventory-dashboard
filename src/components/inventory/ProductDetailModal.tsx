import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { StockBadge, CategoryBadge, DiscountBadge, RatingBadge } from '../common/Badge';
import { PencilIcon, ShieldCheckIcon, TruckIcon, StarIcon } from '../common/Icons';
import { useProductDetail } from '../../hooks/useProductDetail';
import { Product } from '../../types/product.types';

interface ProductDetailModalProps {
  productId: number | null;
  onClose: () => void;
  onEdit: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  productId,
  onClose,
  onEdit,
}) => {
  const { product, isLoading, error, reload } = useProductDetail(productId);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  // If closed or no id, do not render
  if (productId === null) return null;

  return (
    <Modal
      isOpen={productId !== null}
      onClose={onClose}
      title={product ? product.title : 'Loading Product Details...'}
      description={product ? `SKU: ${product.sku || 'N/A'} • ID #${product.id}` : undefined}
      maxWidth="3xl"
    >
      {isLoading ? (
        <div className="py-16 text-center">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mb-3" />
          <p className="text-sm font-semibold text-slate-600">
            Fetching product specifications from REST API...
          </p>
        </div>
      ) : error ? (
        <div className="py-8 text-center bg-rose-50 rounded-xl p-6 border border-rose-100">
          <p className="text-sm font-semibold text-rose-800 mb-2">
            Failed to retrieve product specifications
          </p>
          <p className="text-xs text-rose-600 mb-4">{error.message}</p>
          <Button variant="danger" size="sm" onClick={reload}>
            Retry
          </Button>
        </div>
      ) : product ? (
        <div className="space-y-6">
          {/* Top Section: Image Gallery & Key Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gallery Column */}
            <div>
              <div className="w-full h-64 sm:h-72 bg-slate-50 border border-slate-200/80 rounded-xl overflow-hidden flex items-center justify-center p-4">
                <img
                  src={
                    product.images && product.images.length > 0
                      ? product.images[selectedImageIndex] || product.thumbnail
                      : product.thumbnail
                  }
                  alt={product.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Gallery Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {product.images.map((imgUrl, index) => (
                    <button
                      key={imgUrl}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-14 h-14 rounded-lg border-2 p-1 bg-white shrink-0 overflow-hidden cursor-pointer transition-all ${
                        selectedImageIndex === index
                          ? 'border-indigo-600 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Overview Details Column */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CategoryBadge category={product.category} />
                  <RatingBadge rating={product.rating} />
                  {product.brand && (
                    <span className="text-xs text-slate-500 font-medium">
                      by <strong className="text-slate-800">{product.brand}</strong>
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2.5 my-3">
                  <span className="text-3xl font-extrabold text-slate-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <DiscountBadge discountPercentage={product.discountPercentage} />
                </div>

                <div className="mb-4">
                  <StockBadge stock={product.stock} />
                </div>

                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {product.description}
                </p>
              </div>

              {/* Service Badges */}
              <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg">
                  <ShieldCheckIcon size={18} className="text-indigo-600 shrink-0" />
                  <span className="line-clamp-1">
                    {product.warrantyInformation || 'Standard warranty'}
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg">
                  <TruckIcon size={18} className="text-indigo-600 shrink-0" />
                  <span className="line-clamp-1">
                    {product.shippingInformation || 'Standard shipping'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications Breakdown Grid */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Technical Specifications & Logistics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Weight:</span>
                <span className="font-semibold text-slate-800">
                  {product.weight ? `${product.weight} kg` : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Dimensions (W×H×D):</span>
                <span className="font-semibold text-slate-800">
                  {product.dimensions
                    ? `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`
                    : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Return Policy:</span>
                <span className="font-semibold text-slate-800">
                  {product.returnPolicy || '30 days standard return'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Min Order Qty:</span>
                <span className="font-semibold text-slate-800">
                  {product.minimumOrderQuantity ? `${product.minimumOrderQuantity} units` : '1 unit'}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          {product.reviews && product.reviews.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Customer Reviews ({product.reviews.length})
              </h4>
              <div className="space-y-2.5">
                {product.reviews.map((review, idx) => (
                  <div
                    key={`${review.reviewerEmail}-${idx}`}
                    className="p-3 bg-white border border-slate-200/80 rounded-lg text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">
                          {review.reviewerName}
                        </span>
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <StarIcon
                              key={i}
                              size={12}
                              className={
                                i < review.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-200 fill-slate-200'
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-slate-400 text-[11px]">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-600 italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={onClose}>
              Close Window
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                onEdit(product);
              }}
              leftIcon={<PencilIcon size={16} />}
            >
              Full Edit (PUT)
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};
