 
import { z } from "zod";
 

// ==========================================
// FOTO SCHEMAS
// ==========================================

/**
 * Schema untuk NEW upload (user baru upload file)
 * Digunakan saat CREATE atau UPDATE dengan file baru
 */
export const avatarUploadSchema = z.object({
  file: z.instanceof(File),
  preview: z.string(), // blob URL temporary
  croppedBlob: z.instanceof(Blob),
  cropData: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
  }),
});


/**
 * Schema untuk EXISTING foto dari server (prefill saat edit)
 * raw_foto dari backend sudah berupa object lengkap
 */
export const avatarExistingSchema = z.object({
  preview: z.string(), // public URL dari server
  cropData: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
  }).optional(),
  file: z.object({
    url: z.string(),
    path: z.string(),
    original_name: z.string().nullable(),
    size: z.number(),
    mime: z.string(),
  }).optional(),
  croppedBlob: z.object({
    url: z.string(),
    path: z.string(),
  }).optional(),
});

/**
 * Union schema: bisa upload baru, existing, atau null
 */
export const fotoSchema = z.union([
  avatarUploadSchema,
  avatarExistingSchema,
  z.null(),
]).optional().refine(
  (data) => {
    if (!data) return true; // Optional field
    
    // Jika new upload, validate file size & type
    if ('file' in data && data.file instanceof File) {
      if (data.file.size > 2 * 1024 * 1024) return false;
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      return validTypes.includes(data.file.type);
    }
    
    return true; // Existing data always valid
  },
  {
    message: "Foto harus berupa JPG, JPEG, atau PNG dan maksimal 2MB",
  }
);
export type AvatarUpload = z.infer<typeof avatarUploadSchema>;
export type AvatarExisting = z.infer<typeof avatarExistingSchema>;