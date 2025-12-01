import { Agama, AgamaOptions } from "@/config/enums/agama";
import { JenisKelamin, JenisKelaminOptions } from "@/config/enums/jenis-kelamin";
import { Role, RoleOptions } from "@/config/enums/Roles";
import { Semester, SemesterOptions } from "@/config/enums/Semester";
import {
    Status,
    StatusOptions,

    StatusSiswa,
    StatusSiswaOptions,

  } from "@/config/enums/status";
import { StatusKelas, StatusKelasOptions } from "@/config/enums/StatusKelas";
import { Tingkat, TingkatOptions } from "@/config/enums/tingkat";
  import { CircleIcon, LucideIcon } from "lucide-react";

  // ==========================================
  // STATUS UTILS
  // ==========================================

  export function getStatusIcon(status?: Status): LucideIcon {
    const found = StatusOptions.find((s) => s.value === status);
    return found?.icon || CircleIcon;
  }

  export function getStatusColor(status: Status): string {
    const statusColors: Record<Status, string> = {
      [Status.Aktif]: "text-green-500",
      [Status.NonAktif]: "text-red-500",
    };
    return statusColors[status] || "text-gray-400";
  }

  export function getStatusBadgeColor(status: Status): string {
    const statusBadgeColors: Record<Status, string> = {
      [Status.Aktif]: "bg-green-100 text-green-800 border-green-200",
      [Status.NonAktif]: "bg-red-100 text-red-800 border-red-200",
    };
    return statusBadgeColors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  }

  export function getStatusLabel(status: Status): string {
    const statusLabels: Record<Status, string> = {
      [Status.Aktif]: "Aktif",
      [Status.NonAktif]: "Non-Aktif",
    };
    return statusLabels[status] || "Unknown";
  }

  // ==========================================
  // JENIS KELAMIN UTILS
  // ==========================================

  export function getJenisKelaminIcon(jenisKelamin?: JenisKelamin): LucideIcon {
    const found = JenisKelaminOptions.find((jk) => jk.value === jenisKelamin);
    return found?.icon || CircleIcon;
  }

  export function getJenisKelaminColor(jenisKelamin: JenisKelamin): string {
    const jenisKelaminColors: Record<JenisKelamin, string> = {
      [JenisKelamin.LakiLaki]: "text-blue-500",
      [JenisKelamin.Perempuan]: "text-pink-500",
    };
    return jenisKelaminColors[jenisKelamin] || "text-gray-400";
  }

  export function getJenisKelaminBadgeColor(jenisKelamin: JenisKelamin): string {
    const jenisKelaminBadgeColors: Record<JenisKelamin, string> = {
      [JenisKelamin.LakiLaki]: "bg-blue-100 text-blue-800 border-blue-200",
      [JenisKelamin.Perempuan]: "bg-pink-100 text-pink-800 border-pink-200",
    };
    return jenisKelaminBadgeColors[jenisKelamin] || "bg-gray-100 text-gray-800 border-gray-200";
  }

  export function getJenisKelaminLabel(jenisKelamin: JenisKelamin): string {
    const jenisKelaminLabels: Record<JenisKelamin, string> = {
      [JenisKelamin.LakiLaki]: "Laki-Laki",
      [JenisKelamin.Perempuan]: "Perempuan",
    };
    return jenisKelaminLabels[jenisKelamin] || "Unknown";
  }

  // ==========================================
  // AGAMA UTILS
  // ==========================================

  export function getAgamaIcon(agama?: Agama): LucideIcon {
    const found = AgamaOptions.find((a) => a.value === agama);
    return found?.icon || CircleIcon;
  }

  export function getAgamaColor(agama: Agama): string {
    const agamaColors: Record<Agama, string> = {
      [Agama.Islam]: "text-green-600",
      [Agama.Kristen]: "text-blue-600",
      [Agama.Katolik]: "text-purple-600",
      [Agama.Hindu]: "text-orange-600",
      [Agama.Buddha]: "text-yellow-600",
      [Agama.Konghucu]: "text-red-600",
    };
    return agamaColors[agama] || "text-gray-400";
  }

  export function getAgamaBadgeColor(agama: Agama): string {
    const agamaBadgeColors: Record<Agama, string> = {
      [Agama.Islam]: "bg-green-100 text-green-800 border-green-200",
      [Agama.Kristen]: "bg-blue-100 text-blue-800 border-blue-200",
      [Agama.Katolik]: "bg-purple-100 text-purple-800 border-purple-200",
      [Agama.Hindu]: "bg-orange-100 text-orange-800 border-orange-200",
      [Agama.Buddha]: "bg-yellow-100 text-yellow-800 border-yellow-200",
      [Agama.Konghucu]: "bg-red-100 text-red-800 border-red-200",
    };
    return agamaBadgeColors[agama] || "bg-gray-100 text-gray-800 border-gray-200";
  }

  export function getAgamaLabel(agama: Agama): string {
    const agamaLabels: Record<Agama, string> = {
      [Agama.Islam]: "Islam",
      [Agama.Kristen]: "Kristen",
      [Agama.Katolik]: "Katolik",
      [Agama.Hindu]: "Hindu",
      [Agama.Buddha]: "Buddha",
      [Agama.Konghucu]: "Konghucu",
    };
    return agamaLabels[agama] || "Unknown";
  }

  // ==========================================
  // TINGKAT UTILS
  // ==========================================

  export function getTingkatIcon(tingkat?: Tingkat): LucideIcon {
    const found = TingkatOptions.find((t) => t.value === tingkat);
    return found?.icon || CircleIcon;
  }

  export function getTingkatColor(tingkat: Tingkat): string {
    const tingkatColors: Record<Tingkat, string> = {
      [Tingkat.X]: "text-blue-500",
      [Tingkat.XI]: "text-indigo-500",
      [Tingkat.XII]: "text-purple-500",
    };
    return tingkatColors[tingkat] || "text-gray-400";
  }

  export function getTingkatBadgeColor(tingkat: Tingkat): string {
    const tingkatBadgeColors: Record<Tingkat, string> = {
      [Tingkat.X]: "bg-blue-100 text-blue-800 border-blue-200",
      [Tingkat.XI]: "bg-indigo-100 text-indigo-800 border-indigo-200",
      [Tingkat.XII]: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return tingkatBadgeColors[tingkat] || "bg-gray-100 text-gray-800 border-gray-200";
  }

  export function getTingkatLabel(tingkat: Tingkat): string {
    const tingkatLabels: Record<Tingkat, string> = {
      [Tingkat.X]: "Kelas X",
      [Tingkat.XI]: "Kelas XI",
      [Tingkat.XII]: "Kelas XII",
    };
    return tingkatLabels[tingkat] || "Unknown";
  }

  // ==========================================
  // SEMESTER UTILS
  // ==========================================

  export function getSemesterIcon(semester?: Semester): LucideIcon {
    const found = SemesterOptions.find((s) => s.value === semester);
    return found?.icon || CircleIcon;
  }

  export function getSemesterColor(semester: Semester): string {
    const semesterColors: Record<Semester, string> = {
      [Semester.Ganjil]: "text-blue-600",
      [Semester.Genap]: "text-green-600",
    };
    return semesterColors[semester] || "text-gray-400";
  }

  export function getSemesterBadgeColor(semester: Semester): string {
    const semesterBadgeColors: Record<Semester, string> = {
      [Semester.Ganjil]: "bg-blue-100 text-blue-800 border-blue-200",
      [Semester.Genap]: "bg-green-100 text-green-800 border-green-200",
    };
    return semesterBadgeColors[semester] || "bg-gray-100 text-gray-800 border-gray-200";
  }

  export function getSemesterLabel(semester: Semester): string {
    const semesterLabels: Record<Semester, string> = {
      [Semester.Ganjil]: "Semester Ganjil",
      [Semester.Genap]: "Semester Genap",
    };
    return semesterLabels[semester] || "Unknown";
  }

  // ==========================================
  // STATUS SISWA UTILS
  // ==========================================

  export function getStatusSiswaIcon(statusSiswa?: StatusSiswa): LucideIcon {
    const found = StatusSiswaOptions.find((ss) => ss.value === statusSiswa);
    return found?.icon || CircleIcon;
  }

  export function getStatusSiswaColor(statusSiswa: StatusSiswa): string {
    const statusSiswaColors: Record<StatusSiswa, string> = {
      [StatusSiswa.Aktif]: "text-green-500",
      [StatusSiswa.Lulus]: "text-blue-500",
     
      [StatusSiswa.Keluar]: "text-orange-500",
     
    };
    return statusSiswaColors[statusSiswa] || "text-gray-400";
  }

  export function getStatusSiswaBadgeColor(statusSiswa: StatusSiswa): string {
    const statusSiswaBadgeColors: Record<StatusSiswa, string> = {
      [StatusSiswa.Aktif]: "bg-green-100 text-green-800  ",
      [StatusSiswa.Lulus]: "bg-blue-100 text-blue-800  ",
  
      [StatusSiswa.Keluar]: "bg-orange-100 text-orange-800  ",
     
    };
    return statusSiswaBadgeColors[statusSiswa] || "bg-gray-100 text-gray-800 border-gray-200";
  }

  export function getStatusSiswaLabel(statusSiswa: StatusSiswa): string {
    const statusSiswaLabels: Record<StatusSiswa, string> = {
      [StatusSiswa.Aktif]: "Aktif",
      [StatusSiswa.Lulus]: "Lulus",
   
      [StatusSiswa.Keluar]: "Keluar",
 
    };
    return statusSiswaLabels[statusSiswa] || "Unknown";
  }

  // ==========================================
  // STATUS KELAS UTILS
  // ==========================================

  export function getStatusKelasIcon(statusKelas?: StatusKelas): LucideIcon {
    const found = StatusKelasOptions.find((sk) => sk.value === statusKelas);
    return found?.icon || CircleIcon;
  }

  export function getStatusKelasColor(statusKelas: StatusKelas): string {
    const statusKelasColors: Record<StatusKelas, string> = {
      [StatusKelas.Aktif]: "text-green-500",
      [StatusKelas.NaikKelas]: "text-blue-500",
      [StatusKelas.TinggalKelas]: "text-orange-500",
      
      [StatusKelas.Lulus]: "text-purple-500",
      [StatusKelas.Keluar]: "text-red-500",
    };
    return statusKelasColors[statusKelas] || "text-gray-400";
  }

  export function getStatusKelasBadgeColor(statusKelas: StatusKelas): string {
    const statusKelasBadgeColors: Record<StatusKelas, string> = {
      [StatusKelas.Aktif]: "bg-green-100 text-green-800 border-green-200",
      [StatusKelas.NaikKelas]: "bg-blue-100 text-blue-800 border-blue-200",
      [StatusKelas.TinggalKelas]: "bg-orange-100 text-orange-800 border-orange-200",
     
      [StatusKelas.Lulus]: "bg-purple-100 text-purple-800 border-purple-200",
      [StatusKelas.Keluar]: "bg-red-100 text-red-800 border-red-200",
    };
    return statusKelasBadgeColors[statusKelas] || "bg-gray-100 text-gray-800 border-gray-200";
  }

  export function getStatusKelasLabel(statusKelas: StatusKelas): string {
    const statusKelasLabels: Record<StatusKelas, string> = {
      [StatusKelas.Aktif]: "Aktif",
      [StatusKelas.NaikKelas]: "Naik Kelas",
      [StatusKelas.TinggalKelas]: "Tinggal Kelas",
     
      [StatusKelas.Lulus]: "Lulus",
      [StatusKelas.Keluar]: "Keluar",
    };
    return statusKelasLabels[statusKelas] || "Unknown";
  }

  // ==========================================
  // ROLE UTILS
  // ==========================================

  export function getRoleIcon(role?: Role): LucideIcon {
    const found = RoleOptions.find((r) => r.value === role);
    return found?.icon || CircleIcon;
  }

  export function getRoleColor(role: Role): string {
    const roleColors: Record<Role, string> = {
        [Role.SuperAdmin]: "text-purple-600",
        [Role.Admin]: "text-blue-600",
        [Role.KepalaKurikulum]: "",
        [Role.Guru]: "",
        [Role.Operator]: "",
        [Role.Siswa]: ""
    };
    return roleColors[role] || "text-gray-400";
  }

  export function getRoleBadgeColor(role: Role): string {
    const roleBadgeColors: Record<Role, string> = {
        [Role.SuperAdmin]: "bg-purple-100 text-purple-800 border-purple-200",
        [Role.Admin]: "bg-blue-100 text-blue-800 border-blue-200",
        [Role.KepalaKurikulum]: "",
        [Role.Guru]: "",
        [Role.Operator]: "",
        [Role.Siswa]: ""
    };
    return roleBadgeColors[role] || "bg-gray-100 text-gray-800 border-gray-200";
  }

  export function getRoleLabel(role: Role): string {
    const roleLabels: Record<Role, string> = {
        [Role.SuperAdmin]: "Super Admin",
        [Role.Admin]: "Admin",
        [Role.KepalaKurikulum]: "",
        [Role.Guru]: "",
        [Role.Operator]: "",
        [Role.Siswa]: ""
    };
    return roleLabels[role] || "Unknown";
  }

  // ==========================================
  // GENERIC ENUM FINDER
  // ==========================================

  /**
   * Find enum option by value from any enum options array
   */
  export function findEnumOption<T>(
    value: string | undefined,
    options: Array<{ value: T; label: string }>
  ) {
    return options.find((opt) => opt.value === value);
  }

  /**
   * Get label from any enum
   */
  export function getEnumLabel<T extends string>(
    value: T | undefined,
    options: Array<{ value: T; label: string }>
  ): string {
    const found = options.find((opt) => opt.value === value);
    return found?.label || "Unknown";
  }
