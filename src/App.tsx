import React, { useState, useEffect, useCallback } from 'react';
import {
  Product,
  ProductFilterState,
  ProductSortField,
  CreateProductDTO,
  UpdateProductDTO,
} from './types/product.types';
import { useProducts } from './hooks/useProducts';
import { useDebounce } from './hooks/useDebounce';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/common/ToastContainer';
import { ConfirmDialog } from './components/common/ConfirmDialog';
import { InventoryHeader } from './components/inventory/InventoryHeader';
import { InventoryStats } from './components/inventory/InventoryStats';
import {
  InventoryFilters,
  ViewMode,
} from './components/inventory/InventoryFilters';
import { InventoryTable } from './components/inventory/InventoryTable';
import { InventoryGrid } from './components/inventory/InventoryGrid';
import { Pagination } from './components/inventory/Pagination';
import { EmptyState } from './components/inventory/EmptyState';
import { ErrorState } from './components/inventory/ErrorState';
import { ProductFormModal } from './components/inventory/ProductFormModal';
import { ProductDetailModal } from './components/inventory/ProductDetailModal';

const DEFAULT_FILTERS: ProductFilterState = {
  search: '',
  category: 'all',
  sortBy: 'price',
  order: 'asc',
  page: 1,
  limit: 10,
};

const DashboardContent: React.FC = () => {
  // Filter and pagination state
  const [filters, setFilters] = useState<ProductFilterState>(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Debounced search query
  const debouncedSearch = useDebounce<string>(searchInput, 400);

  // Sync debounced search to filters & reset to page 1
  useEffect(() => {
    setFilters((prev) => {
      if (prev.search === debouncedSearch) return prev;
      return { ...prev, search: debouncedSearch, page: 1 };
    });
  }, [debouncedSearch]);

  // Main Products data hook with AbortController and CRUD mutations
  const {
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
  } = useProducts(filters);

  // Modal states
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Handlers for filter controls
  const handleCategoryChange = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category, page: 1 }));
  }, []);

  const handleSortChange = useCallback((sortBy: ProductSortField) => {
    setFilters((prev) => ({ ...prev, sortBy, page: 1 }));
  }, []);

  const handleOrderToggle = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      order: prev.order === 'asc' ? 'desc' : 'asc',
      page: 1,
    }));
  }, []);

  const handleLimitChange = useCallback((limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    setFilters((prev) => ({ ...prev, search: '', page: 1 }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchInput('');
    setFilters(DEFAULT_FILTERS);
  }, []);

  // CRUD triggers
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (
    dto: CreateProductDTO | UpdateProductDTO
  ): Promise<boolean> => {
    if (editingProduct) {
      return updateProduct(editingProduct.id, dto as UpdateProductDTO);
    }
    return createProduct(dto as CreateProductDTO);
  };

  const handleOpenDeleteConfirm = (product: Product) => {
    setDeletingProduct(product);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    const success = await deleteProduct(deletingProduct.id);
    setIsDeleting(false);
    if (success) {
      setDeletingProduct(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Application Header */}
      <InventoryHeader
        onAddProduct={handleOpenCreateModal}
        onRefresh={retry}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* KPI Stats Ribbon */}
        <InventoryStats
          products={products}
          total={total}
          isLoading={isLoading}
        />

        {/* Search, Filter, Sort & View Controls */}
        <InventoryFilters
          filters={filters}
          searchInput={searchInput}
          onSearchChange={setSearchInput}
          onClearSearch={handleClearSearch}
          categories={categories}
          isCategoriesLoading={isCategoriesLoading}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          onOrderToggle={handleOrderToggle}
          onLimitChange={handleLimitChange}
          onResetFilters={handleResetFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* View States: Error, Empty, or Products Table/Grid */}
        {error && products.length === 0 ? (
          <ErrorState error={error} onRetry={retry} />
        ) : !isLoading && products.length === 0 ? (
          <EmptyState
            searchQuery={filters.search}
            onReset={handleResetFilters}
          />
        ) : (
          <>
            {viewMode === 'table' ? (
              <InventoryTable
                products={products}
                isLoading={isLoading}
                onViewProduct={(p) => setSelectedProductId(p.id)}
                onEditProduct={handleOpenEditModal}
                onDeleteProduct={handleOpenDeleteConfirm}
                onPatchProduct={patchProduct}
              />
            ) : (
              <InventoryGrid
                products={products}
                isLoading={isLoading}
                onViewProduct={(p) => setSelectedProductId(p.id)}
                onEditProduct={handleOpenEditModal}
                onDeleteProduct={handleOpenDeleteConfirm}
                onPatchProduct={patchProduct}
              />
            )}

            {/* Pagination Controls */}
            <div className="mt-4">
              <Pagination
                currentPage={filters.page}
                totalItems={total}
                limit={filters.limit}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            </div>
          </>
        )}
      </main>

      {/* Product Detail Modal (GET by ID) */}
      <ProductDetailModal
        productId={selectedProductId}
        onClose={() => setSelectedProductId(null)}
        onEdit={(p) => handleOpenEditModal(p)}
      />

      {/* Create (POST) & Full Update (PUT) Modal */}
      <ProductFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialProduct={editingProduct}
        categories={categories}
        isSubmitting={isMutating}
      />

      {/* Delete Confirmation Dialog (DELETE) */}
      <ConfirmDialog
        isOpen={Boolean(deletingProduct)}
        title="Confirm Product Deletion"
        message={`Are you sure you want to delete "${deletingProduct?.title}"? This will trigger an HTTP DELETE request and remove the SKU from your inventory.`}
        confirmLabel="Delete SKU"
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingProduct(null)}
      />

      {/* Floating Toast Notification System */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <DashboardContent />
    </ToastProvider>
  );
}
