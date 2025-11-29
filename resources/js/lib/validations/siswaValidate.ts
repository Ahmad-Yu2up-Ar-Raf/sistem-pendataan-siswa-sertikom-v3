import { AgamaValues } from "@/config/enums/agama";
import { JenisKelaminValues } from "@/config/enums/jenis-kelamin";
import { StatusSiswaValues } from "@/config/enums/StatusSiswa";
import { z } from "zod";
import { kelasSchema } from "./kelasValidate";
import { tahunAjarSchema } from "./tahunAjarValidate";
import { jurusanSchema } from "./jurusanValidate";

// Type untuk avatar data
export const avatarDataSchema = z.object({
  file: z.instanceof(File),
  preview: z.string(),
  croppedBlob: z.instanceof(Blob),
  cropData: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
  }),
}).nullable();

export const siswaSchema = z.object({
  // Data Identitas - Required
    id: z.number().optional(),
  nisn: z
    .string()
    .min(1, "NISN wajib diisi")
    .max(20, "NISN maksimal 20 karakter"),
  
  nis: z
    .string()
        .min(1, "NIS wajib diisi")
    .max(20, "NIS maksimal 20 karakter")

    .or(z.literal("")),
  
  nama_lengkap: z
    .string()
    .min(1, "Nama lengkap wajib diisi")
    .max(191, "Nama lengkap maksimal 191 karakter"),
  
  jenis_kelamin: z.enum(JenisKelaminValues,"Jenis kelamin wajib dipilih",
  ),
  
  tempat_lahir: z
    .string()
    .min(1, "Tempat lahir wajib diisi")
    .max(100, "Tempat lahir maksimal 100 karakter"),
  
  asal_negara: z
    .string()
    .min(1, "Asal Negara wajib diisi")
    .max(100, "Asal Negara maksimal 100 karakter"),
  
  tanggal_lahir: z
  .coerce
    .date({
      error: "Tanggal lahir wajib diisi",
    })
    .refine((date) => date < new Date(), {
      message: "Tanggal lahir harus sebelum hari ini",
    }),
  
  agama: z.enum(AgamaValues ,"Agama wajib dipilih",),
  
  // Alamat - Required
  alamat: z
    .string()
    .min(1, "Alamat wajib diisi")
    .max(500, "Alamat maksimal 500 karakter"),
  
  // // Orang Tua - Required
  nama_ayah: z
    .string()
    .min(1, "Nama ayah wajib diisi")
    .max(191, "Nama ayah maksimal 191 karakter"),
  
  nama_ibu: z
    .string()
    .min(1, "Nama ibu wajib diisi")
    .max(191, "Nama ibu maksimal 191 karakter"),
  
  nama_wali: z
    .string()
    .max(191, "Nama wali maksimal 191 karakter")
    .optional()
    .or(z.literal("")),
  
  // Data Akademik
  tahun_ajar_id: z
    .number({
      error: "Tahun ajar wajib dipilih",
    })
    .int()
    .positive("Tahun ajar harus valid"),
  
  asal_sekolah: z
    .string()
    .max(191, "Asal sekolah maksimal 191 karakter")
    .optional()
    .or(z.literal("")),
  
  // Optional Fields
  rt: z.string().max(5, "RT maksimal 5 karakter").optional().or(z.literal("")),
  rw: z.string().max(5, "RW maksimal 5 karakter").optional().or(z.literal("")),
  kelurahan: z
    .string()
    .max(100, "Kelurahan maksimal 100 karakter")
    .optional()
    .or(z.literal("")),
  kecamatan: z
    .string()
    .max(100, "Kecamatan maksimal 100 karakter")
    .optional()
    .or(z.literal("")),
  kota: z
    .string()
    .max(100, "Kota maksimal 100 karakter")
    .optional()
    .or(z.literal("")),
  provinsi: z
    .string()
    .max(100, "Provinsi maksimal 100 karakter")
    .optional()
    .or(z.literal("")),
  kode_pos: z
    .string()
    .max(10, "Kode pos maksimal 10 karakter")
    .optional()
    .or(z.literal("")),
  
  anak_ke: z
    .number()
    .int()
    .min(1)
    .max(20)
    .optional()
    .or(z.literal("")),
  
  jumlah_saudara: z
    .number()
    .int()
    .min(0)
    .max(20)
    .optional()
    .or(z.literal("")),
  
  telepon: z
    .string()
    .max(20, "Telepon maksimal 20 karakter")
    .optional()
    .or(z.literal("")),
  
  email: z
    .string()
    .email("Format email tidak valid")
    .max(191, "Email maksimal 191 karakter")
    .optional()
    .or(z.literal("")),
  
  pekerjaan_ayah: z
    .string()
    .max(100, "Pekerjaan ayah maksimal 100 karakter")
    .optional()
    .or(z.literal("")),
  
  pendidikan_ayah: z
    .string()
    .max(50, "Pendidikan ayah maksimal 50 karakter")
    .optional()
    .or(z.literal("")),
  
  telepon_ayah: z
    .string()
    .max(20, "Telepon ayah maksimal 20 karakter")
    .optional()
    .or(z.literal("")),
  
  pekerjaan_ibu: z
    .string()
    .max(100, "Pekerjaan ibu maksimal 100 karakter")
    .optional()
    .or(z.literal("")),
  
  pendidikan_ibu: z
    .string()
    .max(50, "Pendidikan ibu maksimal 50 karakter")
    .optional()
    .or(z.literal("")),
  
  telepon_ibu: z
    .string()
    .max(20, "Telepon ibu maksimal 20 karakter")
    .optional()
    .or(z.literal("")),
  
  hubungan_wali: z
    .string()
    .max(50, "Hubungan wali maksimal 50 karakter")
    .optional()
    .or(z.literal("")),
  
  pekerjaan_wali: z
    .string()
    .max(100, "Pekerjaan wali maksimal 100 karakter")
    .optional()
    .or(z.literal("")),
  
  telepon_wali: z
    .string()
    .max(20, "Telepon wali maksimal 20 karakter")
    .optional()
    .or(z.literal("")),
  
  alamat_wali: z
    .string()
    .max(500, "Alamat wali maksimal 500 karakter")
    .optional()
    .or(z.literal("")),
  
  jurusan_id: z
    .number()
    .int()
    .positive()

    .or(z.literal("")),
  
  kelas_id: z
    .number()
    .int()
    .positive()
    
    .or(z.literal("")),
  
  status: z
    .enum(StatusSiswaValues)
    .optional()
    .or(z.literal("")),
  
  keterangan: z
    .string()
    .max(1000, "Keterangan maksimal 1000 karakter")
    .optional()
    .or(z.literal("")),
   created_at: z.string().optional(),
      updated_at: z.string().optional(),
      created_by: z.number().optional(),
      updated_by: z.number().optional(),
  // FOTO FIELD - Avatar data with crop information
  foto: avatarDataSchema.refine(
    (data) => {
      if (!data) return true; // Optional field
      
      // Validate file size (max 2MB)
      if (data.file.size > 2 * 1024 * 1024) {
        return false;
      }
      
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      return validTypes.includes(data.file.type);
    },
    {
      message: "Foto harus berupa JPG, JPEG, atau PNG dan maksimal 2MB",
    }
  ).optional(),
   jurusan: jurusanSchema.optional(),
      kelas: kelasSchema.optional(),
      tahun_masuk: tahunAjarSchema.optional(),
});

export type SiswaSchema = z.infer<typeof siswaSchema>;
export type AvatarData = z.infer<typeof avatarDataSchema>;