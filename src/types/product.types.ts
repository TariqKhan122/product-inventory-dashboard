export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: ProductDimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: ProductReview[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: ProductMeta;
  images: string[];
  thumbnail: string;
}

export interface CreateProductDTO {
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  stock: number;
  brand?: string;
  sku?: string;
  warrantyInformation?: string;
  shippingInformation?: string;
  returnPolicy?: string;
  thumbnail?: string;
  images?: string[];
}

export interface UpdateProductDTO extends CreateProductDTO {
  rating?: number;
}

export interface PatchProductDTO {
  title?: string;
  price?: number;
  stock?: number;
  category?: string;
  brand?: string;
  description?: string;
}

export interface CategoryOption {
  value: string;
  label: string;
}

export interface CategoryItem {
  slug: string;
  name: string;
  url?: string;
  value?: string;
  label?: string;
}

export const DEFAULT_FALLBACK_CATEGORIES: CategoryItem[] = [
  { slug: 'beauty', name: 'Beauty', value: 'beauty', label: 'Beauty' },
  { slug: 'fragrances', name: 'Fragrances', value: 'fragrances', label: 'Fragrances' },
  { slug: 'furniture', name: 'Furniture', value: 'furniture', label: 'Furniture' },
  { slug: 'groceries', name: 'Groceries', value: 'groceries', label: 'Groceries' },
  { slug: 'home-decoration', name: 'Home Decoration', value: 'home-decoration', label: 'Home Decoration' },
  { slug: 'kitchen-accessories', name: 'Kitchen Accessories', value: 'kitchen-accessories', label: 'Kitchen Accessories' },
  { slug: 'laptops', name: 'Laptops', value: 'laptops', label: 'Laptops' },
  { slug: 'mens-shirts', name: 'Mens Shirts', value: 'mens-shirts', label: 'Mens Shirts' },
  { slug: 'mens-shoes', name: 'Mens Shoes', value: 'mens-shoes', label: 'Mens Shoes' },
  { slug: 'mens-watches', name: 'Mens Watches', value: 'mens-watches', label: 'Mens Watches' },
  { slug: 'mobile-accessories', name: 'Mobile Accessories', value: 'mobile-accessories', label: 'Mobile Accessories' },
  { slug: 'motorcycle', name: 'Motorcycle', value: 'motorcycle', label: 'Motorcycle' },
  { slug: 'skin-care', name: 'Skin Care', value: 'skin-care', label: 'Skin Care' },
  { slug: 'smartphones', name: 'Smartphones', value: 'smartphones', label: 'Smartphones' },
  { slug: 'sports-accessories', name: 'Sports Accessories', value: 'sports-accessories', label: 'Sports Accessories' },
  { slug: 'sunglasses', name: 'Sunglasses', value: 'sunglasses', label: 'Sunglasses' },
  { slug: 'tablets', name: 'Tablets', value: 'tablets', label: 'Tablets' },
  { slug: 'tops', name: 'Tops', value: 'tops', label: 'Tops' },
  { slug: 'vehicle', name: 'Vehicle', value: 'vehicle', label: 'Vehicle' },
  { slug: 'womens-bags', name: 'Womens Bags', value: 'womens-bags', label: 'Womens Bags' },
  { slug: 'womens-dresses', name: 'Womens Dresses', value: 'womens-dresses', label: 'Womens Dresses' },
  { slug: 'womens-jewellery', name: 'Womens Jewellery', value: 'womens-jewellery', label: 'Womens Jewellery' },
  { slug: 'womens-shoes', name: 'Womens Shoes', value: 'womens-shoes', label: 'Womens Shoes' },
  { slug: 'womens-watches', name: 'Womens Watches', value: 'womens-watches', label: 'Womens Watches' },
];

export type ProductSortField = 'price' | 'rating' | 'title' | 'stock';
export type SortOrder = 'asc' | 'desc';

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface ProductFilterState {
  search: string;
  category: string;
  sortBy: ProductSortField;
  order: SortOrder;
  page: number;
  limit: number;
}
