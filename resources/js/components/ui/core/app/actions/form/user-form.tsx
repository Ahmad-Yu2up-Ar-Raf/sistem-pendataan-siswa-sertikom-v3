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

 
import AvatarInput from "@/components/ui/fragments/custom-ui/input/file-input/avatar-input";
 
import { UserSchema } from "@/lib/validations/auth/auth";
 
import { RoleOptions } from "@/config/enums/Roles";
import { PasswordInput } from "@/components/ui/fragments/custom-ui/input/password-input";



interface TaskFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  children: React.ReactNode;
  isPending: boolean;
    defaultvalue?: UserSchema;
}

export default function UserForm<T extends FieldValues>({
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
              name={"name" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(isPending && "text-muted-foreground")}>
                    Nama Lengkap
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      type="text"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"email" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(isPending && "text-muted-foreground")}>
                  Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email"
                      type="email"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password Field */}
            {/* {defaultvalue == null && (
              <>
              
              </>
            )} */}
            <FormField
              control={form.control}
              name={"password" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(isPending && "text-muted-foreground" , 


                  )}>
                    Password
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Password"
              
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
              <FormField
                control={form.control}
                name={"password_confirmation" as FieldPath<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(isPending && "text-muted-foreground")}>
                      Password Confirmation
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Password Confirmation"
          
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            {/* Password Field */}

   {/* Status */}
              <FormField
                control={form.control}
                name={"roles" as FieldPath<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roles</FormLabel>
                    <Select onValueChange={field.onChange}  defaultValue={defaultvalue?.primary_role}  disabled={isPending}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {RoleOptions.map((item, i) => (
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
              {/* Tanggal Lahir */}


                 {/* ========== FOTO FIELD (Avatar Input) ========== */}
            <FormField
              control={form.control}
              name={"foto" as FieldPath<T>}
              render={({ field }) => (
                <FormItem className="">
                  {/* <FormLabel className={cn(isPending && "text-muted-foreground sr-only hidden text-center w-full m-auto")}>
                    Foto Profil
                  </FormLabel> */}
                  <FormControl>
                    <AvatarInput
                      title="User"
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription className=" text-center">
                    Upload foto profil user (JPG, PNG, max 2MB)
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