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
import { StatusSiswaOptions } from "@/config/enums/StatusSiswa";

import AvatarInput from "@/components/ui/fragments/custom-ui/input/file-input/avatar-input";
import { JenisKelaminOptions } from "@/config/enums/jenis-kelamin";
import { AgamaOptions } from "@/config/enums/agama";
import { CountrySelector } from "@/components/ui/fragments/custom-ui/input/select/location-input";
import TahunAjarCombobox from "@/components/ui/fragments/custom-ui/input/combobox/tahunAjarCombobox";
import KelasCombobox from "@/components/ui/fragments/custom-ui/input/combobox/kelasCombobox";
import JurusanCombobox from "@/components/ui/fragments/custom-ui/input/combobox/jurusanCombobox";
import { SiswaSchema } from "@/lib/validations/app/siswaValidate";
import { ProvinceSelector } from "@/components/ui/fragments/custom-ui/input/select/province-input";

interface TaskFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  children: React.ReactNode;
  isPending: boolean;
  defaultvalue?: SiswaSchema;
}

export default function SiswaForm<T extends FieldValues>({
  form,
  onSubmit,
  children,
  isPending,
  defaultvalue,
}: TaskFormProps<T>) {
 

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex overflow-y-scroll pt-6 md:pt-0 md:overflow-y-clip flex-col gap-4 px-0"
      >
        <main className="space-y-6 mb-6">
          <section className="space-y-10 pb-8 pt-2 px-4 sm:px-6 border-b">
            
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
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      type="text"
                      disabled={isPending}
                      {...field}
                      value={field.value || ""}
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
                      type="text"
                      disabled={isPending}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Country Field */}
           

           

            <FormField
              control={form.control}
              name={"nama_ayah" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(isPending && "text-muted-foreground")}>
                    Nama Ayah
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nama ayah"
                      type="text"
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
              name={"nama_ibu" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(isPending && "text-muted-foreground")}>
                    Nama Ibu
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nama ibu"
                      type="text"
                      disabled={isPending}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <TahunAjarCombobox isPending={isPending} form={form}/>
            <KelasCombobox isPending={isPending} form={form}/>
            <JurusanCombobox isPending={isPending} form={form}/>

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
                      <Calendar mode="single" onSelect={field.onChange} selected={field.value} />
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
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ FIXED: Use value instead of defaultValue */}
            <FormField
              control={form.control}
              name={"jenis_kelamin" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Kelamin</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kelamin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {JenisKelaminOptions.map((item, i) => (
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

            {/* ✅ FIXED: Use value instead of defaultValue */}
            <FormField
              control={form.control}
              name={"agama" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agama</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih agama" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AgamaOptions.map((item, i) => (
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

          {/* Optional Fields */}
          <section className="space-y-10 px-4 sm:px-6">
            <header>
              <h1 className="text-lg font-semibold">Optional Fields</h1>
              <p className="text-sm text-muted-foreground">
                Field opsional yang tidak wajib diisi
              </p>
            </header>

            <section className="space-y-10">

              {/* ========== FOTO FIELD (Avatar Input) ========== */}
              <FormField
                control={form.control}
                name={"foto" as FieldPath<T>}
                render={({ field }) => (
                  <FormItem className="">
                    <FormControl>
                      <AvatarInput
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormDescription className="text-center">
                      Upload foto profil siswa (JPG, PNG, max 2MB)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />


                 {/* Province Field */}
            <FormField
              control={form.control}
              name={"provinsi" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempat Lahir</FormLabel>
                  <FormControl>
                    <ProvinceSelector
                      value={field.value || ""}
                      onChange={field.onChange}
                      countryName={"Indonesia"}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription className='text-xs sr-only text-muted-foreground'>
                    Pilih your province (if available)
                  </FormDescription>
                  <FormMessage className='sr-only'/>
                </FormItem>
              )}
            />    

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
                        value={field.value || ""}
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
                        value={field.value || ""}
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
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ✅ FIXED: Status - Use value instead of defaultValue */}
              <FormField
                control={form.control}
                name={"status" as FieldPath<T>}
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