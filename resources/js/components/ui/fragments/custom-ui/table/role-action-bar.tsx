"use client";
import { SelectTrigger } from "@radix-ui/react-select";
import { Book, CheckCircle2,  Church,  Key,  Trash2Icon, VenusAndMars } from "lucide-react";
import * as React from "react";
import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from "@/components/ui/fragments/custom-ui/table/data-table-action-bar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/fragments/shadcn-ui/select";
import { Separator } from "@/components/ui/fragments/shadcn-ui/separator";
  
 
import { RoleOptions } from "@/config/enums/Roles";


interface RolesTableActionBarProps {
table: number[];
    setSelected: (value: React.SetStateAction<number[]>) => void
  // getIsActionPending: (action: Action) => boolean

  onTaskDelete: () => void;
isPending: boolean
  //  isPendingExport: boolean
   onTaskUpdate: ({ field, value, }: {
    field: "roles"  ;
    value: string;
   
}) => void
}

export function RolesTableActionBar({ setSelected, onTaskUpdate, table, isPending, onTaskDelete, }: RolesTableActionBarProps) {




   
  return (
    <DataTableActionBar setSelected={setSelected} table={table} visible={table.length > 0}>
      <DataTableActionBarSelection table={table} setSelected={setSelected} />
      <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-5 sm:block"
      />
      <div className="flex items-center gap-1.5 text-accent-foreground">
        <Select
          onValueChange={(value: string) =>
            onTaskUpdate({ field: "roles", value })
          }
        >
          <SelectTrigger asChild>
            <DataTableActionBarAction
              size="icon"
              tooltip="Update roles"
              isPending={isPending}
            >
              <Key className=" " />
            </DataTableActionBarAction>
          </SelectTrigger>
          <SelectContent align="center">
            <SelectGroup>
              {RoleOptions.map((roles) => (
                <SelectItem key={roles.label} value={roles.value} className="capitalize">
                  {roles.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
     
      
        <DataTableActionBarAction
          size="icon"
          tooltip="Delete tasks"
          isPending={isPending}
          onClick={onTaskDelete}
        >
          <Trash2Icon />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  );
}