import React from 'react';
import { Button } from '../common/Button';
import { AlertCircleIcon, RefreshIcon } from '../common/Icons';
import { ApiClientError } from '../../types/api.types';

interface ErrorStateProps {
  error: ApiClientError | Error;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  const isApiError = error instanceof ApiClientError;
  const statusCode = isApiError && error.status > 0 ? `Error ${error.status}: ` : '';

  return (
    <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-8 max-w-xl mx-auto my-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-4">
        <AlertCircleIcon size={30} />
      </div>

      <h3 className="text-lg font-bold text-rose-900 mb-1">
        {statusCode || 'Connection Error'}
      </h3>
      <p className="text-sm text-rose-700 mb-2 leading-relaxed">
        {error.message || 'An unexpected error occurred while communicating with the REST API.'}
      </p>

      {isApiError && error.statusText && (
        <span className="inline-block px-2.5 py-1 text-xs font-mono bg-rose-100/80 text-rose-800 rounded-md mb-6">
          Response Status: {error.statusText}
        </span>
      )}

      <div className="flex items-center justify-center gap-3 mt-4">
        <Button
          variant="danger"
          size="md"
          onClick={onRetry}
          leftIcon={<RefreshIcon size={16} />}
        >
          Retry Request
        </Button>
      </div>
    </div>
  );
};
