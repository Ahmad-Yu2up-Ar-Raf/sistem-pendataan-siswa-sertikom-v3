import { OptionItem } from "@/types";
import {
 
  UserCheck,
  GraduationCap,
 
  UserMinus,
 
  ArrowRightLeft,
   
  LogOut,
 
} from "lucide-react";

 
 
 

// ==========================================
// STATUS SISWA ENUM
// ==========================================

export enum StatusSiswa {
  Aktif = "aktif",
  Lulus = "lulus", 
  Keluar = "keluar",
 
}

export const StatusSiswaOptions: OptionItem[] = [
  {
    value: StatusSiswa.Aktif,
    label: "Aktif",
    icon: UserCheck,
    subLabel: "Siswa Aktif",
    description: "Siswa masih aktif bersekolah",
  },
  {
    value: StatusSiswa.Lulus,
    label: "Lulus",
    icon: GraduationCap,
    subLabel: "Telah Lulus",
    description: "Siswa telah lulus dari sekolah",
  },
  
  {
    value: StatusSiswa.Keluar,
    label: "Keluar",
    icon: LogOut,
    subLabel: "Keluar Sekolah",
    description: "Siswa keluar dari sekolah",
  },
  
];

export const StatusSiswaValues: string[] = StatusSiswaOptions.map(
  (item) => item.value
);

 