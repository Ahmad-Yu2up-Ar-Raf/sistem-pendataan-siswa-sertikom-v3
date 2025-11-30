// src/components/sheets/UpdateJurusanSheet.tsx
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

import JurusanForm from "../../form/jurusan-form";
import { useIsMobile } from "@/hooks/use-mobile";
import { JurusanSchema } from "@/lib/validations/app/jurusanValidate";
import { useJurusanForm } from "@/hooks/actions/useJurusan";
import { toast } from "sonner";

interface Props {
  jurusan: JurusanSchema | null;
  open?: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpdateJurusanSheet({ jurusan, open = false, onOpenChange }: Props) {

  const isDesktop = useIsMobile();
  const internalOpen = open
  const setInternalOpen = onOpenChange
  // sync external open prop if provided
  React.useEffect(() => {
    setInternalOpen(open);
  }, [open]);


  // route for update: include id when available
  const route = jurusan?.id ? `/dashboard/jurusan/${jurusan.id}` : "/dashboard/jurusan";

  const { form, submit, isPending } = useJurusanForm(jurusan ?? undefined, {
    notify: ({ type, message }) => {
      if (type === "success") toast.success(message);
      else toast.error(message);
    },
    closeSheet: () => setInternalOpen(false),
    route,
    method: jurusan?.id ? "put" : "post", // if no id treat as create fallback
  });

  if (!isDesktop) {
    return (
      <Sheet open={internalOpen} onOpenChange={setInternalOpen} modal={true}>
      
        <SheetContent className="flex flex-col gap-6 overflow-y-scroll ">
          <SheetHeader className="text-left sm:px-6 space-y-1 bg-background z-30  sticky top-0   p-4 border-b  ">
            <SheetTitle className=" text-lg">
              Perbarui {" "}
              <Button
                type="button"
                variant={"outline"}
                className=" ml-2  px-2.5 text-base capitalize"
              >
               {jurusan?.nama_jurusan}
              </Button>{" "}
            </SheetTitle>
            <SheetDescription className=" sr-only">
              Fill in the details below to update a new tahun ajar
            </SheetDescription>
          </SheetHeader>
          <JurusanForm<JurusanSchema>
            isPending={isPending}
            form={form}
            onSubmit={submit}
          >
            <SheetFooter className="gap-3 px-3 py-4 w-full flex-row justify-end  flex  border-t sm:space-x-0">
              <SheetClose
                disabled={isPending}
                asChild
                onClick={() => form.reset()}
              >
                <Button
                  disabled={isPending}
                  type="button"
                  className="  w-fit"
                  size={"sm"}
                  variant="outline"
                >
                  {isPending && <Spinner className="animate-spin" />}
                 Batalkan
                </Button>
              </SheetClose>
              <Button
                disabled={isPending}
                type="submit"
                className="w-fit dark:bg-primary  pointer-events-auto  dark:text-primary-foreground  bg-primary text-primary-foreground "
                size={"sm"}
              >
                {isPending && <Spinner className="animate-spin" />}
                Update
              </Button>
            </SheetFooter>
          </JurusanForm>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={internalOpen} onOpenChange={setInternalOpen} modal={true}>
    
      <DrawerContent className="flex flex-col  ">
        <DrawerHeader className="text-left sm:px-6 space-y-1 bg-background    p-4 border-b  ">
          <DrawerTitle className=" text-xl">
          Perbarui {" "}
            <Button
              type="button"
              variant={"outline"}
              className=" ml-2  px-2.5 text-base"
            >
            {jurusan?.nama_jurusan}
            </Button>{" "}
          </DrawerTitle>
          <DrawerDescription className=" text-sm">
            Fill in the details below to update a new tahun ajar
          </DrawerDescription>
        </DrawerHeader>

        <JurusanForm<JurusanSchema>
          isPending={isPending}
          form={form}
          onSubmit={submit}
        >
          <DrawerFooter className="gap-3 px-3 py-4 w-full flex-row justify-end  flex  border-t sm:space-x-0">
            <DrawerClose
              disabled={isPending}
              asChild
              onClick={() => form.reset()}
            >
              <Button
                disabled={isPending}
                type="button"
                className="  w-fit"
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
              className="w-fit   !pointer-events-auto  dark:bg-primary  dark:text-primary-foreground  bg-primary text-primary-foreground "
              size={"sm"}
            >
              {isPending && <Spinner className="animate-spin" />}
              Update
            </Button>
          </DrawerFooter>
        </JurusanForm>
      </DrawerContent>
    </Drawer>
  );
}
