// resources/js/hooks/useFilters.ts
import { router } from "@inertiajs/react";
import { useCallback, useMemo, useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { Filters } from "@/types";


interface FilterOptions {
  initialFilters?: Partial<Filters>;
  route: string;
}

/**
 * Hook for managing table filters with Inertia.js
 * Supports multiple enum values per filter column.
 * Query params sent as arrays: ?status[]=aktif&status[]=non_aktif
 */
export function useFilters({
  initialFilters = {},
  route,
}: FilterOptions) {
  const [filters, setFilters] = useState<Filters>({
    search: initialFilters.search || "",
    status: Array.isArray(initialFilters.status)
      ? initialFilters.status
      : initialFilters.status
      ? [initialFilters.status]
      : [],
    jenis_kelamin: Array.isArray(initialFilters.jenis_kelamin)
      ? initialFilters.jenis_kelamin
      : initialFilters.jenis_kelamin
      ? [initialFilters.jenis_kelamin]
      : [],
    agama: Array.isArray(initialFilters.agama)
      ? initialFilters.agama
      : initialFilters.agama
      ? [initialFilters.agama]
      : [],
  });

  // Sync with external filter changes (e.g., from Inertia props)
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: initialFilters.search || "",
       status: Array.isArray(initialFilters.status)
      ? initialFilters.status
      : initialFilters.status
      ? [initialFilters.status]
      : [],
       jenis_kelamin: Array.isArray(initialFilters.jenis_kelamin)
      ? initialFilters.jenis_kelamin
      : initialFilters.jenis_kelamin
      ? [initialFilters.jenis_kelamin]
      : [],
      agama: Array.isArray(initialFilters.agama)
        ? initialFilters.agama
        : initialFilters.agama
        ? [initialFilters.agama]
        : [],
    }));
  }, [initialFilters.search, initialFilters.status  , initialFilters.agama , initialFilters.jenis_kelamin]);

  // Build query params for Inertia (arrays as status[]=value)
  const buildQueryParams = useCallback((currentFilters: Filters) => {
    const params: Record<string, any> = {};

    if (currentFilters.search) {
      params.search = currentFilters.search;
    }

    // Handle array filters (enum multi-select)
    Object.keys(currentFilters).forEach((key) => {
      if (key === "search") return;

      const value = currentFilters[key];
      if (Array.isArray(value) && value.length > 0) {
        params[key] = value; // Inertia will serialize as key[]=val1&key[]=val2
      }
    });

    return params;
  }, []);

  // Debounced apply filters - sends to server via Inertia
  const debouncedApplyFilters = useMemo(
    () =>
      debounce((newFilters: Filters) => {
        const params = buildQueryParams(newFilters);

        router.get(route, params, {
          preserveState: true,
          preserveScroll: true,
          replace: true, // Don't add to history
          only: ["data", "meta"], // Only refresh these props
        });
      }, 300),
    [route, buildQueryParams]
  );

  // Update search
  const setSearch = useCallback(
    (search: string) => {
      setFilters((prev) => {
        const newFilters = { ...prev, search };
        debouncedApplyFilters(newFilters);
        return newFilters;
      });
    },
    [debouncedApplyFilters]
  );

  // Update enum filter (generic for any column)
  const setEnumFilter = useCallback(
    (column: string, values: string[]) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [column]: values };
        debouncedApplyFilters(newFilters);
        return newFilters;
      });
    },
    [debouncedApplyFilters]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    const clearedFilters: Filters = { search: "", status: [] , agama : [] , jenis_kelamin : []};
    setFilters(clearedFilters);

    router.get(
      route,
      {},
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
      }
    );
  }, [route]);

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    if (filters.search !== "") return true;

    return Object.keys(filters).some((key) => {
      if (key === "search") return false;
      const value = filters[key];
      return Array.isArray(value) && value.length > 0;
    });
  }, [filters]);

  return {
    filters,
    setSearch,
    setEnumFilter,
    clearFilters,
    hasActiveFilters,
  };
}