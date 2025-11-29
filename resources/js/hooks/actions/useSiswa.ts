// src/hooks/useSiswaForm.ts
import { useState, useCallback, useEffect } from "react";
import { useForm, UseFormReturn, SubmitHandler } from "react-hook-form";
import { router } from "@inertiajs/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { siswaSchema, SiswaSchema } from "@/lib/validations/siswaValidate";

export type UseSiswaFormOptions = {
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
   * Jika mau update, pass full route including id, contoh: '/dashboard/siswa/12'
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
export function useSiswaForm(
  defaultValues?: Partial<SiswaSchema>,
  opts: UseSiswaFormOptions = {},
) {
  const { notify, onSuccess, onError, onFinish, closeSheet, route = "/dashboard/siswa", method = "post" } = opts;

  // form type diambil dari zod schema
  const form = useForm<SiswaSchema>({
    mode: "onSubmit",
    // cast to any to avoid duplicate react-hook-form resolver type conflicts across packages
    resolver: zodResolver(siswaSchema) as any,
    defaultValues: {
       id: defaultValues?.id ?? undefined,
    nisn: defaultValues?.nisn ?? "",
    nis: defaultValues?.nis ?? "",
    nama_lengkap: defaultValues?.nama_lengkap ?? "",

    jenis_kelamin: defaultValues?.jenis_kelamin ?? undefined,
    tempat_lahir: defaultValues?.tempat_lahir ?? "",
    asal_negara: defaultValues?.asal_negara ?? defaultValues?.tempat_lahir ?? "Indonesia",
    tanggal_lahir: defaultValues?.tanggal_lahir
      ? (defaultValues.tanggal_lahir instanceof Date ? defaultValues.tanggal_lahir : new Date(defaultValues.tanggal_lahir))
      : undefined,
    agama: defaultValues?.agama ?? "Islam",

    // ALAMAT
    alamat: defaultValues?.alamat ?? "",

    // ORANG TUA / WALI
    nama_ayah: defaultValues?.nama_ayah ?? "",
    nama_ibu: defaultValues?.nama_ibu ?? "",
    nama_wali: defaultValues?.nama_wali ?? "",

    // AKADEMIK
    tahun_ajar_id: typeof defaultValues?.tahun_ajar_id === "number" ? defaultValues.tahun_ajar_id : (defaultValues?.tahun_ajar_id ? Number(defaultValues.tahun_ajar_id) : undefined),
    asal_sekolah: defaultValues?.asal_sekolah ?? "",

    // OPTIONALS (string -> default "")
    rt: defaultValues?.rt ?? "",
    rw: defaultValues?.rw ?? "",
    kelurahan: defaultValues?.kelurahan ?? "",
    kecamatan: defaultValues?.kecamatan ?? "",
    kota: defaultValues?.kota ?? "",
    provinsi: defaultValues?.provinsi ?? "",
    kode_pos: defaultValues?.kode_pos ?? "",

    anak_ke: typeof defaultValues?.anak_ke === "number" ? defaultValues.anak_ke : (defaultValues?.anak_ke ? Number(defaultValues.anak_ke) : undefined),
    jumlah_saudara: typeof defaultValues?.jumlah_saudara === "number" ? defaultValues.jumlah_saudara : (defaultValues?.jumlah_saudara ? Number(defaultValues.jumlah_saudara) : undefined),

    telepon: defaultValues?.telepon ?? "",
    email: defaultValues?.email ?? "",

    pekerjaan_ayah: defaultValues?.pekerjaan_ayah ?? "",
    pendidikan_ayah: defaultValues?.pendidikan_ayah ?? "",
    telepon_ayah: defaultValues?.telepon_ayah ?? "",

    pekerjaan_ibu: defaultValues?.pekerjaan_ibu ?? "",
    pendidikan_ibu: defaultValues?.pendidikan_ibu ?? "",
    telepon_ibu: defaultValues?.telepon_ibu ?? "",

    hubungan_wali: defaultValues?.hubungan_wali ?? "",
    pekerjaan_wali: defaultValues?.pekerjaan_wali ?? "",
    telepon_wali: defaultValues?.telepon_wali ?? "",
    alamat_wali: defaultValues?.alamat_wali ?? "",

    jurusan_id: typeof defaultValues?.jurusan_id === "number" ? defaultValues.jurusan_id : (defaultValues?.jurusan_id ? Number(defaultValues.jurusan_id) : undefined),
    kelas_id: typeof defaultValues?.kelas_id === "number" ? defaultValues.kelas_id : (defaultValues?.kelas_id ? Number(defaultValues.kelas_id) : undefined),

    status: defaultValues?.status ?? undefined,
    keterangan: defaultValues?.keterangan ?? "",

    // FOTO & NESTED (biarkan apa adanya jika ada)
    foto: defaultValues?.foto ?? undefined,
    jurusan: defaultValues?.jurusan ?? undefined,
    kelas: defaultValues?.kelas ?? undefined,
    tahun_masuk: defaultValues?.tahun_masuk ?? undefined,

    // AUDIT — jangan diubah (ikut permintaanmu: kecualikan dari normalisasi)
    created_at: defaultValues?.created_at ?? undefined,
    updated_at: defaultValues?.updated_at ?? undefined,
    created_by: defaultValues?.created_by ?? undefined,
    updated_by: defaultValues?.updated_by ?? undefined,
    },
  });

  // sinkronisasi jika parent mengubah defaultValues (mis. saat open with different record)
  useEffect(() => {
    if (defaultValues) {
      form.reset({   
         id: defaultValues?.id ?? undefined,
    nisn: defaultValues?.nisn ?? "",
    nis: defaultValues?.nis ?? "",
    nama_lengkap: defaultValues?.nama_lengkap ?? "",

    jenis_kelamin: defaultValues?.jenis_kelamin ?? undefined,
    tempat_lahir: defaultValues?.tempat_lahir ?? "",
    asal_negara: defaultValues?.asal_negara ?? defaultValues?.tempat_lahir ?? "Indonesia",
    tanggal_lahir: defaultValues?.tanggal_lahir
      ? (defaultValues.tanggal_lahir instanceof Date ? defaultValues.tanggal_lahir : new Date(defaultValues.tanggal_lahir))
      : undefined,
    agama: defaultValues?.agama ?? "Islam",

    // ALAMAT
    alamat: defaultValues?.alamat ?? "",

    // ORANG TUA / WALI
    nama_ayah: defaultValues?.nama_ayah ?? "",
    nama_ibu: defaultValues?.nama_ibu ?? "",
    nama_wali: defaultValues?.nama_wali ?? "",

    // AKADEMIK
    tahun_ajar_id: typeof defaultValues?.tahun_ajar_id === "number" ? defaultValues.tahun_ajar_id : (defaultValues?.tahun_ajar_id ? Number(defaultValues.tahun_ajar_id) : undefined),
    asal_sekolah: defaultValues?.asal_sekolah ?? "",

    // OPTIONALS (string -> default "")
    rt: defaultValues?.rt ?? "",
    rw: defaultValues?.rw ?? "",
    kelurahan: defaultValues?.kelurahan ?? "",
    kecamatan: defaultValues?.kecamatan ?? "",
    kota: defaultValues?.kota ?? "",
    provinsi: defaultValues?.provinsi ?? "",
    kode_pos: defaultValues?.kode_pos ?? "",

    anak_ke: typeof defaultValues?.anak_ke === "number" ? defaultValues.anak_ke : (defaultValues?.anak_ke ? Number(defaultValues.anak_ke) : undefined),
    jumlah_saudara: typeof defaultValues?.jumlah_saudara === "number" ? defaultValues.jumlah_saudara : (defaultValues?.jumlah_saudara ? Number(defaultValues.jumlah_saudara) : undefined),

    telepon: defaultValues?.telepon ?? "",
    email: defaultValues?.email ?? "",

    pekerjaan_ayah: defaultValues?.pekerjaan_ayah ?? "",
    pendidikan_ayah: defaultValues?.pendidikan_ayah ?? "",
    telepon_ayah: defaultValues?.telepon_ayah ?? "",

    pekerjaan_ibu: defaultValues?.pekerjaan_ibu ?? "",
    pendidikan_ibu: defaultValues?.pendidikan_ibu ?? "",
    telepon_ibu: defaultValues?.telepon_ibu ?? "",

    hubungan_wali: defaultValues?.hubungan_wali ?? "",
    pekerjaan_wali: defaultValues?.pekerjaan_wali ?? "",
    telepon_wali: defaultValues?.telepon_wali ?? "",
    alamat_wali: defaultValues?.alamat_wali ?? "",

    jurusan_id: typeof defaultValues?.jurusan_id === "number" ? defaultValues.jurusan_id : (defaultValues?.jurusan_id ? Number(defaultValues.jurusan_id) : undefined),
    kelas_id: typeof defaultValues?.kelas_id === "number" ? defaultValues.kelas_id : (defaultValues?.kelas_id ? Number(defaultValues.kelas_id) : undefined),

    status: defaultValues?.status ?? undefined,
    keterangan: defaultValues?.keterangan ?? "",

    // FOTO & NESTED (biarkan apa adanya jika ada)
    foto: defaultValues?.foto ?? undefined,
    jurusan: defaultValues?.jurusan ?? undefined,
    kelas: defaultValues?.kelas ?? undefined,
    tahun_masuk: defaultValues?.tahun_masuk ?? undefined,

    // AUDIT — jangan diubah (ikut permintaanmu: kecualikan dari normalisasi)
    created_at: defaultValues?.created_at ?? undefined,
    updated_at: defaultValues?.updated_at ?? undefined,
    created_by: defaultValues?.created_by ?? undefined,
    updated_by: defaultValues?.updated_by ?? undefined, });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(defaultValues)]);

  useEffect(() => {
  const sub = form.watch((v) => console.debug("FORM WATCH:", v));
  return () => sub.unsubscribe?.();
}, []);

  const [isPending, setIsPending] = useState(false);

  const submit: SubmitHandler<SiswaSchema> = useCallback(
    (values) => {
      // clear previous errors
      console.log("SUBMIT FIRE", values);
      form.clearErrors();

      setIsPending(true);
          const formData = new FormData();
        
      // // Add all form fields
      Object.entries(values).forEach(([key, value]) => {
        if (key === "foto" && value) {
          // Handle foto field - extract the cropped blob
          const avatarData = value as any;
          if (avatarData?.file) {
            // Send the cropped file
            formData.append("foto", avatarData.file, avatarData.file.name);
            
            // Optional: Send crop data as JSON for backend reference
            formData.append("crop_data", JSON.stringify({
              x: avatarData.cropData.x,
              y: avatarData.cropData.y,
              width: avatarData.cropData.width,
              height: avatarData.cropData.height,
            }));
          }
        } else if (value !== null && value !== undefined && value !== "") {
          // Handle tanggal_lahir as date
          if (key === "tanggal_lahir" && value instanceof Date) {
            formData.append(key, value.toISOString().split('T')[0]);
          } else {
            formData.append(key, String(value));
          }
        }
      }); 
      const payload = formData;
      console.log("Raw payload:", values);
      const handleSuccess = (page?: unknown) => {
        try {
          form.reset();
        } catch {
          /* ignore */
        }

        if (typeof closeSheet === "function") closeSheet();
        if (notify) notify({ type: "success", message: "Siswa  berhasil disimpan." });
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
    form: UseFormReturn<SiswaSchema>;
    submit: (values: SiswaSchema) => void;
    isPending: boolean;
  };
}
