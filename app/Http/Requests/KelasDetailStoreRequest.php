<?php

namespace App\Http\Requests;

use App\Enums\SemesterEnums;
use App\Enums\StatusKelasEnums;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class KelasDetailStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
       return [
            'siswa_id'        => ['required','integer','exists:siswas,id'],
            'kelas_id'        => ['required','integer','exists:kelas,id'],
            'tahun_ajar_id'   => ['required','integer','exists:tahun_ajars,id'],

            'tanggal_masuk'   => ['required','date'],
            'tanggal_keluar'  => ['nullable','date','after_or_equal:tanggal_masuk'],

            'status_kelas'    => ['required', Rule::in(StatusKelasEnums::values())],
            'semester'        => ['nullable', Rule::in(SemesterEnums::values())],

            'no_urut_absen'   => ['nullable','integer','min:1'],
            'nilai_rata_rata' => ['nullable','numeric','min:0','max:100'],
            'ranking'         => ['nullable','integer','min:1'],

            'keterangan'      => ['nullable','string','max:1000'],

            // Audit (opsional pada create)
            'created_by'      => ['nullable','integer','exists:users,id'],
            'updated_by'      => ['nullable','integer','exists:users,id'],
        ];
    }


    public function messages(): array
    {
        return [
            'siswa_id.required' => 'Siswa wajib dipilih.',
            'kelas_id.required' => 'Kelas wajib dipilih.',
            'tahun_ajar_id.required' => 'Tahun ajar wajib dipilih.',
            'tanggal_masuk.required' => 'Tanggal masuk wajib diisi.',
            'tanggal_keluar.after_or_equal' => 'Tanggal keluar harus sama atau setelah tanggal masuk.',
            'status_kelas.required' => 'Status kelas wajib dipilih.',
            'status_kelas.in' => 'Status kelas tidak valid.',
            'semester.in' => 'Semester tidak valid.',
            'nilai_rata_rata.numeric' => 'Nilai rata-rata harus berupa angka (0-100).',
            'no_urut_absen.integer' => 'No. urut absen harus berupa angka bulat.',
            'ranking.integer' => 'Ranking harus berupa angka bulat.',
        ];
    }
}
