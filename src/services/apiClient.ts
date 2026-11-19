import { ApiClientError, RequestConfig } from '../types/api.types';

export class ApiClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...defaultHeaders,
    };
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${this.baseUrl}${cleanEndpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  public async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      params,
      body,
      signal,
    } = config;

    const fullUrl = this.buildUrl(endpoint, params);

    const mergedHeaders: Record<string, string> = {
      ...this.defaultHeaders,
      ...headers,
    };

    const requestInit: RequestInit = {
      method,
      headers: mergedHeaders,
      signal,
    };

    if (body !== undefined && method !== 'GET') {
      requestInit.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(fullUrl, requestInit);

      // Handle empty responses like 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      let parsedData: unknown;
      const contentType = response.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        try {
          parsedData = await response.json();
        } catch {
          parsedData = null;
        }
      } else {
        parsedData = await response.text();
      }

      if (!response.ok) {
        let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;

        if (parsedData && typeof parsedData === 'object') {
          const errorObj = parsedData as Record<string, unknown>;
          if (typeof errorObj.message === 'string') {
            errorMessage = errorObj.message;
          } else if (typeof errorObj.error === 'string') {
            errorMessage = errorObj.error;
          }
        }

        throw new ApiClientError(
          errorMessage,
          response.status,
          response.statusText,
          parsedData
        );
      }

      return parsedData as T;
    } catch (error: unknown) {
      // Re-throw AbortError as-is so callers can check if signal was aborted
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error;
      }

      if (error instanceof ApiClientError) {
        throw error;
      }

      // Handle network failure or unexpected exceptions
      const fallbackMessage = error instanceof Error ? error.message : 'An unknown network error occurred';
      throw new ApiClientError(fallbackMessage, 0, 'NetworkError', error);
    }
  }

  public get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>, signal?: AbortSignal): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params, signal });
  }

  public post<T>(endpoint: string, body?: unknown, signal?: AbortSignal): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, signal });
  }

  public put<T>(endpoint: string, body?: unknown, signal?: AbortSignal): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, signal });
  }

  public patch<T>(endpoint: string, body?: unknown, signal?: AbortSignal): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body, signal });
  }

  public delete<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', signal });
  }
}

export const apiClient = new ApiClient('https://dummyjson.com');
