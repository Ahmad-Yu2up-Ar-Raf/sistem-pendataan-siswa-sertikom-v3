import { useState, useCallback, useEffect } from "react";
import { useForm, UseFormReturn, SubmitHandler } from "react-hook-form";
import { router } from "@inertiajs/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { siswaSchema, SiswaSchema } from "@/lib/validations/app/siswaValidate";
import { AvatarUpload } from "@/lib/validations/app/fileValidate";
import countries from '@/config/data/countries.json'
import { CountryProps } from "@/components/ui/fragments/custom-ui/input/select/location-input";

export type UseSiswaFormOptions = {
  notify?: (args: { type: "success" | "error"; message: string }) => void;
  onSuccess?: (page?: unknown) => void;
  onError?: (errors?: Record<string, unknown>) => void;
  onFinish?: () => void;
  closeSheet?: () => void;
  route?: string;
  method?: "post" | "put" | "patch";
};

/**
 * ✅ NULL-SAFE helpers
 */
const safeString = (val: any): string => (val === null || val === undefined) ? "" : String(val);
const safeNumber = (val: any): number | undefined => {
  if (val === null || val === undefined || val === "") return undefined;
  const num = Number(val);
  return isNaN(num) ? undefined : num;
};

/**
 * Build FormData payload from SiswaSchema values
 */
function buildFormData(values: SiswaSchema): FormData {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    // Skip relations & audit fields
    if (['jurusan', 'kelas', 'tahun_masuk', 'created_at', 'updated_at', 'created_by', 'updated_by'].includes(key)) {
      return;
    }

    // Handle FOTO field
    if (key === "foto" && value) {
      const fotoData = value as SiswaSchema["foto"];
      
      if (fotoData && 'file' in fotoData && fotoData.file instanceof File) {
        const uploadData = fotoData as AvatarUpload;
        
        const croppedFile = new File(
          [uploadData.croppedBlob],
          uploadData.file.name.replace(/\.[^/.]+$/, "") + "_cropped.jpg",
          { type: "image/jpeg" }
        );
        formData.append("foto", croppedFile);
        formData.append("foto_original", uploadData.file);
        formData.append("foto_crop_data", JSON.stringify({
          cropData: uploadData.cropData,
          originalName: uploadData.file.name,
          originalSize: uploadData.file.size,
          originalMime: uploadData.file.type,
        }));
      }
      return;
    }

    // Handle other fields
    if (value !== null && value !== undefined && value !== "") {
      if (key === "tanggal_lahir" && value instanceof Date) {
        formData.append(key, value.toISOString().split('T')[0]);
      } else if (typeof value === "number") {
        formData.append(key, value.toString());
      } else if (typeof value === "boolean") {
        formData.append(key, value ? "1" : "0");
      } else {
        formData.append(key, String(value));
      }
    }
  });

  return formData;
}

/**
 * ✅ FIXED: NULL-SAFE converter
 */
function convertServerDataToFormData(serverData: any): Partial<SiswaSchema> {
  console.log("🔄 Converting server data:", serverData);

  // ✅ Convert tanggal_lahir - handle both ISO string and Date
  let tanggalLahir: Date | undefined;
  if (serverData.tanggal_lahir) {
    try {
      tanggalLahir = new Date(serverData.tanggal_lahir);
      // Validate date is valid
      if (isNaN(tanggalLahir.getTime())) {
        console.error("Invalid tanggal_lahir:", serverData.tanggal_lahir);
        tanggalLahir = undefined;
      }
    } catch (e) {
      console.error("Error parsing tanggal_lahir:", e);
      tanggalLahir = undefined;
    }
  }

 

  // ✅ Convert foto - handle null case
  let fotoValue: any = undefined;
  if (serverData.foto && serverData.raw_foto) {
    fotoValue = {
      preview: serverData.raw_foto.preview || serverData.foto,
      cropData: serverData.raw_foto.cropData,
      file: serverData.raw_foto.file,
      croppedBlob: serverData.raw_foto.croppedBlob,
    };
  } else if (serverData.foto && !serverData.raw_foto) {
    fotoValue = {
      preview: serverData.foto,
      cropData: undefined,
      file: {
        url: serverData.foto,
        path: serverData.foto.replace('/storage/', ''),
        original_name: null,
        size: 0,
        mime: 'image/jpeg',
      },
    };
  }
  // If both foto and raw_foto are null, fotoValue stays undefined

  // ✅ Build converted object with NULL-SAFE transformations
  const converted = {
    id: serverData.id,
    // Required string fields - convert null to empty string
    nisn: safeString(serverData.nisn),
    nis: safeString(serverData.nis),
    nama_lengkap: safeString(serverData.nama_lengkap),
    nama_ayah: safeString(serverData.nama_ayah),
    nama_ibu: safeString(serverData.nama_ibu),
    alamat: safeString(serverData.alamat),
    
    // Enum fields - keep as is (required, shouldn't be null)
    jenis_kelamin: serverData.jenis_kelamin,
    agama: serverData.agama || "Islam",
    
    // Optional string fields - convert null to empty string
    nama_wali: safeString(serverData.nama_wali),
    
    asal_sekolah: safeString(serverData.asal_sekolah),
    rt: safeString(serverData.rt),
    rw: safeString(serverData.rw),
    kelurahan: safeString(serverData.kelurahan),
    kecamatan: safeString(serverData.kecamatan),
    kota: safeString(serverData.kota),
    provinsi: safeString(serverData.provinsi),
    kode_pos: safeString(serverData.kode_pos),
    telepon: safeString(serverData.telepon),
    email: safeString(serverData.email),
    pekerjaan_ayah: safeString(serverData.pekerjaan_ayah),
    pendidikan_ayah: safeString(serverData.pendidikan_ayah),
    telepon_ayah: safeString(serverData.telepon_ayah),
    pekerjaan_ibu: safeString(serverData.pekerjaan_ibu),
    pendidikan_ibu: safeString(serverData.pendidikan_ibu),
    telepon_ibu: safeString(serverData.telepon_ibu),
    hubungan_wali: safeString(serverData.hubungan_wali),
    pekerjaan_wali: safeString(serverData.pekerjaan_wali),
    telepon_wali: safeString(serverData.telepon_wali),
    alamat_wali: safeString(serverData.alamat_wali),
    keterangan: safeString(serverData.keterangan),
    status: serverData.status || undefined,
    
    // Date field
    tanggal_lahir: tanggalLahir,
    
    // Number fields - convert null to undefined
    tahun_ajar_id: safeNumber(serverData.tahun_ajar_id),
    jurusan_id: safeNumber(serverData.jurusan_id),
    kelas_id: safeNumber(serverData.kelas_id),
    anak_ke: safeNumber(serverData.anak_ke),
    jumlah_saudara: safeNumber(serverData.jumlah_saudara),
    
    // Foto
    foto: fotoValue,
    
    // Relations (optional, keep as is)
    jurusan: serverData.jurusan,
    kelas: serverData.kelas,
    tahun_masuk: serverData.tahun_masuk,
  };

  console.log("✅ Converted data:", converted);
  return converted;
}

export function useSiswaForm(
  defaultValues?: Partial<SiswaSchema>,
  opts: UseSiswaFormOptions = {},
) {
  const {
    notify,
    onSuccess,
    onError,
    onFinish,
    closeSheet,
    route = "/dashboard/siswa",
    method = "post"
  } = opts;

  const form = useForm<SiswaSchema>({
    mode: "onSubmit",
    resolver: zodResolver(siswaSchema) as any,
    defaultValues: defaultValues as SiswaSchema,
  });

  // ✅ Sync with external changes - PROPERLY handle conversion
  useEffect(() => {
    if (defaultValues) {
      console.log("🔄 Resetting form with new defaultValues");
      const converted = convertServerDataToFormData(defaultValues);
      form.reset(converted as SiswaSchema);
    }
  }, [JSON.stringify(defaultValues), form]);

  const [isPending, setIsPending] = useState(false);

  const submit: SubmitHandler<SiswaSchema> = useCallback(
    (values) => {
      console.log("🚀 SUBMIT VALUES:", values);
      
      form.clearErrors();
      setIsPending(true);

      const formData = buildFormData(values);

      console.log("📦 FormData entries:");
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}:`, `File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`  ${key}:`, value);
        }
      }

      const handleSuccess = (page?: unknown) => {
        try {
          form.reset();
        } catch {}

        if (closeSheet) closeSheet();
        if (notify) notify({ 
          type: "success", 
          message: method === "post" ? "Siswa berhasil ditambahkan" : "Siswa berhasil diperbarui" 
        });
        if (onSuccess) onSuccess(page);
      };

      const handleError = (errors?: unknown) => {
        console.error("❌ SUBMIT ERROR:", errors);
        
        if (errors && typeof errors === "object" && !Array.isArray(errors)) {
          Object.entries(errors as Record<string, unknown>).forEach(([key, val]) => {
            const message = Array.isArray(val) ? (val as string[]).join(", ") : String(val ?? "Terjadi kesalahan.");
            console.log(`Error [${key}]:`, message);
          });
        }
        if (notify) {
          const msg = typeof errors === "object"
            ? (Object.values(errors as Record<string, unknown>).flat().join(", ") || "Terjadi kesalahan.")
            : "Terjadi kesalahan.";
          notify({ type: "error", message: msg });
        }

        if (onError) onError(errors as Record<string, unknown>);
      };

      const finalize = () => {
        setIsPending(false);
        if (onFinish) onFinish();
      };

      // Send request
      if (method === "post") {
        router.post(route, formData, {
          preserveState: true,
          onSuccess: handleSuccess,
          onError: handleError,
          onFinish: finalize,
        });
      } else if (method === "put") {
        formData.append("_method", "PUT");
        router.post(route, formData, {
          preserveState: true,
          onSuccess: handleSuccess,
          onError: handleError,
          onFinish: finalize,
        });
      } else {
        formData.append("_method", "PATCH");
        router.post(route, formData, {
          preserveState: true,
          onSuccess: handleSuccess,
          onError: handleError,
          onFinish: finalize,
        });
      }
    },
    [form, notify, onSuccess, onError, onFinish, closeSheet, route, method],
  );

  return {
    form,
    submit,
    isPending,
  } as {
    form: UseFormReturn<SiswaSchema>;
    submit: (values: SiswaSchema) => void;
    isPending: boolean;
  };
}