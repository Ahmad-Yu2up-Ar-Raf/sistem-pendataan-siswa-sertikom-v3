import { useState, useCallback, useEffect } from "react";
import { useForm, UseFormReturn, SubmitHandler } from "react-hook-form";
import { router } from "@inertiajs/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerCreateSchema, UserSchema } from "@/lib/validations/auth/auth";
import { AvatarUpload } from "@/lib/validations/app/fileValidate";
export type UseUserFormOptions = {
  notify?: (args: { type: "success" | "error"; message: string }) => void;
  onSuccess?: (page?: unknown) => void;
  onError?: (errors?: Record<string, unknown>) => void;
  onFinish?: () => void;
  closeSheet?: () => void;
  route?: string;
  method?: "post" | "put" | "patch";
};

/**
 * Build FormData payload from UserSchema values
 * Handles file upload, crop data, and all other fields
 */
function buildFormData(values: UserSchema): FormData {
  const formData = new FormData();

  // Process each field
  Object.entries(values).forEach(([key, value]) => {
    // Skip relations & audit fields that shouldn't be sent
    if (['jurusan', 'kelas', 'tahun_masuk', 'created_at', 'updated_at', 'created_by', 'updated_by'].includes(key)) {
      return;
    }

    // Handle FOTO field specially
    if (key === "foto" && value) {
      const fotoData = value as UserSchema["foto"];
      
      // Check if this is NEW upload (has File & Blob)
      if (fotoData && 'file' in fotoData && fotoData.file instanceof File) {
        const uploadData = fotoData as AvatarUpload;
        
        // 1. Append the CROPPED blob as main foto file
        // Convert Blob to File with proper name
        const croppedFile = new File(
          [uploadData.croppedBlob],
          uploadData.file.name.replace(/\.[^/.]+$/, "") + "_cropped.jpg",
          { type: "image/jpeg" }
        );
        formData.append("foto", croppedFile);
        
        // 2. Append the ORIGINAL file (untuk backup/raw_foto)
        formData.append("foto_original", uploadData.file);
        
        // 3. Append crop metadata as JSON string
        formData.append("foto_crop_data", JSON.stringify({
          cropData: uploadData.cropData,
          originalName: uploadData.file.name,
          originalSize: uploadData.file.size,
          originalMime: uploadData.file.type,
        }));
      }
      // If existing foto (edit without reupload), don't send anything
      // Backend will keep existing data
      
      return; // Skip normal processing
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
 * Convert server response to form-compatible format
 * Used for prefilling form on edit
 */
function convertServerDataToFormData(serverData: any): Partial<UserSchema> {
  const formData: Partial<UserSchema> = { ...serverData };

 
  // Convert foto from server format to form format
  if (serverData.foto && serverData.raw_foto) {
    // Server returns:
    // foto: "/storage/dashboard/xyz.jpg"
    // raw_foto: { file: {...}, croppedBlob: {...}, cropData: {...}, preview: "..." }
    
    formData.foto = {
      preview: serverData.raw_foto.preview || serverData.foto,
      cropData: serverData.raw_foto.cropData,
      file: serverData.raw_foto.file,
      croppedBlob: serverData.raw_foto.croppedBlob,
    };
  } else if (serverData.foto && !serverData.raw_foto) {
    // Fallback: only foto URL exists (old data)
    formData.foto = {
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

  return formData;
}

export function useUserForm(
  defaultValues?: Partial<UserSchema>,
  opts: UseUserFormOptions = {},
) {
  const {
    notify,
    onSuccess,
    onError,
    onFinish,
    closeSheet,
    route = "/dashboard/dashboard",
    method = "post"
  } = opts;

  // Convert server data if needed
  const initialValues = defaultValues 
    ? convertServerDataToFormData(defaultValues)
    : {};

  const form = useForm<UserSchema>({
    mode: "onSubmit",
    resolver: zodResolver(registerCreateSchema) as any,
    defaultValues: {
         name: defaultValues?.name,
      password: defaultValues?.password,
      password_confirmation: defaultValues?.password_confirmation,
      email: defaultValues?.email,
      roles: defaultValues?.roles,
      foto: defaultValues?.foto,
    } as UserSchema,
  });

  // Sync with external defaultValues changes
  useEffect(() => {
    if (defaultValues) {
      const converted = convertServerDataToFormData(defaultValues);
      form.reset(converted as UserSchema);
    }
  }, [JSON.stringify(defaultValues)]);

  const [isPending, setIsPending] = useState(false);

  const submit: SubmitHandler<UserSchema> = useCallback(
    (values) => {
      console.log("🚀 SUBMIT VALUES:", values);
      
      form.clearErrors();
      setIsPending(true);

      // Build FormData payload
      const formData = buildFormData(values);

      // Debug: log FormData contents
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
          message: method === "post" ? "User berhasil ditambahkan" : "User berhasil diperbarui" 
        });
        if (onSuccess) onSuccess(page);
      };

      const handleError = (errors?: unknown) => {
        console.error("❌ SUBMIT ERROR:", errors);
        
     if (errors && typeof errors === "object" && !Array.isArray(errors)) {
          Object.entries(errors as Record<string, unknown>).forEach(([key, val]) => {
            const message = Array.isArray(val) ? (val as string[]).join(", ") : String(val ?? "Terjadi kesalahan.");
            console.log(message)
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
        // Laravel needs _method=PUT for FormData
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
    form: UseFormReturn<UserSchema>;
    submit: (values: UserSchema) => void;
    isPending: boolean;
  };
}