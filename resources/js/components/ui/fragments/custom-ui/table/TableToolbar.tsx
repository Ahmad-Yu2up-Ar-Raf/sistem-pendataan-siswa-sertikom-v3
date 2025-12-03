/**
 * TableToolbar Component (Enhanced)
 *
 * CHANGES: Added date range filter support, maintains backward compatibility
 */

import { Input } from "@/components/ui/fragments/shadcn-ui/input";
import { Button } from "@/components/ui/fragments/shadcn-ui/button";
import { Plus, X } from "lucide-react";
import { GenericMultiEnumFilter } from "./GenericMultiEnumFilter";
import { DateRangeFilter } from "./DateRangeFilter";
import { Filters, OptionItem } from "@/types";
import { cn } from "@/lib/utils";
import React from "react";
import { DateRange } from "react-day-picker";

interface FilterConfig {
  column: string;
  title: string;
  type: 'enum' | 'relation' | 'date-range';
  options?: OptionItem[];
  endpoint?: string;
  perPage?: number;
}

interface TableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filters: Filters;
  filterConfigs: FilterConfig[];
  onFilterChange: (column: string, values: string[] | DateRange | undefined) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onCreateClick: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function TableToolbar({
  search,
  onSearchChange,
  filters,
  filterConfigs,
  onFilterChange,
  hasActiveFilters,
  onClearFilters,
  onCreateClick,
  className,
  children,
}: TableToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn(
         "flex w-full flex-col sm:flex-row items-start justify-between gap-2 p-1",
        className
      )}
    >
  <div className="flex   w-full sm:w-fit sm:order-2 justify-end  items-center gap-2">
        {children}
         <Button onClick={onCreateClick} size={"sm"} className="fixed md:relative md:end-0 md:bottom-0 end-6 bottom-6 z-50 cursor-pointer transition-all duration-200 w-fit  h-8    text-xs ">
          <Plus />

          <span className="    hidden lg:inline-flex ">
            Tambahkan Baru
            </span>
        </Button>
      </div>

      <div
        className={cn(
          " space-y-2 w-full  sm:flex sm:space-y-0 sm:items-center sm:gap-2 sm:flex-row  sm:justify-start ",
 
        )}
      >
        <Input
          placeholder="Cari..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="md:max-w-[17em] col-span-4  sm:text-base text-xs h-8 w-full"
        />
            <div className=" w-full gap-2 grid grid-cols-3 md:flex    ">
            
        {filterConfigs.map((config) => {
          if (config.type === 'date-range') {
            return (
              <DateRangeFilter
                key={config.column}
                column={config.column}
                title={config.title}
                value={filters[config.column] as DateRange | undefined}
                onChange={(range) => onFilterChange(config.column, range)}
              />
            );
          }
    
          return (
            <GenericMultiEnumFilter
              key={config.column}
              column={config.column}
              title={config.title}
              sourceType={config.type === 'relation' ? 'dynamic' : 'static'}
              options={config.options}
              endpoint={config.endpoint}
              selectedValues={(filters[config.column] as string[]) || []}
              onValueChange={(values) => onFilterChange(config.column, values)}
              perPage={config.perPage}
            />
          );
        })}

        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className={cn("h-8 col-span-2   border-dashed px-2 lg:px-3")}
          >
            <X className="size-4" />
            Reset
          </Button>
        )}
          </div>
      </div>
    </div>
  );
}
