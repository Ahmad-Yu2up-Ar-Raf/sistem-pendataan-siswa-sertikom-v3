/**
 * useRemoteOptions Hook
 * 
 * Reusable hook for fetching paginated options from backend endpoints.
 * Features: debounce search, pagination, load more, session cache, abort control.
 * Used by both form comboboxes and dynamic filters.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import debounce from 'lodash.debounce';

export interface RemoteOption {
  id: number;
  label: string;
  value: string;
  [key: string]: string | number;
}

interface RemoteOptionsConfig {
  perPage?: number;
  initialPage?: number;
  debounceMs?: number;
  autoFetch?: boolean;
}

interface PaginationMeta {
  total: number;
  currentPage: number;
  perPage: number;
  lastPage: number;
  hasMore: boolean;
}

interface UseRemoteOptionsReturn {
  options: RemoteOption[];
  loading: boolean;
  isTyping: boolean;
  loadMore: () => void;
  hasMore: boolean;
  setSearchQuery: (query: string) => void;
  searchQuery: string;
  currentPage: number;
  isLoadingMore: boolean;
  refetch: () => void;
}

const optionsCache = new Map<string, { data: RemoteOption[]; hasMore: boolean }>();

export function useRemoteOptions(
  endpoint: string,
  config: RemoteOptionsConfig = {}
): UseRemoteOptionsReturn {
  const {
    perPage = 10,
    initialPage = 1,
    debounceMs = 300,
    autoFetch = true,
  } = config;

  const [options, setOptions] = useState<RemoteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchOptions = useCallback(
    async (query: string, page: number, append = false) => {
      const cacheKey = `${endpoint}-${query}-${page}`;

      if (!append && optionsCache.has(cacheKey)) {
        const cached = optionsCache.get(cacheKey)!;
        setOptions(cached.data);
        setHasMore(cached.hasMore);
        setLoading(false);
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      setLoading(true);

      try {
        const url = new URL(endpoint, window.location.origin);
        url.searchParams.append('search', query);
        url.searchParams.append('page', page.toString());
        url.searchParams.append('perPage', perPage.toString());

        const response = await fetch(url.toString(), {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const newData: RemoteOption[] = (result.data || []).map((item: Record<string, string | number>) => ({
          id: item.id as number,
          value: String(item.id),
          label: item.nama_jurusan || item.nama_kelas || item.nama_tahun_ajar || String(item.id),
          ...item,
        }));

        const pagination: PaginationMeta = result.meta?.pagination || {
          hasMore: false,
          currentPage: page,
          perPage,
          total: newData.length,
          lastPage: page,
        };

        if (append) {
          setOptions((prev) => {
            const combined = [...prev, ...newData];
            optionsCache.set(cacheKey, { data: combined, hasMore: pagination.hasMore });
            return combined;
          });
        } else {
          setOptions(newData);
          optionsCache.set(cacheKey, { data: newData, hasMore: pagination.hasMore });
        }

        setHasMore(pagination.hasMore);
        setCurrentPage(page);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // Intentionally aborted - ignore
        } else {
          console.error('Fetch options error:', err);
          setOptions([]);
          setHasMore(false);
        }
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [endpoint, perPage]
  );

  const debouncedFetch = useMemo(
    () =>
      debounce((query: string) => {
        setIsTyping(false);
        setCurrentPage(initialPage);
        fetchOptions(query, initialPage, false);
      }, debounceMs),
    [fetchOptions, initialPage, debounceMs]
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setIsTyping(true);
      debouncedFetch(query);
    },
    [debouncedFetch]
  );

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    fetchOptions(searchQuery, currentPage + 1, true);
  }, [fetchOptions, searchQuery, currentPage, hasMore, isLoadingMore]);

  const refetch = useCallback(() => {
    fetchOptions(searchQuery, initialPage, false);
  }, [fetchOptions, searchQuery, initialPage]);

  useEffect(() => {
    if (autoFetch) {
      fetchOptions('', initialPage, false);
    }
  }, [autoFetch, fetchOptions, initialPage]);

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedFetch]);

  return {
    options,
    loading,
    isTyping,
    loadMore,
    hasMore,
    setSearchQuery: handleSearchChange,
    searchQuery,
    currentPage,
    isLoadingMore,
    refetch,
  };
}