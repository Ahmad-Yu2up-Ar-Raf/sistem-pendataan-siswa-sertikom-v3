// resources/js/components/tahun-ajar/KelasTable.tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/fragments/shadcn-ui/table";
import { Checkbox } from "@/components/ui/fragments/shadcn-ui/checkbox";
import { KelasTableRow } from "./KelasTableRow";
import type { KelasSchema } from "@/lib/validations/app/kelasValidate";


interface KelasTableProps {
  data: KelasSchema[];
  selectedIds: number[];
  onSelectAll: () => void;
  onSelectRow: (id: number) => void;
  onEdit: (item: KelasSchema) => void;
  onDelete: (id: number) => void;
  isAllSelected: boolean;
}

export function KelasTable({
  data,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onEdit,
  onDelete,
  isAllSelected,
}: KelasTableProps) {
 
  return (
    <main className="overflow-hidden rounded-xl border">
      <Table>
        <TableCaption className="sr-only">
          A list of your recent kelass.
        </TableCaption>
        <TableHeader className="bg-muted/20">
          <TableRow>
            <TableHead
            typeColumn="checkbox"
            >
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={onSelectAll}
                aria-label="Select all"
                className="mx-3 mr-4 translate-y-0.5"
              />
            </TableHead>
            <TableHead>Nama</TableHead>
            <TableHead >Tahun Ajar</TableHead>

            <TableHead>Wali Kelas</TableHead>
            <TableHead>Tingkat</TableHead>
            <TableHead>Total SIswa</TableHead>
            <TableHead>Jurusan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ruangan</TableHead>
            <TableHead>Kapasitas</TableHead>
            <TableHead>Dibuat Pada</TableHead>
            <TableHead
                  typeColumn="sticky"
            >
              <span className="sr-only">
                Action
                </span>
                </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
           {data.length > 0 ? data.map((item) => (
            <KelasTableRow
              key={item.id}
              item={item}
              isSelected={selectedIds.includes(item.id!)}
              onSelect={() => onSelectRow(item.id!)}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item.id!)}
            />
       )) : (
             <TableRow>
              <TableCell colSpan={12} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </main>
  );
}