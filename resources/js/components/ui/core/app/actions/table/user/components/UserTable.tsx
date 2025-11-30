// resources/js/components/tahun-ajar/UserTable.tsx
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
import { UserTableRow } from "./UserTableRow";
import type { UserSchema } from "@/lib/validations/auth/auth";


interface UserTableProps {
  data: UserSchema[];
  selectedIds: number[];
  onSelectAll: () => void;
  onSelectRow: (id: number) => void;
  onEdit: (item: UserSchema) => void;
  onDelete: (id: number) => void;
  isAllSelected: boolean;
}

export function UserTable({
  data,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onEdit,
  onDelete,
  isAllSelected,
}: UserTableProps) {
  

  return (
    <main className="overflow-hidden rounded-xl border">
      <Table>
        <TableCaption className="sr-only">
          A list of your recent user.
        </TableCaption>
        <TableHeader className="bg-muted/20">
          <TableRow>
            <TableHead
            typeColumn="checkbox">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={onSelectAll}
                aria-label="Select all"
                className="mx-3 mr-4 translate-y-0.5"
              />
            </TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>

            <TableHead>Perbaruan Terakhir</TableHead>
 
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
            <UserTableRow
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