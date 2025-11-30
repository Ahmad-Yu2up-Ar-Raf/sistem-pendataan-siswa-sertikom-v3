// src/hooks/useJurusanForm.ts
import { useState, useCallback, useEffect } from "react";
import { useForm, UseFormReturn, SubmitHandler } from "react-hook-form";
import { router } from "@inertiajs/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { jurusanSchema, JurusanSchema } from "@/lib/validations/app/jurusanValidate";

export type UseJurusanFormOptions = {
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
   * Jika mau update, pass full route including id, contoh: '/dashboard/jurusan/12'
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
export function useJurusanForm(
  defaultValues?: Partial<JurusanSchema>,
  opts: UseJurusanFormOptions = {},
) {
  const { notify, onSuccess, onError, onFinish, closeSheet, route = "/dashboard/jurusan", method = "post" } = opts;

  // form type diambil dari zod schema
  const form = useForm<JurusanSchema>({
    mode: "onSubmit",
    resolver: zodResolver(jurusanSchema),
    defaultValues: {
      id: defaultValues?.id ?? undefined,

    kode_jurusan: defaultValues?.kode_jurusan ?? "",
    nama_jurusan: defaultValues?.nama_jurusan ?? "",

    // deskripsi schema = optional & nullable -> pakai null bila tidak ada
    deskripsi: defaultValues?.deskripsi ?? null,

    // status harus sesuai enum; biarkan undefined kalau tidak ada supaya validator memaksa input
    status: defaultValues?.status ?? undefined,

    // audit fields (dibiarkan apa adanya)
    created_at: defaultValues?.created_at ?? undefined,
    updated_at: defaultValues?.updated_at ?? undefined,
    created_by: defaultValues?.created_by ?? undefined,
    updated_by: defaultValues?.updated_by ?? undefined,

    // computed counts (backend) -> jangan paksa jadi 0, biarkan undefined kalau tidak dikirim
    kelases_count:
      typeof defaultValues?.kelases_count === "number"
        ? defaultValues.kelases_count
        : undefined,
    siswas_count:
      typeof defaultValues?.siswas_count === "number"
        ? defaultValues.siswas_count
        : undefined,
    },
  });

  // sinkronisasi jika parent mengubah defaultValues (mis. saat open with different record)
  useEffect(() => {
    if (defaultValues) {
      form.reset({    id: defaultValues?.id ?? undefined,

    kode_jurusan: defaultValues?.kode_jurusan ?? "",
    nama_jurusan: defaultValues?.nama_jurusan ?? "",

    // deskripsi schema = optional & nullable -> pakai null bila tidak ada
    deskripsi: defaultValues?.deskripsi ?? null,

    // status harus sesuai enum; biarkan undefined kalau tidak ada supaya validator memaksa input
    status: defaultValues?.status ?? undefined,

    // audit fields (dibiarkan apa adanya)
    created_at: defaultValues?.created_at ?? undefined,
    updated_at: defaultValues?.updated_at ?? undefined,
    created_by: defaultValues?.created_by ?? undefined,
    updated_by: defaultValues?.updated_by ?? undefined,

    // computed counts (backend) -> jangan paksa jadi 0, biarkan undefined kalau tidak dikirim
    kelases_count:
      typeof defaultValues?.kelases_count === "number"
        ? defaultValues.kelases_count
        : undefined,
    siswas_count:
      typeof defaultValues?.siswas_count === "number"
        ? defaultValues.siswas_count
        : undefined, });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(defaultValues)]);

  const [isPending, setIsPending] = useState(false);

  const submit: SubmitHandler<JurusanSchema> = useCallback(
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
        if (notify) notify({ type: "success", message: "Jurusan  berhasil disimpan." });
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
    form: UseFormReturn<JurusanSchema>;
    submit: (values: JurusanSchema) => void;
    isPending: boolean;
  };
}
