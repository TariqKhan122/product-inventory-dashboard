import React from 'react';
import { Button } from '../common/Button';
import { PlusIcon, PackageIcon, RefreshIcon } from '../common/Icons';

interface InventoryHeaderProps {
  onAddProduct: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const InventoryHeader: React.FC<InventoryHeaderProps> = ({
  onAddProduct,
  onRefresh,
  isLoading,
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <PackageIcon size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  StockPulse
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                  REST API Dashboard
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Real-time CRUD inventory management backed by DummyJSON REST API
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <Button
              variant="outline"
              size="md"
              onClick={onRefresh}
              isLoading={isLoading}
              leftIcon={<RefreshIcon size={16} className={isLoading ? 'animate-spin' : ''} />}
              title="Refresh inventory data"
            >
              Sync
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={onAddProduct}
              leftIcon={<PlusIcon size={18} />}
            >
              Add Product
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
