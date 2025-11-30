// types.ts (OptionItem already exists)
import { OptionItem } from "@/types";
import {
  Crown,
  ShieldCheck,
  UserPlus,
  BookOpen,
  User,
  Users
} from "lucide-react";

export enum Role {
  SuperAdmin = "super_admin",
  Admin = "admin",
  KepalaKurikulum = "kepala_kurikulum",
  Guru = "guru",
  Operator = "operator",
  Siswa = "siswa",
}

export const RoleOptions: OptionItem[] = [
  {
    value: Role.SuperAdmin,
    label: "Super Admin",
    icon: Crown,
    subLabel: "Full Access",
    description: "Akses penuh untuk semua modul dan pengaturan sistem.",
  },
  {
    value: Role.Admin,
    label: "Admin",
    icon: ShieldCheck,
    subLabel: "Manage Master Data",
    description: "Mengelola Tahun Ajar, Jurusan, Kelas, Siswa, dan User management.",
  },
  {
    value: Role.KepalaKurikulum,
    label: "Kepala Kurikulum",
    icon: Users,
    subLabel: "Approve / Review",
    description: "Melihat ringkasan akademik dan menyetujui perpindahan/naik kelas.",
  },
  {
    value: Role.Guru,
    label: "Guru",
    icon: BookOpen,
    subLabel: "Class Access",
    description: "Melihat siswa di kelas yang diampu, menambahkan catatan akademik/kehadiran.",
  },
  {
    value: Role.Operator,
    label: "Operator",
    icon: UserPlus,
    subLabel: "Admin Support",
    description: "Import/Export data, upload foto, tugas administratif.",
  },
  {
    value: Role.Siswa,
    label: "Siswa",
    icon: User,
    subLabel: "Student",
    description: "Melihat profil sendiri dan riwayat kelas.",
  },
];
export const RoleValues: string[] = RoleOptions.map(
  (item) => item.value
);

