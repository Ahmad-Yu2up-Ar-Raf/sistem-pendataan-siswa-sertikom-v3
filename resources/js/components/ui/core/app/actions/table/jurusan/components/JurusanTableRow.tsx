// resources/js/components/tahun-ajar/JurusanTableRow.tsx
import { TableCell, TableRow } from "@/components/ui/fragments/shadcn-ui/table";
import { Checkbox } from "@/components/ui/fragments/shadcn-ui/checkbox";
import { Badge } from "@/components/ui/fragments/shadcn-ui/badge";
import {
  CalendarCheck,
  CalendarClock,
  DoorOpen,
  Users2Icon,
} from "lucide-react";
import { RowActions } from "@/components/ui/fragments/custom-ui/table/RowActions";
import type { JurusanSchema } from "@/lib/validations/app/jurusanValidate";
import { Status } from "@/config/enums/status";
import { getStatusIcon } from "@/lib/utils/index";
import { cn } from "@/lib/utils";

interface JurusanTableRowProps {
  item: JurusanSchema;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function JurusanTableRow({
  item,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: JurusanTableRowProps) {
  const status = item.status as Status;
  const IconStatus = getStatusIcon(status);

  return (
    <TableRow className={cn(isSelected && "bg-muted")}>
      <TableCell
      typeColumn="checkbox"
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          aria-label="Select row"
          className="mx-3 mr-4 translate-y-0.5"
        />
      </TableCell>
      <TableCell>
        <h4 className="font-medium">{item.nama_jurusan}</h4>
      </TableCell>
      <TableCell>
        <span>{item.kode_jurusan}</span>
      </TableCell>
 
      <TableCell>
        <Badge icon={Users2Icon} variant="outline" className="py-1 [&>svg]:size-3.5">
          {item.siswas_count}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge icon={DoorOpen} variant="outline" className="py-1 [&>svg]:size-3.5">
          {item.kelases_count}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge icon={IconStatus} variant="outline" className="py-1 [&>svg]:size-3.5">
          {item.status}
        </Badge>
      </TableCell>
      <TableCell>
        {item.created_at
          ? new Date(item.created_at).toLocaleDateString()
          : "N/A"}
      </TableCell>
      <TableCell
            typeColumn="sticky"
      >
        <RowActions onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
}