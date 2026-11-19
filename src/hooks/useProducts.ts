import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Product,
  ProductFilterState,
  CategoryItem,
  CreateProductDTO,
  UpdateProductDTO,
  PatchProductDTO,
  DEFAULT_FALLBACK_CATEGORIES,
} from '../types/product.types';
import { productService } from '../services/productService';
import { ApiClientError } from '../types/api.types';
import { useToast } from '../context/ToastContext';

interface UseProductsResult {
  products: Product[];
  total: number;
  isLoading: boolean;
  error: ApiClientError | Error | null;
  categories: CategoryItem[];
  isCategoriesLoading: boolean;
  isMutating: boolean;
  retry: () => void;
  createProduct: (dto: CreateProductDTO) => Promise<boolean>;
  updateProduct: (id: number, dto: UpdateProductDTO) => Promise<boolean>;
  patchProduct: (id: number, dto: PatchProductDTO) => Promise<boolean>;
  deleteProduct: (id: number) => Promise<boolean>;
}

export function useProducts(filters: ProductFilterState): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiClientError | Error | null>(null);

  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_FALLBACK_CATEGORIES);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState<boolean>(false);
  const [isMutating, setIsMutating] = useState<boolean>(false);

  // Store trigger counter for retry logic
  const [retryTrigger, setRetryTrigger] = useState<number>(0);

  const { showSuccess, showError } = useToast();

  // Reference to track active in-flight GET abort controller
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Fetch categories list on mount
   */
  useEffect(() => {
    const controller = new AbortController();
    setIsCategoriesLoading(true);

    productService
      .getCategories(controller.signal)
      .then((data) => {
        if (data && data.length > 0) {
          setCategories(data);
        }
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setCategories(DEFAULT_FALLBACK_CATEGORIES);
      })
      .finally(() => {
        setIsCategoriesLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  /**
   * Fetch products whenever search, category, sort, order, page, or retry trigger changes.
   * Cancels any prior in-flight request via AbortController.
   */
  useEffect(() => {
    // Abort previous in-flight request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    productService
      .getProducts(filters, controller.signal)
      .then((res) => {
        setProducts(res.products);
        setTotal(res.total);
        setError(null);
      })
      .catch((err: unknown) => {
        // Disregard aborted requests — new request has already been dispatched
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        if (err instanceof ApiClientError) {
          setError(err);
        } else if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('Failed to load products from API'));
        }
      })
      .finally(() => {
        // Only turn off loading if this request was not aborted
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [
    filters.search,
    filters.category,
    filters.sortBy,
    filters.order,
    filters.page,
    filters.limit,
    retryTrigger,
  ]);

  const retry = useCallback(() => {
    setRetryTrigger((prev) => prev + 1);
  }, []);

  /**
   * Create Product (POST)
   */
  const createProduct = useCallback(
    async (dto: CreateProductDTO): Promise<boolean> => {
      setIsMutating(true);
      try {
        const createdProduct = await productService.createProduct(dto);

        // Optimistically update list state
        setProducts((prev) => [
          {
            ...createdProduct,
            id: createdProduct.id || Date.now(),
            thumbnail:
              createdProduct.thumbnail ||
              'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=300&q=80',
            images: createdProduct.images?.length
              ? createdProduct.images
              : [
                  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
                ],
            rating: createdProduct.rating || 5.0,
            discountPercentage: createdProduct.discountPercentage || 0,
          },
          ...prev,
        ]);
        setTotal((prev) => prev + 1);

        showSuccess('Product Created', `"${dto.title}" has been successfully added to inventory.`);
        return true;
      } catch (err: unknown) {
        const msg = err instanceof ApiClientError ? err.message : 'Failed to create product';
        showError('Create Failed', msg);
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [showSuccess, showError]
  );

  /**
   * Full Update Product (PUT)
   */
  const updateProduct = useCallback(
    async (id: number, dto: UpdateProductDTO): Promise<boolean> => {
      setIsMutating(true);
      try {
        const updated = await productService.updateProduct(id, dto);

        // Synchronously update local state
        setProducts((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
        );

        showSuccess('Product Updated', `"${dto.title}" has been replaced and saved.`);
        return true;
      } catch (err: unknown) {
        const msg = err instanceof ApiClientError ? err.message : 'Failed to update product';
        showError('Update Failed', msg);
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [showSuccess, showError]
  );

  /**
   * Partial Update Product (PATCH)
   */
  const patchProduct = useCallback(
    async (id: number, dto: PatchProductDTO): Promise<boolean> => {
      // Find original in case we need rollback
      const originalProduct = products.find((p) => p.id === id);

      // Optimistic instant local update
      setProducts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...dto } : item))
      );

      try {
        const patched = await productService.patchProduct(id, dto);

        // Reconcile with server response
        setProducts((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...patched } : item))
        );

        const summary = Object.keys(dto)
          .map((k) => `${k}: ${dto[k as keyof PatchProductDTO]}`)
          .join(', ');

        showSuccess('Quick Update Applied (PATCH)', summary);
        return true;
      } catch (err: unknown) {
        // Rollback state if patch failed
        if (originalProduct) {
          setProducts((prev) =>
            prev.map((item) => (item.id === id ? originalProduct : item))
          );
        }

        const msg = err instanceof ApiClientError ? err.message : 'Failed to patch product';
        showError('Patch Failed', msg);
        return false;
      }
    },
    [products, showSuccess, showError]
  );

  /**
   * Delete Product (DELETE)
   */
  const deleteProduct = useCallback(
    async (id: number): Promise<boolean> => {
      const targetProduct = products.find((p) => p.id === id);
      const title = targetProduct?.title || `Item #${id}`;

      setIsMutating(true);
      try {
        await productService.deleteProduct(id);

        // Remove from local inventory
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setTotal((prev) => Math.max(0, prev - 1));

        showSuccess('Product Deleted', `"${title}" was removed from inventory.`);
        return true;
      } catch (err: unknown) {
        const msg = err instanceof ApiClientError ? err.message : 'Failed to delete product';
        showError('Delete Failed', msg);
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [products, showSuccess, showError]
  );

  return {
    products,
    total,
    isLoading,
    error,
    categories,
    isCategoriesLoading,
    isMutating,
    retry,
    createProduct,
    updateProduct,
    patchProduct,
    deleteProduct,
  };
}
