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
import type { TahunAjarSchema } from "@/lib/validations/tahunAjarValidate";


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
          A list of your recent tahun ajars.
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
            <TableHead>Kode</TableHead>
            <TableHead>Tanggal Mulai</TableHead>
            <TableHead>Tanggal Selesai</TableHead>
            <TableHead>Total Siswa</TableHead>
            <TableHead>Total Kelas</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Dibuat Pada</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TahunAjarTableRow
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