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


import { Textarea } from "@/components/ui/fragments/shadcn-ui/textarea";
import { StatusOptions } from "@/config/enums/status";


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
              name={"nama_jurusan" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(isPending && "text-muted-foreground")}>
                    Nama Jurusan
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
                    Nama jurusan
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

               <FormField
              control={form.control}
              name={"kode_jurusan" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(isPending && "text-muted-foreground")}>
                    Kode Jurusan
                  </FormLabel>
                  <FormControl>
                    <Input
                    
                      placeholder={`RPL`}
                      type="text"
                      disabled={isPending}
                      {...field}
                    
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Kode Jurusan
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                name={"deskripsi" as FieldPath<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(isPending && "text-muted-foreground")}>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="description"
                        className="resize-none"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="sr-only">{`Jurusan description`}</FormDescription>
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
                          <SelectValue placeholder="Pilih status" />
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
                      Pilih tahun ajar status
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



