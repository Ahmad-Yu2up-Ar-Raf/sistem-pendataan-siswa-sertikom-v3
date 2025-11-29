// resources/js/components/tahun-ajar/Pagination.tsx
import { Button } from "@/components/ui/fragments/shadcn-ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/fragments/shadcn-ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { router } from "@inertiajs/react";

import { Filters, PaginatedData } from "@/types";

interface PaginationProps {
  pagination: PaginatedData;
  filters: Filters;
  selectedCount: number;
  totalCount: number;
  route: string;
}

export function Pagination({
  pagination,
  filters,
  selectedCount,
  totalCount,
  route,
}: PaginationProps) {
  const navigateToPage = (page: number) => {
    router.get(
      route,
      {
        page,
        perPage: pagination.perPage,
        ...filters,
      },
      {
        preserveState: true,
        preserveScroll: false,
      }
    );
  };

  const changePerPage = (perPage: string) => {
    router.get(
      route,
      {
        perPage,
        page: 1, // Reset to first page
        ...filters,
      },
      {
        preserveState: true,
        preserveScroll: false,
      }
    );
  };

  return (
    <footer className="flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8">
      <div className="flex-1 whitespace-nowrap text-sm text-muted-foreground">
        {selectedCount} of {totalCount} row(s) selected.
      </div>
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select value={`${pagination.perPage}`} onValueChange={changePerPage}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={`${pagination.perPage}`} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {pagination.currentPage} of {pagination.lastPage}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => navigateToPage(1)}
            disabled={pagination.currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => navigateToPage(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => navigateToPage(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.lastPage}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => navigateToPage(pagination.lastPage)}
            disabled={pagination.currentPage === pagination.lastPage}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </footer>
  );
}