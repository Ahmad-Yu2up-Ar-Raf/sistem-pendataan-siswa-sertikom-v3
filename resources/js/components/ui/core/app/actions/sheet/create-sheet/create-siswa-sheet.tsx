"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Plus } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
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
import SiswaForm from "../../form/siswa-form";

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
import { router } from "@inertiajs/react";
import { siswaSchema, SiswaSchema } from "@/lib/validations/siswaValidate";


interface type  {
  trigger?: boolean;
  
}

export default function CreateSiswaSheet({ ...props }: type) {
  const [isPending, startTransition] = React.useTransition();
  const [loading, setLoading] = React.useState(false);
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isDesktop = useIsMobile();

  // Use internal state if onOpenChange is not provided
  const isOpen =  internalOpen;
  const handleOpenChange =  setInternalOpen;

  const form = useForm<SiswaSchema>({
    mode: "onSubmit",
    defaultValues: {
      nama_lengkap: "",
      nama_ayah: "",
      nama_wali: "",

    },
    resolver: zodResolver(siswaSchema),
  });

  function onSubmit(input: SiswaSchema) {
    toast.loading("Loading....", {
      id: "create-siswa",
    });

    startTransition(() => {
      setLoading(true);

      router.post("/dashboard/siswa", input, {
        preserveScroll: true,
        preserveState: true,

        onSuccess: () => {
          form.reset();
          handleOpenChange(false);
          toast.success("Siswa created successfully", {
            id: "create-siswa",
          });
          setLoading(false);
        },
        onError: (error) => {
          console.error("Submit error:", error);
          toast.error(`Error: ${Object.values(error).join(", ")}`, {
            id: "create-siswa",
          });
          setLoading(false);
        },
        onFinish: () => {
          setLoading(false);
        },
      });
    });
  }

  if (!isDesktop) {
    return (
      <Sheet open={isOpen} onOpenChange={handleOpenChange} modal={true}>
        {(props.trigger == null) && (
          <SheetTrigger asChild>
            <Button
              className=" text-sm  w-fit "
            >
              <Plus className=" mr-3 " />
              Add New
            </Button>
          </SheetTrigger>
        )}
        <SheetContent className="flex flex-col gap-6 overflow-y-scroll ">
          <SheetHeader className="text-left sm:px-6 space-y-1 bg-background z-30  sticky top-0   p-4 border-b  ">
            <SheetTitle className=" text-lg">
              Add New{" "}
              <Button
                type="button"
                variant={"outline"}
                className=" ml-2  px-2.5 text-base capitalize"
              >
                siswa
              </Button>{" "}
            </SheetTitle>
            <SheetDescription className=" sr-only">
              Fill in the details below to create a new siswa
            </SheetDescription>
          </SheetHeader>
          <SiswaForm
            isPending={loading}
            form={form}
            onSubmit={onSubmit}
          >
            <SheetFooter className="gap-3 px-3 py-4 w-full flex-row justify-end  flex  border-t sm:space-x-0">
              <SheetClose
                disabled={loading}
                asChild
                onClick={() => form.reset()}
              >
                <Button
                  disabled={loading}
                  type="button"
                  className="  w-fit"
                  size={"sm"}
                  variant="outline"
                >
                  {loading && <Loader className="animate-spin" />}
                  Cancel
                </Button>
              </SheetClose>
              <Button
                disabled={loading}
                type="submit"
                className="w-fit dark:bg-primary !pointer-siswa-auto  dark:text-primary-foreground  bg-primary text-primary-foreground "
                size={"sm"}
              >
                {loading && <Loader className="animate-spin" />}
                Add
              </Button>
            </SheetFooter>
          </SiswaForm>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange} modal={true}>
      {(props.trigger == null) && (
        <DrawerTrigger
          asChild
        >
          <Button
            className=" w-fit text-sm "
          >
            <Plus className=" mr-3 " />
            Add New
          </Button>
        </DrawerTrigger>
      )}
      <DrawerContent className="flex flex-col  ">
        <DrawerHeader className="text-left sm:px-6 space-y-1 bg-background    p-4 border-b  ">
          <DrawerTitle className=" text-xl">
            Add New{" "}
            <Button
              type="button"
              variant={"outline"}
              className=" ml-2  px-2.5 text-base"
            >
              siswa
            </Button>{" "}
          </DrawerTitle>
          <DrawerDescription className=" text-sm">
            Fill in the details below to create a new siswa
          </DrawerDescription>
        </DrawerHeader>

        <SiswaForm
          isPending={loading}
          form={form}
          onSubmit={onSubmit}
        >
          <DrawerFooter className="gap-3 px-3 py-4 w-full flex-row justify-end  flex  border-t sm:space-x-0">
            <DrawerClose
              disabled={loading}
              asChild
              onClick={() => form.reset()}
            >
              <Button
                disabled={loading}
                type="button"
                className="  w-fit"
                size={"sm"}
                variant="outline"
              >
                {loading && <Loader className="animate-spin" />}
                Cancel
              </Button>
            </DrawerClose>
            <Button
              type="submit"
              disabled={loading}
              className="w-fit  !pointer-siswa-auto  dark:bg-primary  dark:text-primary-foreground  bg-primary text-primary-foreground "
              size={"sm"}
            >
              {loading && <Loader className="animate-spin" />}
              Add
            </Button>
          </DrawerFooter>
        </SiswaForm>
      </DrawerContent>
    </Drawer>
  );
}