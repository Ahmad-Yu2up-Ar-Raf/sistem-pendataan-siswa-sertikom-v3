import { AgamaValues } from "@/config/enums/agama";
import { JenisKelaminValues } from "@/config/enums/jenis-kelamin";
import { StatusSiswaValues } from "@/config/enums/StatusSiswa";
import { z } from "zod";
import { kelasSchema } from "./kelasValidate";
import { tahunAjarSchema } from "./tahunAjarValidate";
import { jurusanSchema } from "./jurusanValidate";
import { fotoSchema } from "./fileValidate";



// ==========================================
// SISWA SCHEMA
// ==========================================
export const siswaSchema = z.object({
  id: z.number().optional(),
  
  // Required fields
  nisn: z.string().min(1, "NISN wajib diisi").max(20, "NISN maksimal 20 karakter"),
  nis: z.string().min(1, "NIS wajib diisi").max(20, "NIS maksimal 20 karakter").or(z.literal("")),
  nama_lengkap: z.string().min(1, "Nama lengkap wajib diisi").max(191),
  jenis_kelamin: z.enum(JenisKelaminValues, { message: "Jenis kelamin wajib dipilih" }),
  tempat_lahir: z.string().optional(),
  asal_negara: z.string().optional(),
  tanggal_lahir: z.coerce.date( "Tanggal lahir wajib diisi").refine((date) => date < new Date(), {
    message: "Tanggal lahir harus sebelum hari ini",
  }),
  agama: z.enum(AgamaValues, { message: "Agama wajib dipilih" }),
  alamat: z.string().min(1, "Alamat wajib diisi").max(500),
  nama_ayah: z.string().min(1, "Nama ayah wajib diisi").max(191),
  nama_ibu: z.string().min(1, "Nama ibu wajib diisi").max(191),
  nama_wali: z.string().max(191).optional().or(z.literal("")),
  tahun_ajar_id: z.number("Tahun ajar wajib dipilih" ).int().positive("Tahun ajar harus valid"),
  
  // Optional fields with .or(z.literal("")) for empty string compatibility
  asal_sekolah: z.string().max(191).optional().or(z.literal("")),
  rt: z.string().max(5).optional().or(z.literal("")),
  rw: z.string().max(5).optional().or(z.literal("")),
  kelurahan: z.string().max(100).optional().or(z.literal("")),
  kecamatan: z.string().max(100).optional().or(z.literal("")),
  kota: z.string().max(100).optional().or(z.literal("")),
  provinsi: z.string().max(100).optional().or(z.literal("")),
  kode_pos: z.string().max(10).optional().or(z.literal("")),
  anak_ke: z.number().int().min(1).max(20).optional().or(z.literal("")),
  jumlah_saudara: z.number().int().min(0).max(20).optional().or(z.literal("")),
  telepon: z.string().max(20).optional().or(z.literal("")),
  email: z.string().email("Format email tidak valid").max(191).optional().or(z.literal("")),
  pekerjaan_ayah: z.string().max(100).optional().or(z.literal("")),
  pendidikan_ayah: z.string().max(50).optional().or(z.literal("")),
  telepon_ayah: z.string().max(20).optional().or(z.literal("")),
  pekerjaan_ibu: z.string().max(100).optional().or(z.literal("")),
  pendidikan_ibu: z.string().max(50).optional().or(z.literal("")),
  telepon_ibu: z.string().max(20).optional().or(z.literal("")),
  hubungan_wali: z.string().max(50).optional().or(z.literal("")),
  pekerjaan_wali: z.string().max(100).optional().or(z.literal("")),
  telepon_wali: z.string().max(20).optional().or(z.literal("")),
  alamat_wali: z.string().max(500).optional().or(z.literal("")),
  jurusan_id: z.number().int().positive().optional().or(z.literal("")),
  kelas_id: z.number().int().positive().optional().or(z.literal("")),
  status: z.enum(StatusSiswaValues).optional().or(z.literal("")),
  keterangan: z.string().max(1000).optional().or(z.literal("")),
  
  // Audit fields
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  created_by: z.number().optional(),
  updated_by: z.number().optional(),
  
  // FOTO FIELD - supports both new upload and existing data
  foto: fotoSchema,
  
  // Relations
  jurusan: jurusanSchema.optional(),
  kelas: kelasSchema.optional(),
  tahun_masuk: tahunAjarSchema.optional(),
});

export type SiswaSchema = z.infer<typeof siswaSchema>;
