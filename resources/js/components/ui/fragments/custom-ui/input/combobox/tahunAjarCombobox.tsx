import React from 'react'
import debounce from "lodash.debounce";
import { Spinner } from "@/components/ui/fragments/shadcn-ui/spinner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/fragments/shadcn-ui/popover";
import {

  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/fragments/shadcn-ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/fragments/shadcn-ui/command";
import { Button } from '../../../shadcn-ui/button';
import { CalendarIcon, Check, DoorOpen, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

interface TahunAjar {
  id: number;
  nama_tahun_ajar: string;
  kode_tahun_ajar?: string;
}

interface TaskFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;


  isPending: boolean;
}

export default function TahunAjarCombobox<T extends FieldValues>({
  form,

  isPending,
}: TaskFormProps<T>) {
      const [isOpen, setIsOpen] = React.useState(false);
      const [searchValue, setSearchValue] = React.useState("");
      const [currentInputValue, setCurrentInputValue] = React.useState("");
      const [tahunAjarResults, setTahunAjarResults] = React.useState<TahunAjar[]>([]);
      const [isSearching, setIsSearching] = React.useState(false);
      const [isTyping, setIsTyping] = React.useState(false);
      const [selectedTahunAjar, setSelectedTahunAjar] = React.useState<TahunAjar | null>(null);
      const [currentPage, setCurrentPage] = React.useState(1);
      const [hasMore, setHasMore] = React.useState(false);
      const [isLoadingMore, setIsLoadingMore] = React.useState(false);
    
      const searchCache = React.useRef<Map<string, { data: TahunAjar[]; hasMore: boolean }>>(new Map());
      const abortControllerRef = React.useRef<AbortController | null>(null);
    
      const fetchTahunAjar = async (query: string, page: number = 1, append: boolean = false) => {
        const cacheKey = `${query}-${page}`;
    
        if (!append && searchCache.current.has(cacheKey)) {
          const cached = searchCache.current.get(cacheKey)!;
          setTahunAjarResults(cached.data);
          setHasMore(cached.hasMore);
          setIsSearching(false);
          return;
        }
    
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
    
        abortControllerRef.current = new AbortController();
        setIsSearching(true);
    
        try {
          const url = new URL('/dashboard/tahun_ajar/json_data', window.location.origin);
          url.searchParams.append('search', query);
          url.searchParams.append('page', page.toString());
          url.searchParams.append('perPage', '10');
    
          const response = await fetch(url.toString(), {
            signal: abortControllerRef.current.signal,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
    
          const result = await response.json();
          const newData = result.data || [];
          const pagination = result.meta?.pagination || {};
    
          if (append) {
            const combined = [...tahunAjarResults, ...newData];
            setTahunAjarResults(combined);
            searchCache.current.set(cacheKey, { 
              data: combined, 
              hasMore: pagination.hasMore || false 
            });
          } else {
            setTahunAjarResults(newData);
            searchCache.current.set(cacheKey, { 
              data: newData, 
              hasMore: pagination.hasMore || false 
            });
          }
    
          setHasMore(pagination.hasMore || false);
          setCurrentPage(page);
    
        } catch (error) {
          if (error !== "AbortError") {
            console.error("Fetch error:", error);
            setTahunAjarResults([]);
            setHasMore(false);
          }
        } finally {
          setIsSearching(false);
          setIsLoadingMore(false);
        }
      };
    
      const debouncedSearch = React.useMemo(
        () =>
          debounce((query: string) => {
            setIsTyping(false);
            setCurrentPage(1);
            fetchTahunAjar(query, 1, false);
          }, 300),
        []
      );
    
      const handleInputChange = (value: string) => {
        setCurrentInputValue(value);
        setSearchValue(value);
        setIsTyping(true);
        debouncedSearch(value);
      };
    
      const handleLoadMore = () => {
        if (isLoadingMore || !hasMore) return;
        setIsLoadingMore(true);
        fetchTahunAjar(searchValue, currentPage + 1, true);
      };
    
      React.useEffect(() => {
        fetchTahunAjar('', 1, false);
      }, []);
    
      React.useEffect(() => {
        return () => {
          debouncedSearch.cancel();
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }
        };
      }, [debouncedSearch]);
  return (
    <>
      {/* ========== TAHUN AJAR COMBOBOX ========== */}
            <FormField
              control={form.control}
              name={"tahun_ajar_id" as FieldPath<T>}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className={cn(isPending && "text-muted-foreground")}>
                    Tahun Ajar
                    {(isSearching || isTyping) && (
                      <span className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Spinner className="h-3 w-3 animate-spin" />
                        {isTyping ? "Mengetik..." : "Mencari..."}
                      </span>
                    )}
                    {!isSearching && !isTyping && tahunAjarResults.length > 0 && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({tahunAjarResults.length} dimuat)
                      </span>
                    )}
                  </FormLabel>

                  <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={isOpen}
                          disabled={isPending}
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? selectedTahunAjar?.nama_tahun_ajar ||
                              tahunAjarResults.find((ta) => ta.id === field.value)
                                ?.nama_tahun_ajar ||
                              "Memuat..."
                            : "Pilih tahun ajar"}
                          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="w-full p-0" align="start">
                      <Command shouldFilter={false}>
                        <div className="relative">
                          <CommandInput
                            placeholder="Cari tahun ajar..."
                            value={currentInputValue}
                            onValueChange={handleInputChange}
                          />
                          {(isSearching || isTyping) && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                              <Spinner className="h-4 w-4 " />
                            </div>
                          )}
                        </div>

                        <CommandList className="max-h-72 overflow-y-auto">
                          <CommandEmpty>
                            {isSearching || isTyping ? (
                              <div className="flex items-center justify-center gap-2 py-4">
                                <Spinner className="h-4 w-4 animate-spin" />
                                <span>Mencari...</span>
                              </div>
                            ) : (
                              <div className="py-4 text-center text-sm text-muted-foreground">
                                {searchValue 
                                  ? `Tidak ada hasil untuk "${searchValue}"`
                                  : "Tidak ada tahun ajar"}
                              </div>
                            )}
                          </CommandEmpty>

                          {!isSearching && tahunAjarResults.length > 0 && (
                            <>
                              <CommandGroup>
                                {tahunAjarResults.map((tahunAjar) => (
                                  <CommandItem
                                    key={tahunAjar.id}
                                    value={tahunAjar.nama_tahun_ajar}
                                    onSelect={() => {
                                      form.setValue(
                                        "tahun_ajar_id" as FieldPath<T>,
                                        tahunAjar.id as  T[FieldPath<T>]
                                      );
                                      setSelectedTahunAjar(tahunAjar);
                                      setIsOpen(false);
                                      setCurrentInputValue("");
                                      setSearchValue("");
                                    }}
                                    className="flex justify-between items-center"
                                  >
                                    <div className="flex gap-3 items-center">
                                      <CalendarIcon className="size-4 text-accent-foreground" />
                                      <div className="flex flex-col">
                                        <span>{tahunAjar.nama_tahun_ajar}</span>
                                        {tahunAjar.kode_tahun_ajar && (
                                          <span className="text-xs text-muted-foreground">
                                            {tahunAjar.kode_tahun_ajar}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        tahunAjar.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>

                              {hasMore && (
                                <>
                                  <CommandSeparator />
                                  <CommandGroup>
                                    <CommandItem
                                      onSelect={handleLoadMore}
                                      className="justify-center text-center"
                                      disabled={isLoadingMore}
                                    >
                                      {isLoadingMore ? (
                                        <div className="flex items-center gap-2">
                                          <Spinner className="h-4 w-4 " />
                                          Memuat lebih banyak...
                                        </div>
                                      ) : (
                                        <div className="text-center">
                                          <p>Load More</p>
                                          <p className="text-xs text-muted-foreground">
                                            Klik untuk memuat lebih banyak
                                          </p>
                                        </div>
                                      )}
                                    </CommandItem>
                                  </CommandGroup>
                                </>
                              )}
                            </>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <FormDescription className=' sr-only'>
                    {searchValue 
                      ? `Hasil pencarian untuk "${searchValue}"`
                      : "Ketik untuk mencari tahun ajar"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
    </>
  )
}

