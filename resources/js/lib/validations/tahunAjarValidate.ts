import { z } from "zod";

// ==========================================
// TAHUN AJAR SCHEMA
// ==========================================

export const tahunAjarSchema = z
  .object({
    id: z.number().optional(),
    kode_tahun_ajar: z
      .string()
      .min(1, "Kode tahun ajar wajib diisi")
      .max(20, "Kode tahun ajar maksimal 20 karakter"),
    nama_tahun_ajar: z
      .string()
      .min(1, "Nama tahun ajar wajib diisi")
      .max(100, "Nama tahun ajar maksimal 100 karakter"),
    tanggal_mulai: z.instanceof(Date, {
      message: "Tanggal mulai wajib diisi",
    }),
    tanggal_selesai: z.instanceof(Date, {
      message: "Tanggal selesai wajib diisi",
    }),
    status: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    created_by: z.number().optional(),
    updated_by: z.number().optional(),
  })
  .refine((data) => data.tanggal_mulai < data.tanggal_selesai, {
    message: "Tanggal mulai harus sebelum tanggal selesai",
    path: ["tanggal_mulai"],
  });

export type TahunAjarSchema = z.infer<typeof tahunAjarSchema>;
