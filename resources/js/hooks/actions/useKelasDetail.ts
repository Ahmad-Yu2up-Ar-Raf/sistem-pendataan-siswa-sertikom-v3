// src/hooks/useKelasDetailForm.ts
import { useState, useCallback, useEffect } from "react";
import { useForm, UseFormReturn, SubmitHandler } from "react-hook-form";
import { router } from "@inertiajs/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { kelasDetailSchema, KelasDetailSchema } from "@/lib/validations/app/kelasDetailValidate";

export type UseKelasDetailFormOptions = {
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
   * Jika mau update, pass full route including id, contoh: '/dashboard/kelasDetail/12'
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
export function useKelasDetailForm(
  defaultValues?: Partial<KelasDetailSchema>,
  opts: UseKelasDetailFormOptions = {},
) {
  const { notify, onSuccess, onError, onFinish, closeSheet, route = "/dashboard/kelasDetail", method = "post" } = opts;

  // form type diambil dari zod schema
  const form = useForm<KelasDetailSchema>({
    mode: "onSubmit",
    resolver: zodResolver(kelasDetailSchema)  as any,
    defaultValues: {
      id: defaultValues?.id,
         siswa_id :defaultValues?.siswa_id,
      tahun_ajar_id:defaultValues?.tahun_ajar_id,
         kelas_id: defaultValues?.kelas_id,
         tanggal_masuk: defaultValues?.tanggal_masuk,
         tanggal_keluar: defaultValues?.tanggal_keluar,
         status_kelas: defaultValues?.status_kelas,
         semester: defaultValues?.semester,
         ranking: defaultValues?.ranking ,
         keterangan: defaultValues?.keterangan ,
         no_urut_absen: defaultValues?.no_urut_absen ,
         nilai_rata_rata: defaultValues?.nilai_rata_rata ,
    },
  });

  // sinkronisasi jika parent mengubah defaultValues (mis. saat open with different record)
  useEffect(() => {
    if (defaultValues) {
      form.reset({   
        id: defaultValues?.id,
         siswa_id :defaultValues?.siswa_id,
      tahun_ajar_id:defaultValues?.tahun_ajar_id,
         kelas_id: defaultValues?.kelas_id,
         tanggal_masuk: defaultValues?.tanggal_masuk,
         tanggal_keluar: defaultValues?.tanggal_keluar,
         status_kelas: defaultValues?.status_kelas,
         semester: defaultValues?.semester,
         ranking: defaultValues?.ranking ,
         keterangan: defaultValues?.keterangan ,
         no_urut_absen: defaultValues?.no_urut_absen ,
         nilai_rata_rata: defaultValues?.nilai_rata_rata ,
         });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(defaultValues)]);

  const [isPending, setIsPending] = useState(false);

  const submit: SubmitHandler<KelasDetailSchema> = useCallback(
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
        if (notify) notify({ type: "success", message: "KelasDetail  berhasil disimpan." });
        if (onSuccess) onSuccess(page);
      };

      const handleError = (errors?: unknown) => {
        // map server errors to form errors when possible
       if (errors && typeof errors === "object" && !Array.isArray(errors)) {
          Object.entries(errors as Record<string, unknown>).forEach(([key, val]) => {
            const message = Array.isArray(val) ? (val as string[]).join(", ") : String(val ?? "Terjadi kesalahan.");
            console.log(message)
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
    form: UseFormReturn<KelasDetailSchema>;
    submit: (values: KelasDetailSchema) => void;
    isPending: boolean;
  };
}
