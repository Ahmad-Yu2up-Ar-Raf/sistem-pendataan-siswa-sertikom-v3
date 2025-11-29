// resources/js/components/tahun-ajar/KelasTableRow.tsx
import { TableCell, TableRow } from "@/components/ui/fragments/shadcn-ui/table";
import { Checkbox } from "@/components/ui/fragments/shadcn-ui/checkbox";
import { Badge } from "@/components/ui/fragments/shadcn-ui/badge";
import {
  Calendar,
  CalendarCheck,
  CalendarClock,
  DoorOpen,
  PencilRuler,
  User2,
  UserPlus2,
  UserPlus2Icon,
  Users2Icon,
  UsersRoundIcon,
} from "lucide-react";
import { RowActions } from "../../../../../../fragments/custom-ui/table/RowActions";
import type { KelasSchema } from "@/lib/validations/kelasValidate";
import { Status } from "@/config/enums/status";
import { getStatusIcon } from "@/lib/utils/index";
import { cn } from "@/lib/utils";

interface KelasTableRowProps {
  item: KelasSchema;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function KelasTableRow({
  item,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: KelasTableRowProps) {
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
        <h4 className="font-medium">{item.nama_kelas}</h4>
      </TableCell>
  
    
     
      <TableCell>
        <Badge icon={Calendar} variant="outline" className="py-1 [&>svg]:size-3.5">
          {item.tahun_ajar?.nama_tahun_ajar || "N/A"}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge icon={User2} variant="outline" className="py-1 [&>svg]:size-3.5">
          {item.wali_kelas || "N/A"}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge icon={Users2Icon} variant="outline" className="py-1 [&>svg]:size-3.5">
          {item.siswa_count}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge icon={PencilRuler} variant="outline" className="py-1 [&>svg]:size-3.5">
          {item.jurusan?.nama_jurusan || "N/A"}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge icon={IconStatus} variant="outline" className="py-1 [&>svg]:size-3.5">
          {item.status}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge icon={DoorOpen} variant="outline" className="py-1 [&>svg]:size-3.5">
          {item.ruangan || "N/A"}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge icon={UsersRoundIcon} variant="outline" className="py-1 [&>svg]:size-3.5">
          {item.kapasitas_maksimal || "N/A"}
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