"use client";

import { Spinner } from "@/components/ui/fragments/shadcn-ui/spinner";
import * as React from "react";
import { Button } from "@/components/ui/fragments/shadcn-ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/fragments/shadcn-ui/sheet";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/fragments/shadcn-ui/drawer";

import SiswaForm from "../../form/siswa-form";
import { useIsMobile } from "@/hooks/use-mobile";
import { SiswaSchema } from "@/lib/validations/app/siswaValidate";
import { useSiswaForm } from "@/hooks/actions/useSiswa";
import { toast } from "sonner";

interface Props {
  siswa?: SiswaSchema;
  open?: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpdateSiswaSheet({ siswa, open = false, onOpenChange }: Props) {
  const isDesktop = useIsMobile();
  const internalOpen = open;
  const setInternalOpen = onOpenChange;

  // ✅ Debug: Log siswa data when component mounts or siswa changes
  React.useEffect(() => {
    if (siswa) {
      console.log("📋 Siswa data received:", siswa);
    }
  }, [siswa]);

  // ✅ Validate siswa.id exists
  React.useEffect(() => {
    if (open && !siswa?.id) {
      console.error("❌ Cannot open update sheet: Siswa ID is missing!");
      toast.error("Data siswa tidak valid");
      onOpenChange(false);
    }
  }, [open, siswa?.id, onOpenChange]);

  // sync external open prop
  React.useEffect(() => {
    setInternalOpen(open);
  }, [open]);

  // ✅ Safe route construction
  const route = React.useMemo(() => {
    if (!siswa?.id) {
      console.warn("⚠️ Siswa ID missing, defaulting to base route");
      return "/dashboard/siswa";
    }
    return `/dashboard/siswa/${siswa.id}`;
  }, [siswa?.id]);

  // ✅ Determine method
  const method = React.useMemo(() => {
    return siswa?.id ? "put" : "post";
  }, [siswa?.id]);

  const { form, submit, isPending } = useSiswaForm(siswa ?? undefined, {
    notify: ({ type, message }) => {
      if (type === "success") toast.success(message);
      else toast.error(message);
    },
    closeSheet: () => setInternalOpen(false),
    route,
    method,
  });

  // ✅ Debug: Log form state changes
  React.useEffect(() => {
    if (open && form) {
      const subscription = form.watch((value) => {
        console.log("📝 Form state changed:", value);
      });
      return () => subscription.unsubscribe();
    }
  }, [form, open]);

  // ✅ Debug: Log form errors
  React.useEffect(() => {
    if (open) {
      const errors = form.formState.errors;
      if (Object.keys(errors).length > 0) {
        console.log("❌ Form validation errors:", errors);
      }
    }
  }, [form.formState.errors, open]);

  // Don't render if no valid siswa
  if (!siswa?.id) {
    return null;
  }

  if (!isDesktop) {
    return (
      <Sheet open={internalOpen} onOpenChange={setInternalOpen} modal={true}>
        <SheetContent className="flex flex-col gap-6 overflow-y-scroll">
          <SheetHeader className="text-left sm:px-6 space-y-1 bg-background z-30 sticky top-0 p-4 border-b">
            <SheetTitle className="text-lg">
              Perbarui{" "}
              <Button
                type="button"
                variant={"outline"}
                className="ml-2 px-2.5 text-base capitalize"
              >
                {siswa?.nama_lengkap || "Siswa"}
              </Button>
            </SheetTitle>
            <SheetDescription className="sr-only">
              Fill in the details below to update siswa data
            </SheetDescription>
          </SheetHeader>
          <SiswaForm<SiswaSchema>
            isPending={isPending}
            defaultvalue={siswa}
            form={form}
            onSubmit={submit}
          >
            <SheetFooter className="gap-3 px-3 py-4 w-full flex-row justify-end flex border-t sm:space-x-0">
              <SheetClose
                disabled={isPending}
                asChild
                onClick={() => form.reset()}
              >
                <Button
                  disabled={isPending}
                  type="button"
                  className="w-fit"
                  size={"sm"}
                  variant="outline"
                >
                  {isPending && <Spinner className="animate-spin" />}
                  Batalkan
                </Button>
              </SheetClose>

              <Button
                type="submit"
                disabled={isPending}
                className="w-fit"
                size="sm"
              >
                {isPending && <Spinner className="animate-spin" />}
                Update
              </Button>
            </SheetFooter>
          </SiswaForm>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={internalOpen} onOpenChange={setInternalOpen} modal={true}>
      <DrawerContent className="flex flex-col">
        <DrawerHeader className="text-left sm:px-6 space-y-1 bg-background p-4 border-b">
          <DrawerTitle className="text-xl">
            Perbarui{" "}
            <Button
              type="button"
              variant={"outline"}
              className="ml-2 px-2.5 text-base"
            >
              {siswa?.nama_lengkap || "Siswa"}
            </Button>
          </DrawerTitle>
          <DrawerDescription className="text-sm">
            Fill in the details below to update siswa data
          </DrawerDescription>
        </DrawerHeader>

        <SiswaForm<SiswaSchema>
          isPending={isPending}
          form={form}
          defaultvalue={siswa}
          onSubmit={submit}
        >
          <DrawerFooter className="gap-3 px-3 py-4 w-full flex-row justify-end flex border-t sm:space-x-0">
            <DrawerClose
              disabled={isPending}
              asChild
              onClick={() => form.reset()}
            >
              <Button
                disabled={isPending}
                type="button"
                className="w-fit"
                size={"sm"}
                variant="outline"
              >
                {isPending && <Spinner className="animate-spin" />}
                Batalkan
              </Button>
            </DrawerClose>
            <Button
              type="submit"
              disabled={isPending}
              className="w-fit !pointer-events-auto dark:bg-primary dark:text-primary-foreground bg-primary text-primary-foreground"
              size={"sm"}
            >
              {isPending && <Spinner className="animate-spin" />}
              Update
            </Button>
          </DrawerFooter>
        </SiswaForm>
      </DrawerContent>
    </Drawer>
  );
}