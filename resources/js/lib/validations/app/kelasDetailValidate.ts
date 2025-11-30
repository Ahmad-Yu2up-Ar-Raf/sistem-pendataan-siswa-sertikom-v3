import { z } from "zod";
import { siswaSchema } from "./siswaValidate";
import { kelasSchema } from "./kelasValidate";
import { tahunAjarSchema } from "./tahunAjarValidate";

// ==========================================
// KELAS DETAIL SCHEMA
// ==========================================

export const kelasDetailSchema = z.object({
    id: z.number().optional(),
    siswa_id: z.coerce
      .number( "Siswa wajib dipilih",)
      .min(1, "Siswa wajib dipilih"),
    kelas_id: z.coerce
      .number( "Kelas wajib dipilih",)
      .min(1, "Kelas wajib dipilih"),
    tahun_ajar_id: z.coerce
      .number( "Tahun ajar wajib dipilih",)
      .min(1, "Tahun ajar wajib dipilih"),
    tanggal_masuk: z.coerce.date("Tanggal masuk wajib diisi",),
    tanggal_keluar: z.coerce
    .date("Format tanggal tidak valid")
    .optional()
    .nullable()
    .superRefine((date, ctx) => {
      const tanggalMasuk = ctx.value;
      if (date && tanggalMasuk && date <= tanggalMasuk) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Tanggal keluar harus setelah tanggal masuk",
        });
      }
    }),
    status_kelas: z.string().optional(),
    semester: z.string().optional().nullable(),
    no_urut_absen: z.coerce
      .number()
      .min(1, "Nomor absen minimal 1")
      .max(100, "Nomor absen maksimal 100")
      .optional()
      .nullable(),
    nilai_rata_rata: z.coerce
      .number()
      .min(0, "Nilai rata-rata minimal 0")
      .max(100, "Nilai rata-rata maksimal 100")
      .optional()
      .nullable(),
    ranking: z.coerce
      .number()
      .min(1, "Ranking minimal 1")
      .optional()
      .nullable(),
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
    siswa: siswaSchema.optional(),
    kelas: kelasSchema.optional(),
    tahun_ajar: tahunAjarSchema.optional(),
  });
  
  export type KelasDetailSchema = z.infer<typeof kelasDetailSchema>;