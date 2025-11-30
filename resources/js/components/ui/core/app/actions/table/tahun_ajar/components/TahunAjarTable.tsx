// resources/js/components/tahun-ajar/TahunAjarTable.tsx
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
import { TahunAjarTableRow } from "./TahunAjarTableRow";
import type { TahunAjarSchema } from "@/lib/validations/app/tahunAjarValidate";


interface TahunAjarTableProps {
  data: TahunAjarSchema[];
  selectedIds: number[];
  onSelectAll: () => void;
  onSelectRow: (id: number) => void;
  onEdit: (item: TahunAjarSchema) => void;
  onDelete: (id: number) => void;
  isAllSelected: boolean;
}

export function TahunAjarTable({
  data,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onEdit,
  onDelete,
  isAllSelected,
}: TahunAjarTableProps) {

  return (
    <main className="overflow-hidden rounded-xl border">
      <Table>
        <TableCaption className="sr-only">
          A list of your recent tahun ajars.
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
            <TableHead>Kode</TableHead>
            <TableHead>Tanggal Mulai</TableHead>
            <TableHead>Tanggal Selesai</TableHead>
            <TableHead>Total Siswa</TableHead>
            <TableHead>Total Kelas</TableHead>
            <TableHead>Status</TableHead>
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
            <TahunAjarTableRow
              key={item.id}
              item={item}
              isSelected={selectedIds.includes(item.id!)}
              onSelect={() => onSelectRow(item.id!)}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item.id!)}
            />
          )) : (
             <TableRow>
              <TableCell colSpan={10} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </main>
  );
}