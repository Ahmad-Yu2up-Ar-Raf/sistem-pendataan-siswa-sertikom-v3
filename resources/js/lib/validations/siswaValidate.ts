import { z } from "zod";
import { jurusanSchema } from "./jurusanValidate";
import { tahunAjarSchema } from "./tahunAjarValidate";
// ==========================================
// SISWA SCHEMA
// ==========================================
const imageSchema = z.union([
  z.instanceof(File)
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: "Ukuran file harus kurang dari 2MB",
    })
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
      {
        message: "Hanya file JPEG, JPG, dan PNG yang diperbolehkan",
      }
    ),
  z.string().min(1, "Foto wajib diisi"),
]);

export const siswaSchema = z.object({
    id: z.number().optional(),
    
    // Data Identitas
    nisn: z
      .string()
      .min(1, "NISN wajib diisi")
      .max(20, "NISN maksimal 20 karakter"),
    nis: z
      .string()
      .max(20, "NIS maksimal 20 karakter")
      .optional()
      .nullable(),
    nama_lengkap: z
      .string()
      .min(1, "Nama lengkap wajib diisi")
      .max(191, "Nama lengkap maksimal 191 karakter"),
    jenis_kelamin: z.string().min(1, "Jenis kelamin wajib dipilih"),
    tempat_lahir: z
      .string()
      .min(1, "Tempat lahir wajib diisi")
      .max(100, "Tempat lahir maksimal 100 karakter"),
    tanggal_lahir: z.coerce
      .date(
       "Tanggal lahir wajib diisi",
      )
      .refine((date) => date < new Date(), {
        message: "Tanggal lahir harus sebelum hari ini",
      }),
    agama: z.string().min(1, "Agama wajib dipilih"),
    anak_ke: z.coerce
      .number()
      .min(1, "Anak ke minimal 1")
      .max(20, "Anak ke maksimal 20")
      .optional()
      .nullable(),
    jumlah_saudara: z.coerce
      .number()
      .min(0, "Jumlah saudara minimal 0")
      .max(20, "Jumlah saudara maksimal 20")
      .optional()
      .nullable(),
  
    // Alamat
    alamat: z
      .string()
      .min(1, "Alamat wajib diisi")
      .max(500, "Alamat maksimal 500 karakter"),
    rt: z.string().max(5, "RT maksimal 5 karakter").optional().nullable(),
    rw: z.string().max(5, "RW maksimal 5 karakter").optional().nullable(),
    kelurahan: z
      .string()
      .max(100, "Kelurahan maksimal 100 karakter")
      .optional()
      .nullable(),
    kecamatan: z
      .string()
      .max(100, "Kecamatan maksimal 100 karakter")
      .optional()
      .nullable(),
    kota: z
      .string()
      .max(100, "Kota maksimal 100 karakter")
      .optional()
      .nullable(),
    provinsi: z
      .string()
      .max(100, "Provinsi maksimal 100 karakter")
      .optional()
      .nullable(),
    kode_pos: z
      .string()
      .max(10, "Kode pos maksimal 10 karakter")
      .optional()
      .nullable(),
  
    // Kontak
    telepon: z
      .string()
      .max(20, "Telepon maksimal 20 karakter")
      .optional()
      .nullable(),
    email: z
      .string()
      .email("Format email tidak valid")
      .max(191, "Email maksimal 191 karakter")
      .optional()
      .nullable(),
  
    // Data Orang Tua - Ayah
    nama_ayah: z
      .string()
      .min(1, "Nama ayah wajib diisi")
      .max(191, "Nama ayah maksimal 191 karakter"),
    pekerjaan_ayah: z
      .string()
      .max(100, "Pekerjaan ayah maksimal 100 karakter")
      .optional()
      .nullable(),
    pendidikan_ayah: z
      .string()
      .max(50, "Pendidikan ayah maksimal 50 karakter")
      .optional()
      .nullable(),
    telepon_ayah: z
      .string()
      .max(20, "Telepon ayah maksimal 20 karakter")
      .optional()
      .nullable(),
  
    // Data Orang Tua - Ibu
    nama_ibu: z
      .string()
      .min(1, "Nama ibu wajib diisi")
      .max(191, "Nama ibu maksimal 191 karakter"),
    pekerjaan_ibu: z
      .string()
      .max(100, "Pekerjaan ibu maksimal 100 karakter")
      .optional()
      .nullable(),
    pendidikan_ibu: z
      .string()
      .max(50, "Pendidikan ibu maksimal 50 karakter")
      .optional()
      .nullable(),
    telepon_ibu: z
      .string()
      .max(20, "Telepon ibu maksimal 20 karakter")
      .optional()
      .nullable(),
  
    // Data Wali
    nama_wali: z
      .string()
      .max(191, "Nama wali maksimal 191 karakter")
      .optional()
      .nullable(),
    hubungan_wali: z
      .string()
      .max(50, "Hubungan wali maksimal 50 karakter")
      .optional()
      .nullable(),
    pekerjaan_wali: z
      .string()
      .max(100, "Pekerjaan wali maksimal 100 karakter")
      .optional()
      .nullable(),
    telepon_wali: z
      .string()
      .max(20, "Telepon wali maksimal 20 karakter")
      .optional()
      .nullable(),
    alamat_wali: z
      .string()
      .max(500, "Alamat wali maksimal 500 karakter")
      .optional()
      .nullable(),
  
    // Data Akademik
    jurusan_id: z.coerce.number().optional().nullable(),
    tahun_masuk_id: z.coerce.number().optional().nullable(),
    asal_sekolah: z
      .string()
      .max(191, "Asal sekolah maksimal 191 karakter")
      .optional()
      .nullable(),
  
    // Status & Media
    foto: imageSchema.optional().nullable(),
    status: z.string().optional(),
    keterangan: z
      .string()
      .max(1000, "Keterangan maksimal 1000 karakter")
      .optional()
      .nullable(),
  
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    created_by: z.number().optional(),
    updated_by: z.number().optional(),
    
    // Relations
    jurusan: jurusanSchema.optional(),
    tahun_masuk: tahunAjarSchema.optional(),
  });
  
  export type SiswaSchema = z.infer<typeof siswaSchema>;
  
  