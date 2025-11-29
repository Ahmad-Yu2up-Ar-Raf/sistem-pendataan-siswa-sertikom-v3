import { StatusOptions, StatusValues } from "@/config/enums/status";
import { z } from "zod";

// ==========================================
// IMAGE & FILE SCHEMAS (REUSABLE)
// ==========================================



// ==========================================
// JURUSAN SCHEMA
// ==========================================

export const jurusanSchema = z.object({
  id: z.number().optional(),
  kode_jurusan: z
    .string()
    .min(1, "Kode jurusan wajib diisi")
    .max(20, "Kode jurusan maksimal 20 karakter"),
  nama_jurusan: z
    .string()
    .min(1, "Nama jurusan wajib diisi")
    .max(191, "Nama jurusan maksimal 191 karakter"),
  deskripsi: z
    .string()
    .max(1000, "Deskripsi maksimal 1000 karakter")
    .optional()
    .nullable(),
  status: z.enum(StatusValues,"Status wajib dipilih",
  ),
  
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  created_by: z.number().optional(),
  updated_by: z.number().optional(),
   kelases_count : z.number().optional(),
    siswas_count: z.number().optional(),
});

export type JurusanSchema = z.infer<typeof jurusanSchema>;

