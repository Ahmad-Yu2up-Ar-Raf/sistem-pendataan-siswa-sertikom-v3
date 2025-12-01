<?php

namespace App\Http\Requests;

use App\Enums\SemesterEnums;
use App\Enums\StatusEnums;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class KelasDetailUpdateStore extends FormRequest
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
          $id = $this->route('kelas_detail')?->id ?? null;

        return [
            'siswa_id'        => ['required','integer','exists:siswas,id'],
            'kelas_id'        => ['required','integer','exists:kelas,id'],
            'tahun_ajar_id'   => ['required','integer','exists:tahun_ajars,id'],

            'tanggal_masuk'   => ['required','date'],
            'tanggal_keluar'  => ['nullable','date','after_or_equal:tanggal_masuk'],

            'status_kelas'    => ['required', Rule::in(StatusEnums::values())],
            'semester'        => ['nullable', Rule::in(SemesterEnums::values())],

            'no_urut_absen'   => ['nullable','integer','min:1'],
            'nilai_rata_rata' => ['nullable','numeric','min:0','max:100'],
            'ranking'         => ['nullable','integer','min:1'],

            'keterangan'      => ['nullable','string','max:1000'],

            // Audit - boleh tetap nullable
            'created_by'      => ['nullable','integer','exists:users,id'],
            'updated_by'      => ['nullable','integer','exists:users,id'],
        ];
    }
       public function messages(): array
    {
        return (new KelasDetailStoreRequest())->messages();
    }
}
