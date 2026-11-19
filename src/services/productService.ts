import { apiClient } from './apiClient';
import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
  PatchProductDTO,
  CategoryItem,
  ProductFilterState,
  DEFAULT_FALLBACK_CATEGORIES,
} from '../types/product.types';
import { DeleteProductResponse, ProductsApiResponse } from '../types/api.types';

export class ProductService {
  /**
   * Fetches products with support for debounced search, category filtering,
   * multi-field sorting, and pagination.
   */
  public async getProducts(
    filters: ProductFilterState,
    signal?: AbortSignal
  ): Promise<ProductsApiResponse> {
    const { search, category, sortBy, order, page, limit } = filters;
    const skip = (page - 1) * limit;

    const baseParams: Record<string, string | number | undefined> = {
      limit,
      skip,
      sortBy: sortBy || 'id',
      order: order || 'asc',
    };

    // Case 1: Search query has highest priority
    if (search.trim()) {
      return apiClient.get<ProductsApiResponse>(
        '/products/search',
        {
          q: search.trim(),
          ...baseParams,
        },
        signal
      );
    }

    // Case 2: Specific category selected
    if (category && category !== 'all') {
      return apiClient.get<ProductsApiResponse>(
        `/products/category/${encodeURIComponent(category)}`,
        baseParams,
        signal
      );
    }

    // Case 3: Default paginated list
    return apiClient.get<ProductsApiResponse>('/products', baseParams, signal);
  }

  /**
   * Fetches full details for a single product by ID.
   */
  public async getProductById(id: number | string, signal?: AbortSignal): Promise<Product> {
    return apiClient.get<Product>(`/products/${id}`, undefined, signal);
  }

  /**
   * Safely normalizes raw API category responses into strongly-typed CategoryItem options.
   * Handles both DummyJSON v3 object array format ([{slug, name, url}]) and
   * legacy/category-list string array format (["smartphones", "laptops"]).
   */
  public normalizeCategories(raw: unknown): CategoryItem[] {
    if (!Array.isArray(raw)) return [];

    return raw
      .map((item): CategoryItem | null => {
        if (typeof item === 'string') {
          const slug = item.trim().toLowerCase();
          if (!slug) return null;
          const name = slug
            .split('-')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
          return { slug, name, value: slug, label: name };
        }

        if (item && typeof item === 'object') {
          const obj = item as Record<string, unknown>;
          const slug = String(obj.slug || obj.value || obj.id || '').trim().toLowerCase();
          const rawName = String(obj.name || obj.label || obj.title || slug || '').trim();
          if (!slug && !rawName) return null;

          const finalSlug = slug || rawName.toLowerCase().replace(/\s+/g, '-');
          const finalName =
            rawName ||
            finalSlug
              .split('-')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');

          return {
            slug: finalSlug,
            name: finalName,
            value: finalSlug,
            label: finalName,
            url: typeof obj.url === 'string' ? obj.url : undefined,
          };
        }

        return null;
      })
      .filter((c): c is CategoryItem => c !== null);
  }

  /**
   * Fetches the dynamic list of categories from DummyJSON.
   * Checks /products/categories first, falls back to /products/category-list if needed,
   * and falls back to hardcoded standard categories if the network/API is unavailable.
   */
  public async getCategories(signal?: AbortSignal): Promise<CategoryItem[]> {
    try {
      const rawCategories = await apiClient.get<unknown>('/products/categories', undefined, signal);
      const normalized = this.normalizeCategories(rawCategories);
      if (normalized.length > 0) {
        return normalized;
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw err;
      }
      // If /products/categories failed, attempt /products/category-list
      try {
        const altCategories = await apiClient.get<unknown>('/products/category-list', undefined, signal);
        const normalizedAlt = this.normalizeCategories(altCategories);
        if (normalizedAlt.length > 0) {
          return normalizedAlt;
        }
      } catch (altErr: unknown) {
        if (altErr instanceof DOMException && altErr.name === 'AbortError') {
          throw altErr;
        }
      }
    }

    return DEFAULT_FALLBACK_CATEGORIES;
  }

  /**
   * Creates a new product resource (POST).
   */
  public async createProduct(dto: CreateProductDTO): Promise<Product> {
    return apiClient.post<Product>('/products/add', dto);
  }

  /**
   * Replaces an entire product resource (PUT).
   */
  public async updateProduct(id: number | string, dto: UpdateProductDTO): Promise<Product> {
    return apiClient.put<Product>(`/products/${id}`, dto);
  }

  /**
   * Partially updates specific fields on a product (PATCH).
   */
  public async patchProduct(id: number | string, dto: PatchProductDTO): Promise<Product> {
    return apiClient.patch<Product>(`/products/${id}`, dto);
  }

  /**
   * Deletes a product resource by ID (DELETE).
   */
  public async deleteProduct(id: number | string): Promise<DeleteProductResponse> {
    return apiClient.delete<DeleteProductResponse>(`/products/${id}`);
  }
}

export const productService = new ProductService();
