"use client";
import {  Plus } from "lucide-react";
import * as React from "react";;
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
import TahunAjarForm from "../../form/tahun-ajar-form";
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
import { useTahunAjarForm } from "@/hooks/actions/useTahunAjar";
import { Spinner } from "@/components/ui/fragments/shadcn-ui/spinner";

interface type  {
  trigger?: boolean;
  open? : boolean,
  onOpenChange? :  React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateTahunAjarSheet({ ...props }: type) {
  const isDesktop = useIsMobile();
  const open = props.open
  const setOpen = props.onOpenChange
 
   const { form, submit, isPending } = useTahunAjarForm(undefined, {
     notify: ({ type, message }) => {
       if (type === "success") toast.success(message);
       else toast.error(message);
     },
     closeSheet: () => setOpen!(false),
     route: "/dashboard/tahun_ajar",
   });
 
  if (!isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen} modal={true}>
        {(props.trigger == null) && (
          <SheetTrigger asChild>
            <Button
              className=" text-sm mr-0  w-fit "
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
                Tahun Ajar
              </Button>{" "}
            </SheetTitle>
            <SheetDescription className=" sr-only">
              Fill in the details below to create a new tahun ajar
            </SheetDescription>
          </SheetHeader>
          <TahunAjarForm
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
                  {isPending && <Spinner className="" />}
                  Cancel
                </Button>
              </SheetClose>
              <Button
                disabled={isPending}
                type="submit"
                className="w-fit dark:bg-primary !pointer-events-auto  dark:text-primary-foreground  bg-primary text-primary-foreground "
                size={"sm"}
              >
                {isPending && <Spinner className="" />}
                Add
              </Button>
            </SheetFooter>
          </TahunAjarForm>
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
            className="w-full text-sm "
          >
            <Plus className=" mr-3 " />
           <span className="">
             Add New
            </span>
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
              Tahun Ajar
            </Button>{" "}
          </DrawerTitle>
          <DrawerDescription className=" text-sm">
            Fill in the details below to create a new tahun ajar
          </DrawerDescription>
        </DrawerHeader>

        <TahunAjarForm
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
                {isPending && <Spinner className="" />}
                Cancel
              </Button>
            </DrawerClose>
            <Button
              type="submit"
              disabled={isPending}
              className="w-fit  !pointer-events-auto  dark:bg-primary  dark:text-primary-foreground  bg-primary text-primary-foreground "
              size={"sm"}
            >
              {isPending && <Spinner className="" />}
              Add
            </Button>
          </DrawerFooter>
        </TahunAjarForm>
      </DrawerContent>
    </Drawer>
  );
}