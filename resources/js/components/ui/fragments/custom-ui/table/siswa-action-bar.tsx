"use client";
import { SelectTrigger } from "@radix-ui/react-select";
import { Book, CheckCircle2,  Church,  Trash2Icon, VenusAndMars } from "lucide-react";
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
import { StatusOptions } from "@/config/enums/status";
import { StatusSiswaOptions } from "@/config/enums/StatusSiswa";
import { AgamaOptions } from "@/config/enums/agama";
import { JenisKelaminOptions } from "@/config/enums/jenis-kelamin";


interface StatusTableActionBarProps {
table: number[];
    setSelected: (value: React.SetStateAction<number[]>) => void
  // getIsActionPending: (action: Action) => boolean

  onTaskDelete: () => void;
isPending: boolean
  //  isPendingExport: boolean
   onTaskUpdate: ({ field, value, }: {
    field: "status"  | "agama" | "jenis_kelamin";
    value: string;
   
}) => void
}

export function StatusTableActionBar({ setSelected, onTaskUpdate, table, isPending, onTaskDelete, }: StatusTableActionBarProps) {




   
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
            onTaskUpdate({ field: "status", value })
          }
        >
          <SelectTrigger asChild>
            <DataTableActionBarAction
              size="icon"
              tooltip="Update status"
              isPending={isPending}
            >
              <CheckCircle2 className=" " />
            </DataTableActionBarAction>
          </SelectTrigger>
          <SelectContent align="center">
            <SelectGroup>
              {StatusSiswaOptions.map((status) => (
                <SelectItem key={status.label} value={status.value} className="capitalize">
                  {status.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value: string) =>
            onTaskUpdate({ field: "agama", value })
          }
        >
          <SelectTrigger asChild>
            <DataTableActionBarAction
              size="icon"
              tooltip="Update category"
              isPending={isPending}
            >
              <Church className=" " />
            </DataTableActionBarAction>
          </SelectTrigger>
          <SelectContent align="center">
            <SelectGroup>
              {AgamaOptions.map((status) => (
                <SelectItem key={status.label} value={status.value} className="capitalize">
                  {status.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value: string) =>
            onTaskUpdate({ field: "jenis_kelamin", value })
          }
        >
          <SelectTrigger asChild>
            <DataTableActionBarAction
              size="icon"
              tooltip="Update category"
              isPending={isPending}
            >
              <VenusAndMars className=" " />
            </DataTableActionBarAction>
          </SelectTrigger>
          <SelectContent align="center">
            <SelectGroup>
              {JenisKelaminOptions.map((status) => (
                <SelectItem key={status.label} value={status.value} className="capitalize">
                  {status.label}
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