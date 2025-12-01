import { AgamaValues } from "@/config/enums/agama";
import { JenisKelaminValues } from "@/config/enums/jenis-kelamin";
import { StatusSiswaValues } from "@/config/enums/StatusSiswa";
import { z } from "zod";
 
import { fotoSchema } from "./fileValidate";

// ==========================================
// SISWA SCHEMA (NULL-SAFE)
// ==========================================
export const siswaSchema = z.object({
  id: z.number().optional(),
  
  // ✅ Required fields
  nisn: z.string().min(1, "NISN wajib diisi").max(20, "NISN maksimal 20 karakter"),
  nis: z.string().max(20, "NIS maksimal 20 karakter").default(""),
  nama_lengkap: z.string().min(1, "Nama lengkap wajib diisi").max(191),
  jenis_kelamin: z.enum(JenisKelaminValues, { message: "Jenis kelamin wajib dipilih" }),
 
 
  tanggal_lahir: z.coerce.date(  "Tanggal lahir wajib diisi" ).refine((date) => date < new Date(), {
    message: "Tanggal lahir harus sebelum hari ini",
  }),
  agama: z.enum(AgamaValues, { message: "Agama wajib dipilih" }),
  alamat: z.string().min(1, "Alamat wajib diisi").max(500),
  nama_ayah: z.string().min(1, "Nama ayah wajib diisi").max(191),
  nama_ibu: z.string().min(1, "Nama ibu wajib diisi").max(191),
  nama_wali: z.string().max(191).default(""),
  tahun_ajar_id: z.number( "Tahun ajar wajib dipilih"  ).int().positive("Tahun ajar harus valid"),
  
  // ✅ Optional string fields - accept empty string, convert to undefined
  asal_sekolah: z.string().max(191).default("").transform(v => v || undefined),
  rt: z.string().max(5).default("").transform(v => v || undefined),
  rw: z.string().max(5).default("").transform(v => v || undefined),
  kelurahan: z.string().max(100).default("").transform(v => v || undefined),
  kecamatan: z.string().max(100).default("").transform(v => v || undefined),
  kota: z.string().max(100).default("").transform(v => v || undefined),
  provinsi: z.string().max(100).default("").transform(v => v || undefined),
  kode_pos: z.string().max(10).default("").transform(v => v || undefined),
  telepon: z.string().max(20).default("").transform(v => v || undefined),
  email: z.union([
    z.string().email("Format email tidak valid").max(191),
    z.literal("")
  ]).default("").transform(v => v || undefined),
  pekerjaan_ayah: z.string().max(100).default("").transform(v => v || undefined),
  pendidikan_ayah: z.string().max(50).default("").transform(v => v || undefined),
  telepon_ayah: z.string().max(20).default("").transform(v => v || undefined),
  pekerjaan_ibu: z.string().max(100).default("").transform(v => v || undefined),
  pendidikan_ibu: z.string().max(50).default("").transform(v => v || undefined),
  telepon_ibu: z.string().max(20).default("").transform(v => v || undefined),
  hubungan_wali: z.string().max(50).default("").transform(v => v || undefined),
  pekerjaan_wali: z.string().max(100).default("").transform(v => v || undefined),
  telepon_wali: z.string().max(20).default("").transform(v => v || undefined),
  alamat_wali: z.string().max(500).default("").transform(v => v || undefined),
  keterangan: z.string().max(1000).default("").transform(v => v || undefined),
  
  // ✅ Optional number fields - accept null/undefined
  anak_ke: z.number().int().min(1).max(20).optional().nullable().transform(v => v ?? undefined),
  jumlah_saudara: z.number().int().min(0).max(20).optional().nullable().transform(v => v ?? undefined),
  jurusan_id: z.number().int().positive().optional().nullable().transform(v => v ?? undefined),
  kelas_id: z.number().int().positive().optional().nullable().transform(v => v ?? undefined),
  
  // ✅ Optional enum - accept empty string
  status: z.enum(StatusSiswaValues).optional().nullable().transform(v => v ?? undefined),
  
  // Audit fields
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  created_by: z.number().optional(),
  updated_by: z.number().optional(),
  
  // ✅ FOTO FIELD - fully optional
  foto: fotoSchema.optional().nullable().transform(v => v ?? undefined),
  
  // Relations
  // jurusan: jurusanSchema.optional(),
  // kelas: kelasSchema.optional(),
  // tahun_masuk: tahunAjarSchema.optional(),
});

export type SiswaSchema = z.infer<typeof siswaSchema>;