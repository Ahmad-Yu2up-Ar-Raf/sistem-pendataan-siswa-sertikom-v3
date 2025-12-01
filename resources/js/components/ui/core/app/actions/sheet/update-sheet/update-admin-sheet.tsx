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

import UserForm from "../../form/user-form";
import { useIsMobile } from "@/hooks/use-mobile";
import { UserSchema } from "@/lib/validations/auth/auth";
import { useUserForm } from "@/hooks/actions/useUser";
import { toast } from "sonner";

interface Props {
  user?: UserSchema;
  open?: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpdateUserSheet({ user, open = false, onOpenChange }: Props) {
 
  const isDesktop = useIsMobile();
  const internalOpen = open
  const setInternalOpen = onOpenChange
  // sync external open prop if provided
  React.useEffect(() => {
    setInternalOpen(open);
  }, [open]);


  // route for update: include id when available
  const route = user?.id ? `/dashboard/admin/${user.id}` : "/dashboard/admin";

  const { form, submit, isPending } = useUserForm(user ?? undefined, {
    notify: ({ type, message }) => {
      if (type === "success") toast.success(message);
      else toast.error(message);
    },
    closeSheet: () => setInternalOpen(false),
    route,
    method: user?.id ? "put" : "post", // if no id treat as create fallback
  });
  console.log("Rendering UpdateUserSheet for user:", user);
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
               {user?.name}
              </Button>{" "}
            </SheetTitle>
            <SheetDescription className=" sr-only">
              Fill in the details below to update a new tahun ajar
            </SheetDescription>
          </SheetHeader>
          <UserForm<UserSchema>
            isPending={isPending}
            defaultvalue={user}
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
  type="submit"
  disabled={isPending}
  onClick={() => form.handleSubmit(submit)()}
  className="w-fit ..."
  size="sm"
>
  {isPending && <Spinner className="animate-spin" />}
  Update
</Button>

            </SheetFooter>
          </UserForm>
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
            {user?.name}
            </Button>{" "}
          </DrawerTitle>
          <DrawerDescription className=" text-sm">
            Fill in the details below to update a new tahun ajar
          </DrawerDescription>
        </DrawerHeader>

        <UserForm<UserSchema>
          isPending={isPending}
          form={form}
               defaultvalue={user}
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
              className="w-fit   !pointer-events-auto  dark:bg-primary  text-primary-foreground  dark:primary-foreground  bg-primary  text-primary-foreground "
              size={"sm"}
            >
              {isPending && <Spinner className="animate-spin" />}
              Update
            </Button>
          </DrawerFooter>
        </UserForm>
      </DrawerContent>
    </Drawer>
  );
}
