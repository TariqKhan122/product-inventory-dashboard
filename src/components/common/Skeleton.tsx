import React from 'react';

export const TableSkeletonRow: React.FC = () => {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      <td className="py-4 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-200 rounded-lg shrink-0" />
          <div className="space-y-2 flex-1 min-w-0">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-1/3" />
          </div>
        </div>
      </td>
      <td className="px-3 py-4">
        <div className="h-6 bg-slate-200 rounded-md w-24" />
      </td>
      <td className="px-3 py-4">
        <div className="h-5 bg-slate-200 rounded w-16" />
      </td>
      <td className="px-3 py-4">
        <div className="h-6 bg-slate-200 rounded-full w-28" />
      </td>
      <td className="px-3 py-4">
        <div className="h-5 bg-slate-200 rounded w-12" />
      </td>
      <td className="py-4 pl-3 pr-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <div className="w-8 h-8 bg-slate-200 rounded-lg" />
          <div className="w-8 h-8 bg-slate-200 rounded-lg" />
          <div className="w-8 h-8 bg-slate-200 rounded-lg" />
        </div>
      </td>
    </tr>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm animate-pulse flex flex-col justify-between">
      <div>
        <div className="w-full h-44 bg-slate-200 rounded-lg mb-3" />
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-slate-100 rounded w-1/2 mb-3" />
        <div className="flex items-center gap-2 mb-3">
          <div className="h-5 bg-slate-200 rounded w-20" />
          <div className="h-5 bg-slate-200 rounded w-16" />
        </div>
      </div>
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="h-6 bg-slate-200 rounded w-16" />
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-slate-200 rounded-lg" />
          <div className="w-8 h-8 bg-slate-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const StatsSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-200 rounded w-24 mb-2" />
        <div className="w-8 h-8 bg-slate-200 rounded-lg" />
      </div>
      <div className="h-8 bg-slate-200 rounded w-16 mt-2 mb-1" />
      <div className="h-3 bg-slate-100 rounded w-32" />
    </div>
  );
};
