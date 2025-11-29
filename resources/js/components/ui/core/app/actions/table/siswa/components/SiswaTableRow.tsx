// resources/js/components/tahun-ajar/SiswaTableRow.tsx
import { TableCell, TableRow } from "@/components/ui/fragments/shadcn-ui/table";
import { Checkbox } from "@/components/ui/fragments/shadcn-ui/checkbox";
import { Badge } from "@/components/ui/fragments/shadcn-ui/badge";
import {
  CalendarCheck,
  CalendarClock,
  DoorOpen,
  Globe,
  Map,
  PencilRuler,
  TrendingUp,
  Users2Icon,
} from "lucide-react";
import { RowActions } from "../../../../../../fragments/custom-ui/table/RowActions";
import type { SiswaSchema } from "@/lib/validations/siswaValidate";
import { Status } from "@/config/enums/status";
import { getAgamaIcon, getJenisKelaminIcon, getStatusIcon, getStatusSiswaIcon } from "@/lib/utils/index";
import { cn } from "@/lib/utils";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/fragments/shadcn-ui/avatar";
import { useInitials } from "@/hooks/use-initials";
import { Agama } from "@/config/enums/agama";
import { JenisKelamin } from "@/config/enums/jenis-kelamin";
import { StatusSiswa } from "@/config/enums/StatusSiswa";
interface SiswaTableRowProps {
  item: SiswaSchema;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function SiswaTableRow({
  item,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: SiswaTableRowProps) {
  const status = item.status as StatusSiswa;
  const agama = item.agama as Agama;
  const jenis_kelamin = item.jenis_kelamin as JenisKelamin;
  const IconStatus = getStatusSiswaIcon(status);
  const IconAgama = getAgamaIcon(agama);
  const IconGender = getJenisKelaminIcon(jenis_kelamin);
  const getInitial = useInitials()
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
       <TableCell className="  flex items-center gap-5" 
              
   
              > 
              
                 <Avatar className=" rounded-xl  relative flex size-10 shrink-0 overflow-hidden">
                                          <AvatarImage src={`${item?.foto!}`} alt={item.nama_lengkap} />
                                          <AvatarFallback className="rounded-xl  bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                              {getInitial(item.nama_lengkap)}
                                          </AvatarFallback>
                                      </Avatar>
              <h4 className=" font-medium">
                {item.nama_lengkap}
                </h4>
              </TableCell>
   
      <TableCell>
        <span>{item.nisn}</span>
      </TableCell>
   
      <TableCell>
        <Badge icon={PencilRuler} variant="outline" className="py-1 [&>svg]:size-3.5">
          {item.jurusan?.nama_jurusan}
        </Badge>
      </TableCell>
   
      <TableCell>
        <Badge icon={CalendarCheck} variant="outline" className="py-1 [&>svg]:size-3.5">
          {item.tahun_masuk?.nama_tahun_ajar}
        </Badge>
      </TableCell>
     
      <TableCell>
        <Badge icon={DoorOpen} variant="outline" className="py-1 [&>svg]:size-3.5">
          {item.kelas?.nama_kelas}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge icon={Globe} variant="outline" className="py-1 [&>svg]:size-3.5">
          {item.asal_negara}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge icon={Map} variant="outline" className="py-1 [&>svg]:size-3.5">
          {item.tempat_lahir}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge icon={IconStatus} variant="outline" className="py-1 [&>svg]:size-3.5">
          {item.status}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge icon={IconAgama} variant="outline" className="py-1 [&>svg]:size-3.5">
          {item.agama}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge icon={IconGender} variant="outline" className="py-1 [&>svg]:size-3.5">
          {item.jenis_kelamin}
        </Badge>
      </TableCell>
      <TableCell>
        {item.tanggal_lahir
          ? new Date(item.tanggal_lahir).toLocaleDateString()
          : "N/A"}
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