// resources/js/components/tahun-ajar/UserTableRow.tsx
import { TableCell, TableRow } from "@/components/ui/fragments/shadcn-ui/table";
import { Checkbox } from "@/components/ui/fragments/shadcn-ui/checkbox";
import { Badge } from "@/components/ui/fragments/shadcn-ui/badge";
import {
  CalendarCheck,
  CalendarClock,
  DoorOpen,
  LetterTextIcon,
  Mail,
  MessageCircle,
  Users2Icon,
  UserXIcon,
} from "lucide-react";
import { RowActions } from "@/components/ui/fragments/custom-ui/table/RowActions";
import type { UserSchema } from "@/lib/validations/auth/auth";
 
import { getRoleIcon, getStatusIcon } from "@/lib/utils/index";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/fragments/shadcn-ui/avatar";
import { useInitials } from "@/hooks/use-initials";
import { batasiKata } from "@/hooks/useWord";
import { Role } from "@/config/enums/Roles";

interface UserTableRowProps {
  item: UserSchema;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function UserTableRow({
  item,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: UserTableRowProps) {
   const batasiHurufNama = batasiKata(item.name, 2)
 const getInitial = useInitials()
   const role = item.primary_role as Role;
    console.log("Role:", item.primary_role);
 
   const IconRole = getRoleIcon(role);
  
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
      <TableCell 
       style={{
        width: "220px"
       }}
       className="  flex items-center gap-3" 
              
   
              > 
              
                 <Avatar className=" rounded-xl  relative flex size-10 shrink-0 overflow-hidden">
                                          <AvatarImage src={`${item?.foto!}`} alt={item.name} />
                                          <AvatarFallback className="rounded-xl  bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                              {getInitial(item.name)}
                                          </AvatarFallback>
                                      </Avatar>
              <h4 className=" font-medium">
                {batasiHurufNama}
                </h4>
              </TableCell>
 
 
      <TableCell>
        <Badge icon={Mail} variant="outline" className="py-1 [&>svg]:size-3.5">
          {item.email}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge icon={item.primary_role == null ?  UserXIcon :  IconRole } variant="outline" className="py-1 [&>svg]:size-3.5">
          {item.primary_role == null ?  "N/A" : item.primary_role}
        </Badge>
      </TableCell>
      {/* <TableCell>
        <Badge icon={DoorOpen} variant="outline" className="py-1 [&>svg]:size-3.5">
          {item.kelases_count}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge icon={IconStatus} variant="outline" className="py-1 [&>svg]:size-3.5">
          {item.role}
        </Badge>
      </TableCell> */}
      <TableCell>
        {item.updated_at
          ? new Date(item.updated_at).toLocaleDateString()
          : "N/A"}
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