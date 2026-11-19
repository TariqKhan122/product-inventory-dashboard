import React, { useState } from 'react';
import { PatchProductDTO } from '../../types/product.types';
import { PlusIcon } from '../common/Icons';

interface InlineStockEditorProps {
  productId: number;
  currentStock: number;
  onPatch: (id: number, dto: PatchProductDTO) => Promise<boolean>;
}

export const InlineStockEditor: React.FC<InlineStockEditorProps> = ({
  productId,
  currentStock,
  onPatch,
}) => {
  const [isPatching, setIsPatching] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(String(currentStock));

  const handleQuickAdjust = async (delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    if (newStock === currentStock) return;

    setIsPatching(true);
    await onPatch(productId, { stock: newStock });
    setIsPatching(false);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(inputValue, 10);
    if (isNaN(parsed) || parsed < 0) {
      setInputValue(String(currentStock));
      setIsEditing(false);
      return;
    }

    if (parsed === currentStock) {
      setIsEditing(false);
      return;
    }

    setIsPatching(true);
    const success = await onPatch(productId, { stock: parsed });
    setIsPatching(false);
    if (success) {
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleManualSubmit} className="flex items-center gap-1">
        <input
          type="number"
          min="0"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoFocus
          className="w-14 px-1.5 py-0.5 text-xs text-center border border-indigo-400 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-800"
          disabled={isPatching}
        />
        <button
          type="submit"
          disabled={isPatching}
          className="px-1.5 py-0.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded cursor-pointer disabled:opacity-50"
        >
          {isPatching ? '...' : '✓'}
        </button>
        <button
          type="button"
          onClick={() => {
            setInputValue(String(currentStock));
            setIsEditing(false);
          }}
          disabled={isPatching}
          className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold rounded cursor-pointer"
        >
          ✕
        </button>
      </form>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 rounded-lg px-2 py-1">
      {/* Decrement stock button */}
      <button
        type="button"
        onClick={() => handleQuickAdjust(-1)}
        disabled={isPatching || currentStock <= 0}
        className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded text-xs font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        title="Decrease stock by 1 (PATCH)"
      >
        -
      </button>

      {/* Stock click to edit */}
      <button
        type="button"
        onClick={() => {
          setInputValue(String(currentStock));
          setIsEditing(true);
        }}
        disabled={isPatching}
        className="text-xs font-semibold text-slate-800 hover:text-indigo-600 hover:underline px-1 min-w-[20px] text-center cursor-pointer"
        title="Click to manually edit stock count (PATCH)"
      >
        {isPatching ? (
          <span className="inline-block animate-spin text-[10px]">⌛</span>
        ) : (
          currentStock
        )}
      </button>

      {/* Increment stock button */}
      <button
        type="button"
        onClick={() => handleQuickAdjust(1)}
        disabled={isPatching}
        className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded text-xs font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        title="Increase stock by 1 (PATCH)"
      >
        <PlusIcon size={12} />
      </button>
    </div>
  );
};
