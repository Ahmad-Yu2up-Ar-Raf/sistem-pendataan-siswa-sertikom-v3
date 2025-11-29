// resources/js/components/tahun-ajar/TahunAjarTableRow.tsx
import { TableCell, TableRow } from "@/components/ui/fragments/shadcn-ui/table";
import { Checkbox } from "@/components/ui/fragments/shadcn-ui/checkbox";
import { Badge } from "@/components/ui/fragments/shadcn-ui/badge";
import {
  CalendarCheck,
  CalendarClock,
  DoorOpen,
  Users2Icon,
} from "lucide-react";
import { RowActions } from "../../../../../../fragments/custom-ui/table/RowActions";
import type { TahunAjarSchema } from "@/lib/validations/tahunAjarValidate";
import { Status } from "@/config/enums/status";
import { getStatusIcon } from "@/lib/utils/index";
import { cn } from "@/lib/utils";

interface TahunAjarTableRowProps {
  item: TahunAjarSchema;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TahunAjarTableRow({
  item,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: TahunAjarTableRowProps) {
  const status = item.status as Status;
  const IconStatus = getStatusIcon(status);

  return (
    <TableRow className={cn(isSelected && "bg-muted")}>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          aria-label="Select row"
          className="mx-3 mr-4 translate-y-0.5"
        />
      </TableCell>
      <TableCell>
        <h4 className="font-medium">{item.nama_tahun_ajar}</h4>
      </TableCell>
      <TableCell>
        <span>{item.kode_tahun_ajar}</span>
      </TableCell>
      <TableCell>
        <Badge icon={CalendarClock} variant="outline" className="py-1 [&>svg]:size-3.5">
          {item.tanggal_mulai
            ? new Date(item.tanggal_mulai).toLocaleDateString()
            : "N/A"}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge icon={CalendarCheck} variant="outline" className="py-1 [&>svg]:size-3.5">
          {item.tanggal_selesai
            ? new Date(item.tanggal_selesai).toLocaleDateString()
            : "N/A"}
        </Badge>
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
      <TableCell>
        <RowActions onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
}