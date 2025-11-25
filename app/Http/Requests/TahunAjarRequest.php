<?php

namespace App\Http\Requests;

use App\Enums\StatusEnums;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTahunAjarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'kode_tahun_ajar' => 'required|string|max:20|unique:tahun_ajars,kode_tahun_ajar',
            'nama_tahun_ajar' => 'required|string|max:100',
            'tanggal_mulai' => 'required|date|before:tanggal_selesai',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
            'status' => [
                'nullable',
                Rule::in(StatusEnums::values()),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'kode_tahun_ajar.required' => 'Kode tahun ajar wajib diisi',
            'kode_tahun_ajar.unique' => 'Kode tahun ajar sudah digunakan',
            'kode_tahun_ajar.max' => 'Kode tahun ajar maksimal 20 karakter',
            'nama_tahun_ajar.required' => 'Nama tahun ajar wajib diisi',
            'nama_tahun_ajar.max' => 'Nama tahun ajar maksimal 100 karakter',
            'tanggal_mulai.required' => 'Tanggal mulai wajib diisi',
            'tanggal_mulai.before' => 'Tanggal mulai harus sebelum tanggal selesai',
            'tanggal_selesai.required' => 'Tanggal selesai wajib diisi',
            'tanggal_selesai.after' => 'Tanggal selesai harus setelah tanggal mulai',
            'status.in' => 'Status tidak valid',
        ];
    }
}




class UpdateTahunAjarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $tahunAjarId = $this->route('tahun_ajar')->id ?? $this->route('tahunAjar')->id;

        return [
            'kode_tahun_ajar' => [
                'required',
                'string',
                'max:20',
                Rule::unique('tahun_ajars', 'kode_tahun_ajar')->ignore($tahunAjarId),
            ],
            'nama_tahun_ajar' => 'required|string|max:100',
            'tanggal_mulai' => 'required|date|before:tanggal_selesai',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
            'status' => [
                'nullable',
                Rule::in(StatusEnums::values()),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'kode_tahun_ajar.required' => 'Kode tahun ajar wajib diisi',
            'kode_tahun_ajar.unique' => 'Kode tahun ajar sudah digunakan',
            'kode_tahun_ajar.max' => 'Kode tahun ajar maksimal 20 karakter',
            'nama_tahun_ajar.required' => 'Nama tahun ajar wajib diisi',
            'nama_tahun_ajar.max' => 'Nama tahun ajar maksimal 100 karakter',
            'tanggal_mulai.required' => 'Tanggal mulai wajib diisi',
            'tanggal_mulai.before' => 'Tanggal mulai harus sebelum tanggal selesai',
            'tanggal_selesai.required' => 'Tanggal selesai wajib diisi',
            'tanggal_selesai.after' => 'Tanggal selesai harus setelah tanggal mulai',
            'status.in' => 'Status tidak valid',
        ];
    }
}