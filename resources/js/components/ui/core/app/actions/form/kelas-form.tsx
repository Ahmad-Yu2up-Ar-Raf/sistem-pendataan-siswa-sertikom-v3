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

import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/fragments/shadcn-ui/select";



import { StatusOptions } from "@/config/enums/status";
import JurusanCombobox from "@/components/ui/fragments/custom-ui/input/combobox/jurusanCombobox";
import { Tingkat, TingkatOptions } from "@/config/enums/tingkat";
import TahunAjarCombobox from "@/components/ui/fragments/custom-ui/input/combobox/tahunAjarCombobox";


interface TaskFormProps<T extends FieldValues>
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<T>;
  disable?: boolean,
  onSubmit: (data: T) => void;
  isPending: boolean;
}

export default function JurusanForm<T extends FieldValues, >({
  form,
  onSubmit,
  children,
  isPending,

}: TaskFormProps<T>) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex overflow-y-scroll pt-6 md:pt-0 md:overflow-y-clip flex-col gap-4 px-0"
      >
        <main className="space-y-6 mb-6">
          <section className="space-y-10  pb-8 pt-2 px-4 sm:px-6 border-b">
          

            <FormField
              control={form.control}
              name={"nama_kelas" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(isPending && "text-muted-foreground")}>
                    Nama Kelas
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="XI - RPL"
                      type="text"
                      disabled={isPending}
                      {...field}
                    
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Nama kelas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
           

               <FormField
                control={form.control}
                name={"tingkat" as FieldPath<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tingkat</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger       disabled={isPending}>
                          <SelectValue placeholder="Select tingkat" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent defaultValue={Tingkat.X}>
                        {TingkatOptions.map((item,i) => (
                          <SelectItem key={i} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="sr-only">
                      Select tingkat status
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

                 <JurusanCombobox isPending={isPending} form={form}/>
                 <TahunAjarCombobox isPending={isPending} form={form}/>
          </section>

          <section className="space-y-10 px-4 sm:px-6">
            <header>
              <h1 className="text-lg font-semibold">Optional Fields</h1>
              <p className="text-sm text-muted-foreground">
                These are columns that do not need any value
              </p>
            </header>

            <section className="space-y-10">


                          <FormField
              control={form.control}
              name={"kapasitas_maksimal" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(isPending && "text-muted-foreground")}>
                    Kapasitas Maksimal
                  </FormLabel>
                  <FormControl>
                    <Input
                      
                      placeholder={`130`}
                      type="number"
                      disabled={isPending}
                      {...field}
                    
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Kapasitas Maksimal
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
               <FormField
              control={form.control}
              name={"wali_kelas" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(isPending && "text-muted-foreground")}>
                    Wali Kelas
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Rekayasa Perangkat Lunak"
                      type="text"
                      disabled={isPending}
                      {...field}
                    
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Wali kelas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          
                   <FormField
              control={form.control}
              name={"ruangan" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(isPending && "text-muted-foreground")}>
                   Ruangan
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ruangan"
                      type="text"
                      disabled={isPending}
                      {...field}
                    
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Ruanga
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

           
               <FormField
                control={form.control}
                name={"status" as FieldPath<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                       defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger       disabled={isPending}>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {StatusOptions.map((item,i) => (
                          <SelectItem key={i} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="sr-only">
                      Select tahun ajar status
                    </FormDescription>
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



