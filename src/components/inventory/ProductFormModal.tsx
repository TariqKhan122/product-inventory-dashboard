import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import {
  CategoryItem,
  CreateProductDTO,
  Product,
  UpdateProductDTO,
  DEFAULT_FALLBACK_CATEGORIES,
} from '../../types/product.types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateProductDTO | UpdateProductDTO) => Promise<boolean>;
  initialProduct?: Product | null;
  categories: CategoryItem[];
  isSubmitting?: boolean;
}

interface FormState {
  title: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  brand: string;
  discountPercentage: string;
  warrantyInformation: string;
  shippingInformation: string;
}

interface FormErrors {
  title?: string;
  category?: string;
  price?: string;
  stock?: string;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialProduct,
  categories,
  isSubmitting = false,
}) => {
  const isEditing = Boolean(initialProduct);

  // Normalizes incoming categories and guarantees fallback entries are present
  const availableCategories = useMemo<CategoryItem[]>(() => {
    const baseList = categories && categories.length > 0 ? categories : DEFAULT_FALLBACK_CATEGORIES;

    // In Edit mode, if product has a unique custom category, prepend it so it's selectable
    if (initialProduct?.category) {
      const match = baseList.some(
        (c) => (c.slug || c.value || '').toLowerCase() === initialProduct.category.toLowerCase()
      );
      if (!match) {
        const titleCase = initialProduct.category
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        return [
          {
            slug: initialProduct.category,
            name: `${titleCase} (Existing)`,
            value: initialProduct.category,
            label: `${titleCase} (Existing)`,
          },
          ...baseList,
        ];
      }
    }

    return baseList;
  }, [categories, initialProduct]);

  // Hybrid Category state: Dropdown vs Custom Text Input
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false);
  const [customCategoryInput, setCustomCategoryInput] = useState<string>('');

  const [formData, setFormData] = useState<FormState>({
    title: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    brand: '',
    discountPercentage: '',
    warrantyInformation: '',
    shippingInformation: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Populate or reset form whenever initialProduct, isOpen, or availableCategories change
  useEffect(() => {
    if (initialProduct) {
      setFormData({
        title: initialProduct.title || '',
        description: initialProduct.description || '',
        category: initialProduct.category || '',
        price: String(initialProduct.price ?? ''),
        stock: String(initialProduct.stock ?? ''),
        brand: initialProduct.brand || '',
        discountPercentage: String(initialProduct.discountPercentage ?? '0'),
        warrantyInformation: initialProduct.warrantyInformation || '',
        shippingInformation: initialProduct.shippingInformation || '',
      });
      setIsCustomCategory(false);
      setCustomCategoryInput('');
    } else {
      const defaultCategory =
        availableCategories.length > 0
          ? availableCategories[0].slug || availableCategories[0].value || 'smartphones'
          : 'smartphones';

      setFormData({
        title: '',
        description: '',
        category: defaultCategory,
        price: '',
        stock: '10',
        brand: '',
        discountPercentage: '0',
        warrantyInformation: '1 year standard warranty',
        shippingInformation: 'Ships in 3-5 business days',
      });
      setIsCustomCategory(false);
      setCustomCategoryInput('');
    }
    setErrors({});
  }, [initialProduct, isOpen, availableCategories]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Product title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    const trimmedCat = formData.category.trim();
    if (!trimmedCat || trimmedCat === '__custom__') {
      newErrors.category = 'Please select or enter a product category';
    }

    const priceNum = parseFloat(formData.price);
    if (!formData.price || isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = 'Price must be greater than $0.00';
    }

    const stockNum = parseInt(formData.stock, 10);
    if (formData.stock === '' || isNaN(stockNum) || stockNum < 0) {
      newErrors.stock = 'Stock must be 0 or greater';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Clean and normalize category slug
    const cleanCategory = formData.category.trim().toLowerCase().replace(/\s+/g, '-');

    const payload: CreateProductDTO | UpdateProductDTO = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: cleanCategory,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      brand: formData.brand.trim() || undefined,
      discountPercentage: parseFloat(formData.discountPercentage) || 0,
      warrantyInformation: formData.warrantyInformation.trim() || undefined,
      shippingInformation: formData.shippingInformation.trim() || undefined,
    };

    const success = await onSubmit(payload);
    if (success) {
      onClose();
    }
  };

  const handleCategoryDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setIsCustomCategory(true);
      setCustomCategoryInput('');
      setFormData((prev) => ({ ...prev, category: '' }));
    } else {
      setFormData((prev) => ({ ...prev, category: val }));
      if (errors.category) {
        setErrors((prev) => ({ ...prev, category: undefined }));
      }
    }
  };

  const handleCustomCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomCategoryInput(val);
    setFormData((prev) => ({ ...prev, category: val }));
    if (errors.category && val.trim()) {
      setErrors((prev) => ({ ...prev, category: undefined }));
    }
  };

  const handleToggleCategoryMode = () => {
    if (isCustomCategory) {
      // Switching from custom input back to dropdown
      setIsCustomCategory(false);
      const fallback =
        availableCategories.length > 0
          ? availableCategories[0].slug || availableCategories[0].value || 'smartphones'
          : 'smartphones';
      setFormData((prev) => ({
        ...prev,
        category: customCategoryInput.trim() || fallback,
      }));
    } else {
      // Switching from dropdown to custom text input
      setIsCustomCategory(true);
      setCustomCategoryInput(formData.category);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Full Update (PUT): ${initialProduct?.title}` : 'Create New Product (POST)'}
      description={
        isEditing
          ? 'Replaces the entire product resource on the server and synchronizes your inventory state.'
          : 'Dispatches a POST request to add a new product and optimistically prepends it to your view.'
      }
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Product Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Wireless Noise-Cancelling Headphones"
            className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all ${
              errors.title
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-600'
            }`}
          />
          {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title}</p>}
        </div>

        {/* Category & Brand row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Category <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleToggleCategoryMode}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
              >
                {isCustomCategory ? '← Choose from list' : '+ Enter custom'}
              </button>
            </div>

            {isCustomCategory ? (
              <div>
                <input
                  type="text"
                  value={customCategoryInput}
                  onChange={handleCustomCategoryInputChange}
                  placeholder="e.g. smart-home, wearables, robotics"
                  autoFocus
                  className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.category
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-600'
                  }`}
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Custom category will be applied upon saving.
                </p>
              </div>
            ) : (
              <select
                value={formData.category}
                onChange={handleCategoryDropdownChange}
                className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white capitalize cursor-pointer transition-all ${
                  errors.category
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-600'
                }`}
              >
                <option value="" disabled>
                  Select a category...
                </option>
                {availableCategories.map((c) => {
                  const val = c.slug || c.value || '';
                  const lbl = c.name || c.label || val;
                  return (
                    <option key={val} value={val}>
                      {lbl}
                    </option>
                  );
                })}
                <option value="__custom__" className="font-semibold text-indigo-600">
                  + Add custom category...
                </option>
              </select>
            )}
            {errors.category && <p className="mt-1 text-xs text-rose-600">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Brand
            </label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              placeholder="e.g. Sony, Apple, Nike"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Pricing, Discount & Stock row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Price (USD) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold text-sm">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="49.99"
                className={`w-full pl-7 pr-3 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.price
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-600'
                }`}
              />
            </div>
            {errors.price && <p className="mt-1 text-xs text-rose-600">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Initial Stock <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="25"
              className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                errors.stock
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-600'
              }`}
            />
            {errors.stock && <p className="mt-1 text-xs text-rose-600">{errors.stock}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Discount %
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={formData.discountPercentage}
              onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
              placeholder="0"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Comprehensive description of product features, dimensions, and specifications..."
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all resize-y"
          />
        </div>

        {/* Shipping & Warranty row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Warranty Information
            </label>
            <input
              type="text"
              value={formData.warrantyInformation}
              onChange={(e) => setFormData({ ...formData, warrantyInformation: e.target.value })}
              placeholder="e.g. 1 year manufacturer warranty"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:border-indigo-600 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Shipping Information
            </label>
            <input
              type="text"
              value={formData.shippingInformation}
              onChange={(e) => setFormData({ ...formData, shippingInformation: e.target.value })}
              placeholder="e.g. Ships in 1-2 business days"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:border-indigo-600 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Form Actions Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes (PUT)' : 'Create Product (POST)'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
