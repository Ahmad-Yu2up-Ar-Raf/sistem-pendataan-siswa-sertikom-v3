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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/fragments/shadcn-ui/popover";
import { Button } from "@/components/ui/fragments/shadcn-ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/fragments/shadcn-ui/calendar";
import { format } from "date-fns";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/fragments/shadcn-ui/select";


import { StatusOptions } from "@/config/enums/status";


interface TaskFormProps<T extends FieldValues>
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  isPending: boolean;
}

export default function TahunAjarForm<T extends FieldValues, >({
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
              name={"kode_tahun_ajar" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(isPending && "text-muted-foreground")}>
                    Kode Tahun Ajar
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Capactity name`}
                      type="number"
                      disabled={isPending}
                      {...field}
                    
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Kode tahun ajar
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"nama_tahun_ajar" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(isPending && "text-muted-foreground")}>
                    Nama Tahun Ajar
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Tahun Ajaran 2024/2025"
                      type="text"
                      disabled={isPending}
                      {...field}
                   
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Nama tahun ajar
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"tanggal_mulai" as FieldPath<T>}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Mulai</FormLabel>
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
                    Tanggal mulai tahun ajar
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"tanggal_selesai" as FieldPath<T>}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Selesai</FormLabel>
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
                    Tanggal selesai tahun ajar
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
                name={"status" as FieldPath<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                    
                    >
                      <FormControl>
                        <SelectTrigger
                                disabled={isPending}
                        >
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



