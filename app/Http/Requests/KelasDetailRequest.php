<?php

namespace App\Http\Requests\KelasDetail;

use App\Enums\SemesterEnums;
use App\Enums\StatusKelasEnums;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreKelasDetailRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'siswa_id' => [
                'required',
                'exists:siswas,id',
                // Validasi unik untuk kombinasi siswa + kelas + tahun ajar yang aktif
                Rule::unique('kelas_details')->where(function ($query) {
                    return $query->where('siswa_id', $this->siswa_id)
                        ->where('kelas_id', $this->kelas_id)
                        ->where('tahun_ajar_id', $this->tahun_ajar_id)
                        ->where('status_kelas', StatusKelasEnums::Aktif->value)
                        ->whereNull('deleted_at');
                }),
            ],
            'kelas_id' => 'required|exists:kelas,id',
            'tahun_ajar_id' => 'required|exists:tahun_ajars,id',
            'tanggal_masuk' => 'required|date',
            'tanggal_keluar' => 'nullable|date|after:tanggal_masuk',
            'status_kelas' => [
                'nullable',
                Rule::in(StatusKelasEnums::values()),
            ],
            'semester' => [
                'nullable',
                Rule::in(SemesterEnums::values()),
            ],
            'no_urut_absen' => 'nullable|integer|min:1|max:100',
            'nilai_rata_rata' => 'nullable|numeric|min:0|max:100',
            'ranking' => 'nullable|integer|min:1',
            'keterangan' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'siswa_id.required' => 'Siswa wajib dipilih',
            'siswa_id.exists' => 'Siswa tidak ditemukan',
            'siswa_id.unique' => 'Siswa sudah terdaftar di kelas dan tahun ajar ini',
            'kelas_id.required' => 'Kelas wajib dipilih',
            'kelas_id.exists' => 'Kelas tidak ditemukan',
            'tahun_ajar_id.required' => 'Tahun ajar wajib dipilih',
            'tahun_ajar_id.exists' => 'Tahun ajar tidak ditemukan',
            'tanggal_masuk.required' => 'Tanggal masuk wajib diisi',
            'tanggal_keluar.after' => 'Tanggal keluar harus setelah tanggal masuk',
            'status_kelas.in' => 'Status kelas tidak valid',
            'semester.in' => 'Semester tidak valid',
            'no_urut_absen.min' => 'Nomor absen minimal 1',
            'no_urut_absen.max' => 'Nomor absen maksimal 100',
            'nilai_rata_rata.min' => 'Nilai rata-rata minimal 0',
            'nilai_rata_rata.max' => 'Nilai rata-rata maksimal 100',
            'ranking.min' => 'Ranking minimal 1',
        ];
    }
}

class UpdateKelasDetailRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $kelasDetailId = $this->route('kelas_detail')->id ?? $this->route('kelasDetail')->id;

        return [
            'siswa_id' => [
                'required',
                'exists:siswas,id',
                Rule::unique('kelas_details')->where(function ($query) {
                    return $query->where('siswa_id', $this->siswa_id)
                        ->where('kelas_id', $this->kelas_id)
                        ->where('tahun_ajar_id', $this->tahun_ajar_id)
                        ->where('status_kelas', StatusKelasEnums::Aktif->value)
                        ->whereNull('deleted_at');
                })->ignore($kelasDetailId),
            ],
            'kelas_id' => 'required|exists:kelas,id',
            'tahun_ajar_id' => 'required|exists:tahun_ajars,id',
            'tanggal_masuk' => 'required|date',
            'tanggal_keluar' => 'nullable|date|after:tanggal_masuk',
            'status_kelas' => [
                'nullable',
                Rule::in(StatusKelasEnums::values()),
            ],
            'semester' => [
                'nullable',
                Rule::in(SemesterEnums::values()),
            ],
            'no_urut_absen' => 'nullable|integer|min:1|max:100',
            'nilai_rata_rata' => 'nullable|numeric|min:0|max:100',
            'ranking' => 'nullable|integer|min:1',
            'keterangan' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'siswa_id.required' => 'Siswa wajib dipilih',
            'siswa_id.exists' => 'Siswa tidak ditemukan',
            'siswa_id.unique' => 'Siswa sudah terdaftar di kelas dan tahun ajar ini',
            'kelas_id.required' => 'Kelas wajib dipilih',
            'kelas_id.exists' => 'Kelas tidak ditemukan',
            'tahun_ajar_id.required' => 'Tahun ajar wajib dipilih',
            'tahun_ajar_id.exists' => 'Tahun ajar tidak ditemukan',
            'tanggal_masuk.required' => 'Tanggal masuk wajib diisi',
            'tanggal_keluar.after' => 'Tanggal keluar harus setelah tanggal masuk',
            'status_kelas.in' => 'Status kelas tidak valid',
            'semester.in' => 'Semester tidak valid',
            'no_urut_absen.min' => 'Nomor absen minimal 1',
            'no_urut_absen.max' => 'Nomor absen maksimal 100',
            'nilai_rata_rata.min' => 'Nilai rata-rata minimal 0',
            'nilai_rata_rata.max' => 'Nilai rata-rata maksimal 100',
            'ranking.min' => 'Ranking minimal 1',
        ];
    }
}