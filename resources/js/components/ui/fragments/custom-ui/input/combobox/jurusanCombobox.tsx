import React from 'react';
import debounce from 'lodash.debounce';
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
import { PencilRuler, Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

interface Jurusan {
  id: number;
  nama_jurusan: string;
  kode_jurusan?: string;
}

interface TaskFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  isPending: boolean;
}

export default function JurusanCombobox<T extends FieldValues>({
  form,
  isPending,
}: TaskFormProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [currentInputValue, setCurrentInputValue] = React.useState('');
  const [JurusanResults, setJurusanResults] = React.useState<Jurusan[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const [selectedJurusan, setSelectedJurusan] = React.useState<Jurusan | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  const searchCache = React.useRef<Map<string, { data: Jurusan[]; hasMore: boolean }>>(new Map());
  const abortControllerRef = React.useRef<AbortController | null>(null);

  // Stable fetch function
  const fetchJurusan = React.useCallback(
    async (query: string, page = 1, append = false) => {
      const cacheKey = `${query}-${page}`;

      if (!append && searchCache.current.has(cacheKey)) {
        const cached = searchCache.current.get(cacheKey)!;
        setJurusanResults(cached.data);
        setHasMore(cached.hasMore);
        setIsSearching(false);
        return;
      }

      // abort previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;
      setIsSearching(true);

      try {
        const url = new URL('/dashboard/jurusan/json_data', window.location.origin);
        url.searchParams.append('search', query);
        url.searchParams.append('page', page.toString());
        url.searchParams.append('perPage', '10');

        const response = await fetch(url.toString(), {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            // DON'T set Content-Type for GET; browser handles it.
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const newData: Jurusan[] = result.data || [];
        const pagination = result.meta?.pagination || {};

        if (append) {
          setJurusanResults((prev) => {
            const combined = [...prev, ...newData];
            searchCache.current.set(cacheKey, { data: combined, hasMore: pagination.hasMore || false });
            return combined;
          });
        } else {
          setJurusanResults(newData);
          searchCache.current.set(cacheKey, { data: newData, hasMore: pagination.hasMore || false });
        }

        setHasMore(pagination.hasMore || false);
        setCurrentPage(page);
      } catch (err) {
        // Properly ignore AbortError and don't spam console
        if (err && (err === 'AbortError' || err instanceof DOMException && err.name === 'AbortError')) {
          // aborted intentionally - ignore
        } else {
          console.error('Fetch error:', err);
          setJurusanResults([]);
          setHasMore(false);
        }
      } finally {
        setIsSearching(false);
        setIsLoadingMore(false);
      }
    },
    []
  );

  const debouncedSearch = React.useMemo(
    () =>
      debounce((query: string) => {
        setIsTyping(false);
        setCurrentPage(1);
        fetchJurusan(query, 1, false);
      }, 300),
    [fetchJurusan]
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
    fetchJurusan(searchValue, currentPage + 1, true);
  };

  // initial load
  React.useEffect(() => {
    fetchJurusan('', 1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // cleanup
  React.useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedSearch]);

  // sync selectedJurusan when field value changes (e.g. when form is populated)
  React.useEffect(() => {
    const val = form.getValues('jurusan_id' as FieldPath<T>) as number | undefined;
    if (val) {
      const found = JurusanResults.find(k => k.id === val);
      if (found) setSelectedJurusan(found);
      // else you may want to fetch single item by id for prefill
    } else {
      setSelectedJurusan(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, JurusanResults]);

  return (
    <>
      <FormField
        control={form.control}
        name={'jurusan_id' as FieldPath<T>}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className={cn(isPending && 'text-muted-foreground')}>
              Jurusan
              {(isSearching || isTyping) && (
                <span className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Spinner className="h-3 w-3 animate-spin" />
                  {isTyping ? 'Mengetik...' : 'Mencari...'}
                </span>
              )}
              {!isSearching && !isTyping && JurusanResults.length > 0 && (
                <span className="ml-2 text-xs text-muted-foreground">({JurusanResults.length} dimuat)</span>
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
                    className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                  >
                    {field.value
                      ? selectedJurusan?.nama_jurusan ||
                        JurusanResults.find((ta) => ta.id === field.value)?.nama_jurusan ||
                        'Memuat...'
                      : 'Pilih jurusan'}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0" align="start">
                <Command shouldFilter={false}>
                  <div className="relative">
                    <CommandInput
                      placeholder="Cari jurusan..."
                      value={currentInputValue ?? ''} // prevent null value warning
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
                          {searchValue ? `Tidak ada hasil untuk "${searchValue}"` : 'Tidak ada jurusan'}
                        </div>
                      )}
                    </CommandEmpty>

                    {!isSearching && JurusanResults.length > 0 && (
                      <>
                        <CommandGroup>
                          {JurusanResults.map((Jurusan) => (
                            <CommandItem
                              key={Jurusan.id}
                              value={Jurusan.nama_jurusan}
                              onSelect={() => {
                                form.setValue('jurusan_id' as FieldPath<T>, Jurusan.id as T[FieldPath<T>]);
                                setSelectedJurusan(Jurusan);
                                setIsOpen(false);
                                setCurrentInputValue('');
                                setSearchValue('');
                              }}
                              className="flex justify-between items-center"
                            >
                              <div className="flex gap-3 items-center">
                                <PencilRuler className="size-4 text-accent-foreground" />
                                <div className="flex flex-col">
                                  <span>{Jurusan.nama_jurusan}</span>
                                  {Jurusan.kode_jurusan && <span className="text-xs text-muted-foreground">{Jurusan.kode_jurusan}</span>}
                                </div>
                              </div>
                              <Check className={cn('mr-2 h-4 w-4', Jurusan.id === field.value ? 'opacity-100' : 'opacity-0')} />
                            </CommandItem>
                          ))}
                        </CommandGroup>

                        {hasMore && (
                          <>
                            <CommandSeparator />
                            <CommandGroup>
                              <CommandItem onSelect={handleLoadMore} className="justify-center text-center" disabled={isLoadingMore}>
                                {isLoadingMore ? (
                                  <div className="flex items-center gap-2">
                                    <Spinner className="h-4 w-4 " />
                                    Memuat lebih banyak...
                                  </div>
                                ) : (
                                  <div className="text-center">
                                    <p>Load More</p>
                                    <p className="text-xs text-muted-foreground">Klik untuk memuat lebih banyak</p>
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

            <FormDescription className="sr-only">{searchValue ? `Hasil pencarian untuk "${searchValue}"` : 'Ketik untuk mencari jurusan'}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
