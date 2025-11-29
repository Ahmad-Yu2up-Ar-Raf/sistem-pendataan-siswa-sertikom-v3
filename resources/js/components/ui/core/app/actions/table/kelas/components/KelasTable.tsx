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
import type { KelasSchema } from "@/lib/validations/kelasValidate";


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
  if (data.length === 0) {
    return (
      <main className="overflow-hidden rounded-xl border">
        <Table>
          <TableCaption className="sr-only">No data available.</TableCaption>
          <TableHeader className="bg-muted/20">
            <TableRow>
              <TableHead className="sr-only">Select</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </main>
    );
  }

  return (
    <main className="overflow-hidden rounded-xl border">
      <Table>
        <TableCaption className="sr-only">
          A list of your recent kelass.
        </TableCaption>
        <TableHeader className="bg-muted/20">
          <TableRow>
            <TableHead>
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={onSelectAll}
                aria-label="Select all"
                className="mx-3 mr-4 translate-y-0.5"
              />
            </TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Tahun Ajar</TableHead>

            <TableHead>Wali Kelas</TableHead>
            <TableHead>Total SIswa</TableHead>
            <TableHead>Jurusan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ruangan</TableHead>
            <TableHead>Kapasitas</TableHead>
            <TableHead>Dibuat Pada</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <KelasTableRow
              key={item.id}
              item={item}
              isSelected={selectedIds.includes(item.id!)}
              onSelect={() => onSelectRow(item.id!)}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item.id!)}
            />
          ))}
        </TableBody>
      </Table>
    </main>
  );
}