/**
 * useTableFilters Hook (Generic)
 * 
 * Generic reusable hook for managing table filters with Inertia.js.
 * Supports enum filters (arrays), relation filters (arrays), date ranges, and search.
 * Debounces filter application and builds proper query params for backend.
 */

import { router } from "@inertiajs/react";
import { useCallback, useMemo, useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { DateRange } from "react-day-picker";
import { Filters } from "@/types";

export interface TableFilters {
  search: string;
  [key: string]: string | string[] | number[] | DateRange | undefined;
}

interface UseTableFiltersConfig {
  route: string;
  initialFilters?: Partial<Filters>;
  debounceMs?: number;
}

interface UseTableFiltersReturn {
  filters: TableFilters;
  setSearch: (value: string) => void;
  setEnumFilter: (column: string, values: string[]) => void;
  setDateRange: (column: string, range: DateRange | undefined) => void;
  clearFilters: () => void;
  clearFilter: (column: string) => void;
  hasActiveFilters: boolean;
  applyFilters: (immediate?: boolean) => void;
}

function formatDateForBackend(date: Date | undefined): string | undefined {
  if (!date) return undefined;
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

export function useTableFilters({
  route,
  initialFilters = {},
  debounceMs = 300,
}: UseTableFiltersConfig): UseTableFiltersReturn {
  const [filters, setFilters] = useState<TableFilters>(() => {
    const normalized: TableFilters = { search: initialFilters.search || "" };

    Object.keys(initialFilters).forEach((key) => {
      if (key === 'search') return;

      const value = initialFilters[key];
      if (Array.isArray(value)) {
        normalized[key] = value;
      } else if (typeof value === 'string') {
        normalized[key] = value ? [value] : [];
      } else {
        normalized[key] = value;
      }
    });

    return normalized;
  });

  // Build query params for Inertia
  const buildQueryParams = useCallback((currentFilters: TableFilters) => {
    const params: Record<string, string | string[] | number | number[]> = {};

    Object.entries(currentFilters).forEach(([key, value]) => {
      if (key === 'search' && typeof value === 'string' && value) {
        params.search = value;
        return;
      }

      // Date range handling (e.g., created_at becomes created_from and created_to)
      if (value && typeof value === 'object' && 'from' in value) {
        const range = value as DateRange;
        const fromDate = formatDateForBackend(range.from);
        const toDate = formatDateForBackend(range.to);
        if (fromDate) params[`${key}_from`] = fromDate;
        if (toDate) params[`${key}_to`] = toDate;
        return;
      }

      // Array filters (enums, relations)
      if (Array.isArray(value) && value.length > 0) {
        params[key] = value;
      }
    });

    return params;
  }, []);

  // Debounced apply
  const debouncedApply = useMemo(
    () =>
      debounce((newFilters: TableFilters) => {
        const params = buildQueryParams(newFilters);

        router.get(route, params, {
          preserveState: true,
          preserveScroll: true,
          replace: true,
          only: ["data", "meta"],
        });
      }, debounceMs),
    [route, buildQueryParams, debounceMs]
  );

  const applyFilters = useCallback(
    (immediate = false) => {
      if (immediate) {
        debouncedApply.cancel();
        const params = buildQueryParams(filters);
        router.get(route, params, {
          preserveState: true,
          preserveScroll: true,
          replace: true,
          only: ["data", "meta"],
        });
      } else {
        debouncedApply(filters);
      }
    },
    [filters, debouncedApply, buildQueryParams, route]
  );

  const setSearch = useCallback(
    (search: string) => {
      setFilters((prev) => {
        const newFilters = { ...prev, search };
        debouncedApply(newFilters);
        return newFilters;
      });
    },
    [debouncedApply]
  );

  const setEnumFilter = useCallback(
    (column: string, values: string[]) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [column]: values };
        debouncedApply(newFilters);
        return newFilters;
      });
    },
    [debouncedApply]
  );

  const setDateRange = useCallback(
    (column: string, range: DateRange | undefined) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [column]: range };
        debouncedApply(newFilters);
        return newFilters;
      });
    },
    [debouncedApply]
  );

  const clearFilter = useCallback(
    (column: string) => {
      setFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters[column];
        debouncedApply(newFilters);
        return newFilters;
      });
    },
    [debouncedApply]
  );

  const clearFilters = useCallback(() => {
    const clearedFilters: TableFilters = { search: "" };
    setFilters(clearedFilters);

    router.get(route, {}, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  }, [route]);

  const hasActiveFilters = useMemo(() => {
    if (filters.search !== "") return true;

    return Object.entries(filters).some(([key, value]) => {
      if (key === 'search') return false;

      if (Array.isArray(value) && value.length > 0) return true;

      if (value && typeof value === 'object' && 'from' in value) {
        const range = value as DateRange;
        return range.from || range.to;
      }

      return false;
    });
  }, [filters]);

  // Sync with external changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: initialFilters.search || "",
    }));
  }, [initialFilters.search]);

  return {
    filters,
    setSearch,
    setEnumFilter,
    setDateRange,
    clearFilters,
    clearFilter,
    hasActiveFilters,
    applyFilters,
  };
}