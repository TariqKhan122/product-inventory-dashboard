import { useState, useEffect, useRef, useCallback } from 'react';
import { Product } from '../types/product.types';
import { productService } from '../services/productService';
import { ApiClientError } from '../types/api.types';

interface UseProductDetailResult {
  product: Product | null;
  isLoading: boolean;
  error: ApiClientError | Error | null;
  reload: () => void;
}

export function useProductDetail(productId: number | null): UseProductDetailResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiClientError | Error | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (productId === null) {
      setProduct(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    productService
      .getProductById(productId, controller.signal)
      .then((data) => {
        setProduct(data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        if (err instanceof ApiClientError || err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('Failed to load product specifications'));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [productId, reloadTrigger]);

  const reload = useCallback(() => {
    setReloadTrigger((prev) => prev + 1);
  }, []);

  return {
    product,
    isLoading,
    error,
    reload,
  };
}
