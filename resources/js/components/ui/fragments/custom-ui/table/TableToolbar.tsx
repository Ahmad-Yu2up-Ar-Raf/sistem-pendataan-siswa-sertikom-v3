// resources/js/components/tahun-ajar/TableToolbar.tsx
import { Input } from "@/components/ui/fragments/shadcn-ui/input";
import { Button } from "@/components/ui/fragments/shadcn-ui/button";
import {  Plus, X } from "lucide-react";
import { GenericMultiEnumFilter } from "./GenericMultiEnumFilter";
import { Filters, OptionItem } from "@/types";
import { cn } from "@/lib/utils";
import React from "react";

interface TableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filters: Filters;
  filterConfigs: {
    column: string;
    title: string;
    options: OptionItem[];
  }[];
  onFilterChange: (column: string, values: string[]) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onCreateClick: () => void;
  className?: string
  children?: React.ReactNode
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
        "flex w-full flex-col md:flex-row items-start justify-between gap-10 md:gap-2 ",
        className,
      )}
   
    >
         <div className="flex md:order-2 justify-end  w-full items-center gap-2">
        {children}
  <Button onClick={onCreateClick} className=" h-10 md:h-8  w-full md:w-fit text-sm">
        <Plus/>    Add New 
          </Button>
      </div>
    
        {/* Search Input */}
      
           <div className={cn("w-full grid  md:flex md:flex-wrap items-center gap-2" , filterConfigs.length > 1 ? "grid-cols-2 " : "grid-cols-1 " )}>
       
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="md:max-w-[20em]   col-span-2  h-10 md:h-8 w-full  "
          />
       
            {filterConfigs.map((config) => (
              <GenericMultiEnumFilter
                key={config.column}
                column={config.column}
                title={config.title}
                options={config.options}
                selectedValues={filters[config.column] as string[] }
                onValueChange={(values) =>
                  onFilterChange(config.column, values)
                }
              />
            ))}

            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={onClearFilters}
                className={cn("h-10  col-span-2  md:h-8 border-dashed px-2 lg:px-3" ,
                  
                  
                )}
              >
                <X className=" size-4" />
                Reset
              </Button>
            )}
          </div>
       

        {/* Filters & Actions */}
     
         

        
    
  
    </div>
  );
}