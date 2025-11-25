"use client";

import * as React from "react";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

import debounce from "lodash.debounce";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/fragments/shadcn-ui/form";
import { Input } from "@/components/ui/fragments/shadcn-ui/input";
import { Calendar } from "@/components/ui/fragments/shadcn-ui/calendar";
import { format } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/fragments/shadcn-ui/popover";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/fragments/shadcn-ui/select";

import { Button } from "@/components/ui/fragments/shadcn-ui/button";
import { CalendarIcon, Check, Search, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/fragments/shadcn-ui/textarea";
import { StatusSiswaOptions } from "@/config/enums/StatusSiswa";
import { Spinner } from "@/components/ui/fragments/shadcn-ui/spinner";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/fragments/shadcn-ui/command";

interface TahunAjar {
  id: number;
  nama_tahun_ajar: string;
  kode_tahun_ajar?: string;
}

interface TaskFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  children: React.ReactNode;
  isPending: boolean;
}

export default function SiswaFormAsync<T extends FieldValues>({
  form,
  onSubmit,
  children,
  isPending,
}: TaskFormProps<T>) {
  // State untuk combobox dan async search
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [currentInputValue, setCurrentInputValue] = React.useState("");
  const [tahunAjarResults, setTahunAjarResults] = React.useState<TahunAjar[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const [selectedTahunAjar, setSelectedTahunAjar] = React.useState<TahunAjar | null>(null);

  // Cache untuk mengurangi request
  const searchCache = React.useRef<Map<string, TahunAjar[]>>(new Map());
  const abortControllerRef = React.useRef<AbortController | null>(null);

  // Debounced search function
  const debouncedSearch = React.useMemo(
    () =>
      debounce(async (query: string) => {
        setIsTyping(false);
        
        // Jangan search jika kurang dari 2 karakter
        if (query.length < 2) {
          setTahunAjarResults([]);
          setIsSearching(false);
          return;
        }

        // Cek cache dulu
        if (searchCache.current.has(query)) {
          setTahunAjarResults(searchCache.current.get(query)!);
          setIsSearching(false);
          return;
        }

        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        setIsSearching(true);

        try {
          const response = await fetch(
            `dashboard/tahun_ajar/json_data?search=${encodeURIComponent(query)}`,
            { signal: abortControllerRef.current.signal }
          );

          if (!response.ok) throw new Error("Search failed");

          const data = await response.json();
          const results = data.data || [];

          // Simpan ke cache
          searchCache.current.set(query, results);
          setTahunAjarResults(results);
        } catch (error: any) {
          if (error.name !== "AbortError") {
            console.error("Search error:", error);
            setTahunAjarResults([]);
          }
        } finally {
          setIsSearching(false);
        }
      }, 300),
    []
  );

  // Handle input change
  const handleInputChange = (value: string) => {
    setCurrentInputValue(value);
    setSearchValue(value);
    setIsTyping(true);
    debouncedSearch(value);
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedSearch]);



  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex overflow-y-scroll pt-6 md:pt-0 md:overflow-y-clip flex-col gap-4 px-0"
      >
        <main className="space-y-6 mb-6">
          <section className="space-y-10 pb-8 pt-2 px-4 sm:px-6 border-b">
            {/* NISN Field */}
            <FormField
              control={form.control}
              name={"nisn" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(isPending && "text-muted-foreground")}>
                    NISN
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="NISN"
                      type="number"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* NIS Field */}
            <FormField
              control={form.control}
              name={"nis" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(isPending && "text-muted-foreground")}>
                    NIS
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="NIS"
                      type="number"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* RT Field */}
            <FormField
              control={form.control}
              name={"rt" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(isPending && "text-muted-foreground")}>
                    RT
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="RT"
                      type="text"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* RW Field */}
            <FormField
              control={form.control}
              name={"rw" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(isPending && "text-muted-foreground")}>
                    RW
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="RW"
                      type="text"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nama Lengkap Field */}
            <FormField
              control={form.control}
              name={"nama_lengkap" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(isPending && "text-muted-foreground")}>
                    Nama Lengkap
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nama lengkap"
                      type="text"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Asal Sekolah Field */}
            <FormField
              control={form.control}
              name={"asal_sekolah" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(isPending && "text-muted-foreground")}>
                    Asal Sekolah
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Asal sekolah"
                      type="text"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ========== TAHUN AJAR COMBOBOX (ASYNC SEARCH) ========== */}
            <FormField
              control={form.control}
              name={"tahun_ajar" as FieldPath<T>}
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
                            placeholder="Ketik min. 2 karakter..."
                            value={currentInputValue}
                            onValueChange={handleInputChange}
                          />
                          {(isSearching || isTyping) && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
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
                            ) : searchValue.length < 2 ? (
                              <div className="py-4 text-center text-sm text-muted-foreground">
                                Ketik minimal 2 karakter untuk mencari
                              </div>
                            ) : (
                              <div className="py-4 text-center text-sm text-muted-foreground">
                                Tidak ada hasil untuk "{searchValue}"
                              </div>
                            )}
                          </CommandEmpty>

                          {!isSearching && tahunAjarResults.length > 0 && (
                            <CommandGroup>
                              {tahunAjarResults.map((tahunAjar) => (
                                <CommandItem
                                  key={tahunAjar.id}
                                  value={tahunAjar.nama_tahun_ajar}
                                  onSelect={() => {
                                    form.setValue(
                                      "tahun_ajar" as FieldPath<T>,
                                      tahunAjar.id  as any
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
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <FormDescription>
                    Ketik untuk mencari tahun ajar (min. 2 karakter)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          {/* Optional Fields */}
          <section className="space-y-10 px-4 sm:px-6">
            <header>
              <h1 className="text-lg font-semibold">Optional Fields</h1>
              <p className="text-sm text-muted-foreground">
                Field opsional yang tidak wajib diisi
              </p>
            </header>

            <section className="space-y-10">
              {/* Tanggal Lahir */}
              <FormField
                control={form.control}
                name={"tanggal_lahir" as FieldPath<T>}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Lahir</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={isPending}
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            type="button"
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" onSelect={field.onChange} />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Alamat */}
              <FormField
                control={form.control}
                name={"alamat" as FieldPath<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(isPending && "text-muted-foreground")}>
                      Alamat
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Alamat lengkap"
                        className="resize-none"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Keterangan */}
              <FormField
                control={form.control}
                name={"keterangan" as FieldPath<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(isPending && "text-muted-foreground")}>
                      Keterangan
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Keterangan tambahan"
                        className="resize-none"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Kelurahan */}
              <FormField
                control={form.control}
                name={"kelurahan" as FieldPath<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(isPending && "text-muted-foreground")}>
                      Kelurahan
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Kelurahan"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name={"status" as FieldPath<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} disabled={isPending}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {StatusSiswaOptions.map((item, i) => (
                          <SelectItem key={i} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
          </section>
        </main>

        {children}
      </form>
    </Form>
  );
}