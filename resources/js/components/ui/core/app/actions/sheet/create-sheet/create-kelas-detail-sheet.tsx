"use client";
import {  Plus } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
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
import KelasDetailForm from "../../form/kelas-detail-form";
import { useIsMobile } from "@/hooks/use-mobile";
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
import { useKelasDetailForm } from "@/hooks/actions/useKelasDetail";
import { Spinner } from "@/components/ui/fragments/shadcn-ui/spinner";
import { SiswaSchema } from "@/lib/validations/app/siswaValidate";

interface type  {
  trigger?: boolean;
  open? : boolean,
  siswa? : SiswaSchema
  onOpenChange? :  React.Dispatch<React.SetStateAction<boolean>>
}


export default function CreateKelasDetailSheet({ ...props }: type) {
  const open = props.open
  const setOpen = props.onOpenChange
  const isDesktop = useIsMobile();


  const { form, submit, isPending } = useKelasDetailForm({siswa_id : props.siswa?.id , kelas_id : props.siswa?.kelas_id, tahun_ajar_id : props.siswa?.tahun_ajar_id }, {
    notify: ({ type, message }) => {
      if (type === "success") toast.success(message);
      else toast.error(message);
    },
    closeSheet: () => setOpen!(false),
    route: "/dashboard/kelasDetail",
  });


  if (!isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen} modal={true}>
        {props.trigger == null && (
          <SheetTrigger asChild>
            <Button   size={"sm"} className="w-fit text-sm">
            <Plus className=" size-3 " />
           <span className="  hidden">
            Tambahkan Baru
            </span> 
          </Button>
          </SheetTrigger>
        )}
        <SheetContent className="flex flex-col gap-6 overflow-y-scroll">
          <SheetHeader className="text-left sm:px-6 space-y-1 bg-background z-30 sticky top-0 p-4 border-b">
            <SheetTitle className="text-lg">
              Tambahkan Riwayat Kelas{" "}
              <Button
                type="button"
                variant={"outline"}
                className="ml-2 px-2.5 text-base capitalize"
              >
                           {props.siswa?.nama_lengkap}
              </Button>{" "}
            </SheetTitle>
            <SheetDescription className="sr-only">
              Isi rincian di bawah ini untuk membuat data kelasDetail
            </SheetDescription>
          </SheetHeader>
          <KelasDetailForm isPending={isPending} form={form} onSubmit={submit}>
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
                  {isPending && <Spinner className="" />}
                 Batalkan
                </Button>
              </SheetClose>
              <Button
                disabled={isPending}
                type="submit"
                className="w-fit dark:bg-primary  text-primary-foreground !pointer-kelasDetail-auto dark:primary-foreground bg-primary"
                size={"sm"}
              >
                {isPending && <Spinner className="" />}
                Tambahkan
              </Button>
            </SheetFooter>
          </KelasDetailForm>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} modal={true}>
      {props.trigger == null && (
        <DrawerTrigger asChild>
          <Button   size={"sm"} className="w-fit text-sm">
            <Plus className=" size-3 " />
           <span className="  hidden">
            Tambahkan Baru
            </span> 
          </Button>
        </DrawerTrigger>
      )}
      <DrawerContent className="flex flex-col">
        <DrawerHeader className="text-left sm:px-6 space-y-1 bg-background p-4 border-b">
          <DrawerTitle className="text-xl">
            Tambahkan Riwayat Kelas{" "}
            <Button
              type="button"
              variant={"outline"}
              className="ml-2 px-2.5 text-base"
            >
              {props.siswa?.nama_lengkap}
            </Button>{" "}
          </DrawerTitle>
          <DrawerDescription className="text-sm sr-only">
            Isi rincian di bawah ini untuk membuat data kelasDetail
          </DrawerDescription>
        </DrawerHeader>

        <KelasDetailForm isPending={isPending} form={form} onSubmit={submit}>
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
                {isPending && <Spinner className="" />}
               Batalkan
              </Button>
            </DrawerClose>
            <Button
              type="submit"
              disabled={isPending}
              className="w-fit !pointer-kelasDetail-auto dark:bg-primary  text-primary-foreground dark:primary-foreground bg-primary"
              size={"sm"}
            >
              {isPending && <Spinner className="" />}
              Tambahkan
            </Button>
          </DrawerFooter>
        </KelasDetailForm>
      </DrawerContent>
    </Drawer>
  );
}