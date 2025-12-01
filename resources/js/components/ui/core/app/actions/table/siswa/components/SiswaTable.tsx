// resources/js/components/tahun-ajar/SiswaTable.tsx
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
import { SiswaTableRow } from "./SiswaTableRow";
import type { SiswaSchema } from "@/lib/validations/app/siswaValidate";


interface SiswaTableProps {
  data: SiswaSchema[];
  selectedIds: number[];
  onSelectAll: () => void;
  onSelectRow: (id: number) => void;
  onEdit: (item: SiswaSchema) => void;
  onDelete: (id: number) => void;
  isAllSelected: boolean;
}

export function SiswaTable({
  data,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onEdit,
  onDelete,
  isAllSelected,
}: SiswaTableProps) {
  

  return (
    <main className="overflow-hidden rounded-xl border">
      <Table>
        <TableCaption className="sr-only">
          A list of your recent siswas.
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
            <TableHead>NISN</TableHead>
            <TableHead>Jurusan</TableHead>
            <TableHead>Tahun Ajar</TableHead>
            <TableHead>Kelas</TableHead>
            <TableHead>Tingkat</TableHead>
            {/* <TableHead>Warga Negara</TableHead> */}
            <TableHead>Asal</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Agama</TableHead>
            <TableHead>Kelamin</TableHead>
            <TableHead>Tanggal Lahir</TableHead>
            <TableHead>Dibuat Pada</TableHead>
            <TableHead 
            typeColumn="sticky"
      >
              
              <span       className=" sr-only">
                Action
                </span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className=" relative">
              {data.length > 0 ? data.map((item) => (
            <SiswaTableRow
              key={item.id}
              item={item}
              isSelected={selectedIds.includes(item.id!)}
              onSelect={() => onSelectRow(item.id!)}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item.id!)}
            />
           )) : (
             <TableRow>
              <TableCell colSpan={13} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </main>
  );
}