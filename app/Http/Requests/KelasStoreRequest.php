<?php

namespace App\Http\Requests;

use App\Enums\StatusEnums;
use App\Enums\TingkatEnums;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class KelasStoreRequest extends FormRequest
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
            'nama_kelas' => 'required|string|max:100',
            'tingkat' => [
                'required',
                Rule::in(TingkatEnums::values()),
            ],
            'jurusan_id' => 'required|exists:jurusans,id',
            'tahun_ajar_id' => 'required|exists:tahun_ajars,id',
            'kapasitas_maksimal' => 'nullable|integer|min:1|max:100',
            'wali_kelas' => 'nullable|string|max:191',
            'ruangan' => 'nullable|string|max:50',
            'status' => [
                'nullable',
                Rule::in(StatusEnums::values()),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'nama_kelas.required' => 'Nama kelas wajib diisi',
            'nama_kelas.max' => 'Nama kelas maksimal 100 karakter',
            'tingkat.required' => 'Tingkat wajib dipilih',
            'tingkat.in' => 'Tingkat tidak valid',
            'jurusan_id.required' => 'Jurusan wajib dipilih',
            'jurusan_id.exists' => 'Jurusan tidak ditemukan',
            'tahun_ajar_id.required' => 'Tahun ajar wajib dipilih',
            'tahun_ajar_id.exists' => 'Tahun ajar tidak ditemukan',
            'kapasitas_maksimal.integer' => 'Kapasitas maksimal harus berupa angka',
            'kapasitas_maksimal.min' => 'Kapasitas maksimal minimal 1',
            'kapasitas_maksimal.max' => 'Kapasitas maksimal maksimal 100',
            'wali_kelas.max' => 'Wali kelas maksimal 191 karakter',
            'ruangan.max' => 'Ruangan maksimal 50 karakter',
            'status.in' => 'Status tidak valid',
        ];
    }
}
