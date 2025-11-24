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
  Pindah = "pindah",
  Keluar = "keluar",
  Dropout = "dropout",
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
    value: StatusSiswa.Pindah,
    label: "Pindah",
    icon: ArrowRightLeft,
    subLabel: "Pindah Sekolah",
    description: "Siswa pindah ke sekolah lain",
  },
  {
    value: StatusSiswa.Keluar,
    label: "Keluar",
    icon: LogOut,
    subLabel: "Keluar Sekolah",
    description: "Siswa keluar dari sekolah",
  },
  {
    value: StatusSiswa.Dropout,
    label: "Dropout",
    icon: UserMinus,
    subLabel: "Putus Sekolah",
    description: "Siswa mengalami putus sekolah",
  },
];

export const StatusSiswaValues: string[] = StatusSiswaOptions.map(
  (item) => item.value
);

 