<?php

namespace App\Http\Requests;

use App\Enums\StatusEnums;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JurusanUpdateRequest extends FormRequest
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
        $jurusanId = $this->route('jurusan')->id ?? $this->route('jurusans')->id;

        return [
            'kode_jurusan' => [
                'required',
                'string',
                'max:20',
                Rule::unique('jurusans', 'kode_jurusan')->ignore($jurusanId),
            ],
            'nama_jurusan' => 'required|string|max:191',
            'deskripsi' => 'nullable|string|max:1000',
            'status' => [
                'nullable',
                Rule::in(StatusEnums::values()),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'kode_jurusan.required' => 'Kode jurusan wajib diisi',
            'kode_jurusan.unique' => 'Kode jurusan sudah digunakan',
            'kode_jurusan.max' => 'Kode jurusan maksimal 20 karakter',
            'nama_jurusan.required' => 'Nama jurusan wajib diisi',
            'nama_jurusan.max' => 'Nama jurusan maksimal 191 karakter',
            'deskripsi.max' => 'Deskripsi maksimal 1000 karakter',
            'status.in' => 'Status tidak valid',
        ];
    }
}
