import { OptionItem } from "@/types";
import {
 
  GraduationCap,
 
  CheckCircle,
 
  TrendingUp,
 
  LogOut,
 
  RefreshCw,
  Move,
 
} from "lucide-react";

 
export enum StatusKelas {
  Aktif = "aktif",
  NaikKelas = "naik_kelas",
  TinggalKelas = "tinggal_kelas",
  PindahKelas = "pindah_kelas",
  Lulus = "lulus",
  Keluar = "keluar",
}

export const StatusKelasOptions: OptionItem[] = [
  {
    value: StatusKelas.Aktif,
    label: "Aktif",
    icon: CheckCircle,
    subLabel: "Status Aktif",
    description: "Siswa aktif di kelas ini",
  },
  {
    value: StatusKelas.NaikKelas,
    label: "Naik Kelas",
    icon: TrendingUp,
    subLabel: "Naik Tingkat",
    description: "Siswa naik ke kelas berikutnya",
  },
  {
    value: StatusKelas.TinggalKelas,
    label: "Tinggal Kelas",
    icon: RefreshCw,
    subLabel: "Mengulang",
    description: "Siswa tinggal kelas dan mengulang",
  },
  {
    value: StatusKelas.PindahKelas,
    label: "Pindah Kelas",
    icon: Move,
    subLabel: "Pindah Kelas",
    description: "Siswa pindah ke kelas lain",
  },
  {
    value: StatusKelas.Lulus,
    label: "Lulus",
    icon: GraduationCap,
    subLabel: "Telah Lulus",
    description: "Siswa telah lulus dari sekolah",
  },
  {
    value: StatusKelas.Keluar,
    label: "Keluar",
    icon: LogOut,
    subLabel: "Keluar Kelas",
    description: "Siswa keluar dari kelas ini",
  },
];

export const StatusKelasValues: string[] = StatusKelasOptions.map(
  (item) => item.value
);

 