/**
 * GenericMultiEnumFilter Component (Enhanced)
 * 
 * CHANGES: Extended to support both static enum options and dynamic relation options
 * from backend. When sourceType='dynamic', uses useRemoteOptions hook for pagination,
 * search, and load more. Maintains backward compatibility with existing static usage.
 */

import * as React from "react";
import { Check, PlusCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/fragments/shadcn-ui/badge";
import { Button } from "@/components/ui/fragments/shadcn-ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/fragments/shadcn-ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/fragments/shadcn-ui/popover";
import { Separator } from "@/components/ui/fragments/shadcn-ui/separator";
import { Spinner } from "@/components/ui/fragments/shadcn-ui/spinner";
import { OptionItem } from "@/types";
import { useRemoteOptions, RemoteOption } from "@/hooks/filters/useRemoteOptions";
import { batasiKata } from "@/hooks/useWord";
import { useIsMobile } from "@/hooks/use-mobile";

interface GenericMultiEnumFilterProps {
  column: string;
  title: string;
  sourceType?: 'static' | 'dynamic';
  options?: OptionItem[];
  endpoint?: string;
  selectedValues: string[];
  onValueChange: (values: string[]) => void;
  perPage?: number;
  loadOnOpen?: boolean;
}

export function GenericMultiEnumFilter({
  column,
  title,
  sourceType = 'static',
  options: staticOptions = [],
  endpoint,
  selectedValues,
  onValueChange,
  perPage = 10,
  loadOnOpen = false,
}: GenericMultiEnumFilterProps) {
  const [open, setOpen] = React.useState(false);

  // Dynamic options hook (only used if sourceType === 'dynamic')
  const {
    options: dynamicOptions,
    loading: dynamicLoading,
    isTyping,
    loadMore,
    hasMore,
    setSearchQuery,
    searchQuery,
    isLoadingMore,
  } = useRemoteOptions(endpoint || '', {
    perPage,
    autoFetch: sourceType === 'dynamic' && !loadOnOpen,
  });

  // Determine which options to use
  const displayOptions: Array<OptionItem | RemoteOption> = React.useMemo(() => {
    if (sourceType === 'static') {
      return staticOptions;
    }
    return dynamicOptions.map((opt) => ({
      value: opt.value,
      label: opt.label,
      icon: undefined,
    })) as unknown as OptionItem[];
  }, [sourceType, staticOptions, dynamicOptions]);

  const handleSelect = React.useCallback(
    (value: string) => {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];

      onValueChange(newValues);
    },
    [selectedValues, onValueChange]
  );

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onValueChange([]);
      setOpen(false);
    },
    [onValueChange]
  );

  const isLoading = sourceType === 'dynamic' && (dynamicLoading || isTyping);
  const isMobile = useIsMobile();

  const titleFinnal = isMobile ?  batasiKata( title,1) : title
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="border-dashed text-xs  overflow-hidden  h-8">
          {selectedValues?.length > 0 ? (
            <div
              role="button"
              aria-label={`Clear ${titleFinnal} filter`}
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleClear(e as unknown as React.MouseEvent);
                }
              }}
              className="rounded-sm opacity-70  transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <XCircle className=" size-3.5"/>
            </div>
          ) : (
            <PlusCircle  className=" size-3.5"  />
          )}
          {titleFinnal}
          {selectedValues?.length > 0 && (
            <>
              <Separator
                orientation="vertical"
                className="mx-0.5 data-[orientation=vertical]:h-4"
              />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 text-primary font-normal lg:hidden"
              >
                {selectedValues.length}
              </Badge>
              <div className="hidden items-center gap-1 lg:flex">
                {selectedValues.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 text-primary font-normal"
                  >
                    {selectedValues.length} selected
                  </Badge>
                ) : (
                  displayOptions
                    .filter((option) => selectedValues.includes(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm text-primary px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[12.5rem] p-0" align="start">
        <Command shouldFilter={sourceType === 'static'}>
          <div className="relative">
            <CommandInput
              placeholder={`Search ${title.toLowerCase()}...`}
              value={sourceType === 'dynamic' ? searchQuery : undefined}
              onValueChange={sourceType === 'dynamic' ? setSearchQuery : undefined}
            />
            {isLoading && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Spinner className="h-4 w-4" />
              </div>
            )}
          </div>
          <CommandList className="max-h-full">
            <CommandEmpty>
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 py-4">
                  <Spinner className="h-4 w-4" />
                  <span>Loading...</span>
                </div>
              ) : (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  {searchQuery ? `No results for "${searchQuery}"` : 'No options found'}
                </div>
              )}
            </CommandEmpty>
            {!isLoading && displayOptions.length > 0 && (
              <>
                <CommandGroup className="max-h-[18.75rem] overflow-y-auto overflow-x-hidden">
                  {displayOptions.map((option) => {
                    const isSelected = selectedValues.includes(option.value);
                    const Icon = option.icon as React.ComponentType<{ className?: string }> | undefined;
                    return (
                      <CommandItem
                        key={option.value}
                        onSelect={() => handleSelect(option.value)}
                      >
                        <div
                          className={cn(
                            "flex size-4 items-center justify-center rounded-sm border border-primary",
                            isSelected
                              ? "bg-primary"
                              : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                        {Icon && <Icon className="text-accent-foreground" />}
                        <span className="truncate">{option.label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                {sourceType === 'dynamic' && hasMore && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        onSelect={loadMore}
                        className="justify-center text-center"
                        disabled={isLoadingMore}
                      >
                        {isLoadingMore ? (
                          <div className="flex items-center gap-2">
                            <Spinner className="h-4 w-4" />
                            Loading more...
                          </div>
                        ) : (
                          <div className="text-center">
                            <p>Load More</p>
                            <p className="text-xs text-muted-foreground">
                              Click to load more options
                            </p>
                          </div>
                        )}
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </>
            )}
            {selectedValues.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      onValueChange([]);
                      setOpen(false);
                    }}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}