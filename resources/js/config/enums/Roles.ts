import { OptionItem } from "@/types";
import {
  
  Crown,
  Key,
} from "lucide-react";

 
export enum Role {
  SuperAdmin = "super_admin",
  Admin = "admin",
}

export const RoleOptions: OptionItem[] = [
  {
    value: Role.SuperAdmin,
    label: "Super Admin",
    icon: Crown,
    subLabel: "Full Access",
    description: "Memiliki akses penuh ke semua fitur sistem",
  },
  {
    value: Role.Admin,
    label: "Admin",
    icon: Key,
    subLabel: "Limited Access",
    description: "Akses terbatas untuk mengelola data",
  },
];