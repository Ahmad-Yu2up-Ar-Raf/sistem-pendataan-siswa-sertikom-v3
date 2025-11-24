import { z } from "zod";
import { jurusanSchema } from "./jurusanValidate";
import { tahunAjarSchema } from "./tahunAjarValidate";

// ==========================================
// KELAS SCHEMA
// ==========================================

export const kelasSchema = z.object({
    id: z.number().optional(),
    nama_kelas: z
      .string()
      .min(1, "Nama kelas wajib diisi")
      .max(100, "Nama kelas maksimal 100 karakter"),
    tingkat: z.string().min(1, "Tingkat wajib dipilih"),
    jurusan_id: z.coerce
      .number( "Jurusan wajib dipilih",)
      .min(1, "Jurusan wajib dipilih"),
    tahun_ajar_id: z.coerce
      .number( "Tahun ajar wajib dipilih",)
      .min(1, "Tahun ajar wajib dipilih"),
    kapasitas_maksimal: z.coerce
      .number()
      .min(1, "Kapasitas minimal 1")
      .max(100, "Kapasitas maksimal 100")
      .optional()
      .nullable(),
    wali_kelas: z
      .string()
      .max(191, "Wali kelas maksimal 191 karakter")
      .optional()
      .nullable(),
    ruangan: z
      .string()
      .max(50, "Ruangan maksimal 50 karakter")
      .optional()
      .nullable(),
    status: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    created_by: z.number().optional(),
    updated_by: z.number().optional(),
    
    // Relations
    jurusan: jurusanSchema.optional(),
    tahun_ajar: tahunAjarSchema.optional(),
  });
  
  export type KelasSchema = z.infer<typeof kelasSchema>;
  
  