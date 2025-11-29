// src/hooks/useTahunAjarForm.ts
import { useState, useCallback, useEffect } from "react";
import { useForm, UseFormReturn, SubmitHandler } from "react-hook-form";
import { router } from "@inertiajs/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { tahunAjarSchema, TahunAjarSchema } from "@/lib/validations/tahunAjarValidate";

export type UseTahunAjarFormOptions = {
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
   * Jika mau update, pass full route including id, contoh: '/dashboard/tahun_ajar/12'
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
export function useTahunAjarForm(
  defaultValues?: Partial<TahunAjarSchema>,
  opts: UseTahunAjarFormOptions = {},
) {
  const { notify, onSuccess, onError, onFinish, closeSheet, route = "/dashboard/tahun_ajar", method = "post" } = opts;

  // form type diambil dari zod schema
  const form = useForm<TahunAjarSchema>({
    mode: "onSubmit",
    resolver: zodResolver(tahunAjarSchema)  as any, //,
    defaultValues: {
        id: defaultValues?.id ?? undefined,

    kode_tahun_ajar: defaultValues?.kode_tahun_ajar,
    nama_tahun_ajar: defaultValues?.nama_tahun_ajar ?? "",

    tanggal_mulai: defaultValues?.tanggal_mulai
      ? new Date(defaultValues.tanggal_mulai)
      : undefined,

    tanggal_selesai: defaultValues?.tanggal_selesai
      ? new Date(defaultValues.tanggal_selesai)
      : undefined,

    status: defaultValues?.status ?? undefined,

    // audit — tidak di-normalisasi sesuai instruksi
    created_at: defaultValues?.created_at ?? undefined,
    updated_at: defaultValues?.updated_at ?? undefined,
    created_by: defaultValues?.created_by ?? undefined,
    updated_by: defaultValues?.updated_by ?? undefined,

    // backend computed
    kelases_count: defaultValues?.kelases_count ?? undefined,
    siswas_count: defaultValues?.siswas_count ?? undefined,
    },
  });

  // sinkronisasi jika parent mengubah defaultValues (mis. saat open with different record)
  useEffect(() => {
    if (defaultValues) {
      form.reset({    id: defaultValues?.id ?? undefined,

    kode_tahun_ajar: defaultValues?.kode_tahun_ajar,
    nama_tahun_ajar: defaultValues?.nama_tahun_ajar ?? "",

    tanggal_mulai: defaultValues?.tanggal_mulai
      ? new Date(defaultValues.tanggal_mulai)
      : undefined,

    tanggal_selesai: defaultValues?.tanggal_selesai
      ? new Date(defaultValues.tanggal_selesai)
      : undefined,

    status: defaultValues?.status ?? undefined,

    // audit — tidak di-normalisasi sesuai instruksi
    created_at: defaultValues?.created_at ?? undefined,
    updated_at: defaultValues?.updated_at ?? undefined,
    created_by: defaultValues?.created_by ?? undefined,
    updated_by: defaultValues?.updated_by ?? undefined,

    // backend computed
    kelases_count: defaultValues?.kelases_count ?? undefined,
    siswas_count: defaultValues?.siswas_count ?? undefined, });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(defaultValues)]);

  const [isPending, setIsPending] = useState(false);

  const submit: SubmitHandler<TahunAjarSchema> = useCallback(
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
        if (notify) notify({ type: "success", message: "Tahun ajar berhasil disimpan." });
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
    form: UseFormReturn<TahunAjarSchema>;
    submit: (values: TahunAjarSchema) => void;
    isPending: boolean;
  };
}
