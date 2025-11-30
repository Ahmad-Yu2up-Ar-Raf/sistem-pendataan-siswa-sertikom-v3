/**
 * DateRangeFilter Component
 * 
 * Date range filter adapted for Inertia.js. Allows selecting from/to dates
 * and sends them as 'YYYY-MM-DD' format query params to backend.
 */

import * as React from "react";
import { CalendarIcon, XCircle } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/fragments/shadcn-ui/button";
import { Calendar } from "@/components/ui/fragments/shadcn-ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/fragments/shadcn-ui/popover";
import { Separator } from "@/components/ui/fragments/shadcn-ui/separator";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { batasiKata } from "@/hooks/useWord";
import { useIsMobile } from "@/hooks/use-mobile";

interface DateRangeFilterProps {
  column: string;
  title: string;
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}

export function DateRangeFilter({
  column,
  title,
  value,
  onChange,
}: DateRangeFilterProps) {
  const [open, setOpen] = React.useState(false);
   const isMobile = useIsMobile();
  const titleFinnal = isMobile ?  batasiKata( title,1) : title
  const handleReset = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(undefined);
      setOpen(false);
    },
    [onChange]
  );

  const handleSelect = React.useCallback(
    (range: DateRange | undefined) => {
      onChange(range);
    },
    [onChange]
  );

  const hasValue = React.useMemo(() => {
    return value?.from || value?.to;
  }, [value]);

  const formatDateRange = React.useCallback((range: DateRange) => {
    if (!range.from && !range.to) return "";
    if (range.from && range.to) {
      return `${formatDate(range.from)} - ${formatDate(range.to)}`;
    }
    return formatDate(range.from ?? range.to);
  }, []);

  const label = React.useMemo(() => {
    const dateText = hasValue && value ? formatDateRange(value) : "Select date range";

    return (
      <span className="flex items-center gap-2">
        <span>{titleFinnal}</span>
        {hasValue && (
          <>
            <Separator
              orientation="vertical"
              className="mx-0.5 data-[orientation=vertical]:h-4"
            />
            <span className="text-xs">{dateText}</span>
          </>
        )}
      </span>
    );
  }, [value, hasValue, formatDateRange, title , isMobile]);
 
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
       variant="outline" size="sm" className="border-dashed text-xs   h-8"
        >
          {hasValue ? (
            <div
              role="button"
              aria-label={`Clear ${titleFinnal} filter`}
              tabIndex={0}
              onClick={handleReset}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleReset(e as unknown as React.MouseEvent);
                }
              }}
              className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <XCircle className=" size-3.5" />
            </div>
          ) : (
            <CalendarIcon  className=" size-3.5"/>
          )}
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          selected={value}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}