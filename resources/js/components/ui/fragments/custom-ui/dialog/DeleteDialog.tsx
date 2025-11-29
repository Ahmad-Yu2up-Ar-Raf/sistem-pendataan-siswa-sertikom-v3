"use client";

import {Trash } from "lucide-react";

import { Spinner } from "../../shadcn-ui/spinner";

import { Button } from "@/components/ui/fragments/shadcn-ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/fragments/shadcn-ui/dialog";
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

import React from "react";

interface DeleteDialogProps{
  id: number 
  trigger?: boolean
  // Optional controlled props
  modal?: boolean;
  className?: string;
  children?: React.ReactNode;
   handledeDelete: (id: number) => void;
  processing?: boolean;
  // Controlled props
   open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default  function DeleteDialog({
   id,
 trigger = true,
 open,
 processing = false,
 handledeDelete,
 onOpenChange,
  ...props
}: DeleteDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);


  // Use controlled state if props are provided, otherwise use internal state
  const isOpen = onOpenChange ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;
  const isDesktop = useIsMobile();





  if (isDesktop ) {
    return (
        <Drawer modal={true} {...props} open={isOpen} onOpenChange={setIsOpen} >
  

  {trigger && ( 
  <DrawerTrigger asChild>
      Delete
        </DrawerTrigger>
    )}
      
   
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">student </span>
          from our servers.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline"  disabled={processing}>   {processing && (
              <Spinner className="mr-2 size-4 animate-spin" aria-hidden="true" />
            )} Cancel</Button>
          </DrawerClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
           onClick={() => handledeDelete(id!)}
            disabled={processing}
          >
            {processing && (
              <Spinner className="mr-2 size-4 animate-spin" aria-hidden="true" />
            )}
            Delete
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
    );
  }

  return (
    <Dialog {...props} modal={true}  open={isOpen} onOpenChange={setIsOpen}>
     {trigger && ( 
          <DialogTrigger asChild>
           <Trash/>
          </DialogTrigger>
         )}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
                  This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">deleted</span>
 from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
                <Button variant="outline"  disabled={processing}>   {processing && (
              <Spinner className="mr-2 size-4 animate-spin" aria-hidden="true" />
            )} Cancel</Button>
            </DialogClose>
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
             onClick={() => handledeDelete(id!)}
              disabled={processing}
            >
              {processing && (
                <Spinner
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  
  );
}