"use client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/fragments/shadcn-ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/fragments/shadcn-ui/sheet";
import KelasForm from "../../form/kelas-form";
import { Spinner } from "@/components/ui/fragments/shadcn-ui/spinner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/fragments/shadcn-ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { useKelasForm } from "@/hooks/actions/useKelas";
import { toast } from "sonner";

interface type  {
  trigger?: boolean;
  open? : boolean,
  onOpenChange? :  React.Dispatch<React.SetStateAction<boolean>>
}


export default function CreateKelasSheet({ ...props }: type) {
  const open = props.open
  const setOpen = props.onOpenChange
  const isDesktop = useIsMobile();

  const { form, submit, isPending } = useKelasForm(undefined, {
    notify: ({ type, message }) => {
      if (type === "success") toast.success(message);
      else toast.error(message);
    },
    closeSheet: () => setOpen!(false),
    route: "/dashboard/kelas",
  });


  if (!isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen} modal={true}>
        {(props.trigger == null) && (
          <SheetTrigger asChild>
            <Button
              className=" text-sm  w-fit "
            >
              <Plus className=" mr-3 " />
              Tambahkan Baru
            </Button>
          </SheetTrigger>
        )}
        <SheetContent className="flex flex-col gap-6 overflow-y-scroll ">
          <SheetHeader className="text-left sm:px-6 space-y-1 bg-background z-30  sticky top-0   p-4 border-b  ">
            <SheetTitle className=" text-lg">
              Tambahkan Baru{" "}
              <Button
                type="button"
                variant={"outline"}
                className=" ml-2  px-2.5 text-base capitalize"
              >
                kelas
              </Button>{" "}
            </SheetTitle>
            <SheetDescription className=" sr-only">
              Isi rincian di bawah ini untuk membuat data kelas
            </SheetDescription>
          </SheetHeader>
          <KelasForm
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
                className="w-fit dark:bg-primary  text-primary-foreground !pointer-kelas-auto  dark:primary-foreground  bg-primary  text-primary-foreground "
                size={"sm"}
              >
                {isPending && <Spinner className="animate-spin" />}
                Tambahkan
              </Button>
            </SheetFooter>
          </KelasForm>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} modal={true}>
      {(props.trigger == null) && (
        <DrawerTrigger
          asChild
        >
          <Button
            className=" w-fit text-sm "
          >
            <Plus className=" mr-3 " />
            Tambahkan Baru
          </Button>
        </DrawerTrigger>
      )}
      <DrawerContent className="flex flex-col  ">
        <DrawerHeader className="text-left sm:px-6 space-y-1 bg-background    p-4 border-b  ">
          <DrawerTitle className=" text-xl">
            Tambahkan Baru{" "}
            <Button
              type="button"
              variant={"outline"}
              className=" ml-2  px-2.5 text-base"
            >
              kelas
            </Button>{" "}
          </DrawerTitle>
          <DrawerDescription className=" text-sm">
            Isi rincian di bawah ini untuk membuat data kelas
          </DrawerDescription>
        </DrawerHeader>

        <KelasForm
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
              className="w-fit  !pointer-kelas-auto  dark:bg-primary  text-primary-foreground  dark:primary-foreground  bg-primary  text-primary-foreground "
              size={"sm"}
            >
              {isPending && <Spinner className="animate-spin" />}
              Tambahkan
            </Button>
          </DrawerFooter>
        </KelasForm>
      </DrawerContent>
    </Drawer>
  );
}