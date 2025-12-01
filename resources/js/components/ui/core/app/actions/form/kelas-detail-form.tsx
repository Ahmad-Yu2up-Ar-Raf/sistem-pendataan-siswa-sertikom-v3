"use client";

import * as React from "react";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

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
import { CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/fragments/shadcn-ui/textarea";
 
import TahunAjarCombobox from "@/components/ui/fragments/custom-ui/input/combobox/tahunAjarCombobox";
import KelasCombobox from "@/components/ui/fragments/custom-ui/input/combobox/kelasCombobox";
 
 
import { StatusKelasOptions } from "@/config/enums/StatusKelas";
import { SemesterOptions } from "@/config/enums/Semester";
import { SiswaSchema } from "@/lib/validations/app/siswaValidate";
import SiswaCombobox from "@/components/ui/fragments/custom-ui/input/combobox/siswaCombobox";

interface TaskFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  children: React.ReactNode;
  isPending: boolean;
  siswa? : SiswaSchema
}

export default function SiswaForm<T extends FieldValues>({
  form,
  onSubmit,
  children,
  isPending,
  siswa,
}: TaskFormProps<T>) {
 

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex overflow-y-scroll pt-6 md:pt-0 md:overflow-y-clip flex-col gap-4 px-0"
      >
        <main className="space-y-6 mb-6">
          <section className="space-y-10 pb-8 pt-2 px-4 sm:px-6 border-b">
                        
            <SiswaCombobox isPending={isPending} form={form}/>
          <FormField
                control={form.control}
                name={"status_kelas" as FieldPath<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange}  
                      value={field.value}  
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {StatusKelasOptions.map((item, i) => (
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

            <TahunAjarCombobox isPending={isPending} form={form}/>
            <KelasCombobox isPending={isPending} form={form}/>
           

        
        
        
          </section>

          {/* Bidang Opsional */}
          <section className="space-y-10 px-4 sm:px-6">
            <header>
              <h1 className="text-lg font-semibold">Bidang Opsional</h1>
              <p className="text-sm text-muted-foreground">
                Field opsional yang tidak wajib diisi
              </p>
            </header>

            <section className="space-y-10">

             <FormField
                          control={form.control}
                          name={"tanggal_masuk" as FieldPath<T>}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Tanggal Masuk</FormLabel>
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
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                  
                                    onSelect={field.onChange}
                               
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormDescription className="sr-only">
                                Tanggal Masuk tahun ajar
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
            
                        <FormField
                          control={form.control}
                          name={"tanggal_keluar" as FieldPath<T>}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Tanggal Keluar</FormLabel>
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
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                   
                                    onSelect={field.onChange}
                                  
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormDescription className="sr-only">
                                Tanggal Keluar tahun ajar
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
   <FormField
                control={form.control}
                name={"semester" as FieldPath<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semester</FormLabel>
                    <Select 
                      onValueChange={field.onChange}  
                      value={field.value}  
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih semester" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SemesterOptions.map((item, i) => (
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
          

              <FormField
                control={form.control}
                name={"no_urut_absen" as FieldPath<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(isPending && "text-muted-foreground")}>
                        No Urut Absen
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="No Absen"
                        type="number"
                        disabled={isPending}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"nilai_rata_rata" as FieldPath<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(isPending && "text-muted-foreground")}>
                      Nilai Rata Rata
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nilai Rata Rata"
                        type="number"
                        disabled={isPending}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
 
              <FormField
                control={form.control}
                name={"ranking" as FieldPath<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(isPending && "text-muted-foreground")}>
                      Ranking
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ranking"
                        type="number"
                        disabled={isPending}
                        {...field}
                        value={field.value || ""}
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
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
 
              {/* ✅ FIXED: Status - Use value instead of defaultValue */}
            
            </section>
          </section>
        </main>

        {children}
      </form>
    </Form>
  );
}