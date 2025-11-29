// src/hooks/useKelasForm.ts
import { useState, useCallback, useEffect } from "react";
import { useForm, UseFormReturn, SubmitHandler } from "react-hook-form";
import { router } from "@inertiajs/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { kelasSchema, KelasSchema } from "@/lib/validations/kelasValidate";

export type UseKelasFormOptions = {
  /**
   * notify: injection function untuk memberi notifikasi (toast).
   * Contoh: (args) => toast.success(args.message) atau custom UI handler.
   */
  notify?: (args: { type: "success" | "error"; message: string }) => void;

  /** callback opsional ketika submit sukses */
  onSuccess?: (page?: unknown) => void;

  /** callback opsional ketika ada error */
  onError?: (errors?: Record<string, unknown>) => void;

  /** callback opsional dipanggil saat selesai (always) */
  onFinish?: () => void;

  /** optional function to close UI sheet/dialog; jika diberikan, hook tidak perlu tahu implementasinya */
  closeSheet?: () => void;

  /**
   * route: tujuan request (POST untuk create, PUT/PATCH untuk update).
   * Jika mau update, pass full route including id, contoh: '/dashboard/kelas/12'
   */
  route?: string;

  /** method: 'post' | 'put' | 'patch' */
  method?: "post" | "put" | "patch";
};

/**
 * Hook generik untuk create / update tahun ajar.
 * - defaultValues: initial values (dipakai untuk update: prefill form)
 * - opts.route & opts.method menentukan request yang dipanggil
 */
export function useKelasForm(
  defaultValues?: Partial<KelasSchema>,
  opts: UseKelasFormOptions = {},
) {
  const { notify, onSuccess, onError, onFinish, closeSheet, route = "/dashboard/kelas", method = "post" } = opts;

  // form type diambil dari zod schema
  const form = useForm<KelasSchema>({
    mode: "onSubmit",
    resolver: zodResolver(kelasSchema)  as any,
    defaultValues: {
      id: defaultValues?.id,
         nama_kelas:defaultValues?.nama_kelas,
      tahun_ajar_id:defaultValues?.tahun_ajar_id,
         wali_kelas: defaultValues?.wali_kelas,
         tingkat: defaultValues?.tingkat,
         jurusan_id: defaultValues?.jurusan_id,
         ruangan: defaultValues?.ruangan,
         kapasitas_maksimal: defaultValues?.kapasitas_maksimal,
         status: defaultValues?.status || "aktif",
    },
  });

  // sinkronisasi jika parent mengubah defaultValues (mis. saat open with different record)
  useEffect(() => {
    if (defaultValues) {
      form.reset({   
        id: defaultValues?.id,nama_kelas:defaultValues?.nama_kelas,
      tahun_ajar_id:defaultValues?.tahun_ajar_id,
         wali_kelas: defaultValues?.wali_kelas,
         jurusan_id: defaultValues?.jurusan_id,
             kapasitas_maksimal: defaultValues?.kapasitas_maksimal,
                 tingkat: defaultValues?.tingkat,
         ruangan: defaultValues?.ruangan,
         status: defaultValues?.status || "aktif", });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(defaultValues)]);

  const [isPending, setIsPending] = useState(false);

  const submit: SubmitHandler<KelasSchema> = useCallback(
    (values) => {
      // clear previous errors
      form.clearErrors();

      setIsPending(true);

      const payload = values;

      const handleSuccess = (page?: unknown) => {
        try {
          form.reset();
        } catch {
          /* ignore */
        }

        if (typeof closeSheet === "function") closeSheet();
        if (notify) notify({ type: "success", message: "Kelas  berhasil disimpan." });
        if (onSuccess) onSuccess(page);
      };

      const handleError = (errors?: unknown) => {
        // map server errors to form errors when possible
        if (errors && typeof errors === "object" && !Array.isArray(errors)) {
          Object.entries(errors as Record<string, unknown>).forEach(([key, val]) => {
            const message = Array.isArray(val) ? (val as string[]).join(", ") : String(val ?? "Terjadi kesalahan.");
            try {
              // setError may accept dot-paths; cast to any to avoid TS strictness here
              form.setError(key as any, { type: "server", message });
            } catch {
              // fallback: set a global form error under _form if component reads it
              try {
                form.setError("_form" as any, { type: "server", message });
              } catch {
                // swallow
              }
            }
          });
        }

        if (notify) {
          const msg =
            typeof errors === "object"
              ? (Object.values(errors as Record<string, unknown>).flat?.().join?.(", ") ?? JSON.stringify(errors))
              : "Terjadi kesalahan.";
          notify({ type: "error", message: msg });
        }

        if (onError) onError(errors as Record<string, unknown>);
      };

      const finalize = () => {
        setIsPending(false);
        if (onFinish) onFinish();
      };

      // choose method
      if (method === "post") {
        router.post(route, payload, {
          preserveState: true,
          onSuccess: handleSuccess,
          onError: (e) => handleError(e),
          onFinish: finalize,
        });
      } else if (method === "put") {
        router.put(route, payload, {
          preserveState: true,
          onSuccess: handleSuccess,
          onError: (e) => handleError(e),
          onFinish: finalize,
        });
      } else {
        // patch
        router.patch(route, payload, {
          preserveState: true,
          onSuccess: handleSuccess,
          onError: (e) => handleError(e),
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
    form: UseFormReturn<KelasSchema>;
    submit: (values: KelasSchema) => void;
    isPending: boolean;
  };
}
