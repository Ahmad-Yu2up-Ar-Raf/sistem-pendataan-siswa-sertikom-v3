import { OptionItem } from "@/types";
import {
  User,
  UserCheck,
  GraduationCap,
  UserX,
  UserMinus,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  ArrowRightLeft,
  Repeat,
  Trophy,
  LogOut,
  BookOpen,
  CalendarDays,
  Shield,
  Home,
  Users,
  Mars,
  Venus,
  Scroll,
  Flower,
  Flame,
  Zap,
  BarChart3,
  Calendar,
  RefreshCw,
  Move,
  LogIn,
  Crown,
  Key,
} from "lucide-react";

// ==========================================
// STATUS ENUM (Global Status)
// ==========================================

export enum Status {
  Aktif = "aktif",
  NonAktif = "nonaktif",
}

export const StatusOptions: OptionItem[] = [
  {
    value: Status.Aktif,
    label: "Aktif",
    icon: CheckCircle,
    subLabel: "Status Aktif",
    description: "Data sedang aktif dan dapat digunakan",
  },
  {
    value: Status.NonAktif,
    label: "Non-Aktif",
    icon: XCircle,
    subLabel: "Status Non-Aktif",
    description: "Data tidak aktif dan tidak dapat digunakan",
  },
];

export const StatusValues: string[] = StatusOptions.map((item) => item.value);

 

 
 
 

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

 