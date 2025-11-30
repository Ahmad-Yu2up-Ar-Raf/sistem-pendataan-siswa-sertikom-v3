<?php

namespace App\Http\Requests;

use App\Enums\AgamaEnums;
use App\Enums\JenisKelaminEnums;
use App\Enums\StatusSiswaEnums;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SiswaStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Data Identitas
            'nisn' => 'required|string|max:20|unique:siswas,nisn',
            'nis' => 'nullable|string|max:20|unique:siswas,nis',
            'nama_lengkap' => 'required|string|max:191',
            'jenis_kelamin' => ['required', Rule::in(JenisKelaminEnums::values())],
            'tempat_lahir' => 'required|string|max:100',
            'asal_negara' => 'required|string|max:100',
            'tanggal_lahir' => 'required|date|before:today',
            'agama' => ['required', Rule::in(AgamaEnums::values())],
            'anak_ke' => 'nullable|integer|min:1|max:20',
            'jumlah_saudara' => 'nullable|integer|min:0|max:20',

            // Alamat
            'alamat' => 'required|string|max:500',
            'rt' => 'nullable|string|max:5',
            'rw' => 'nullable|string|max:5',
            'kelurahan' => 'nullable|string|max:100',
            'kecamatan' => 'nullable|string|max:100',
            'kota' => 'nullable|string|max:100',
            'provinsi' => 'nullable|string|max:100',
            'kode_pos' => 'nullable|string|max:10',

            // Kontak
            'telepon' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:191|unique:siswas,email',

            // Data Orang Tua
            'nama_ayah' => 'required|string|max:191',
            'pekerjaan_ayah' => 'nullable|string|max:100',
            'pendidikan_ayah' => 'nullable|string|max:50',
            'telepon_ayah' => 'nullable|string|max:20',
            
            'nama_ibu' => 'required|string|max:191',
            'pekerjaan_ibu' => 'nullable|string|max:100',
            'pendidikan_ibu' => 'nullable|string|max:50',
            'telepon_ibu' => 'nullable|string|max:20',

            // Data Wali
            'nama_wali' => 'nullable|string|max:191',
            'hubungan_wali' => 'nullable|string|max:50',
            'pekerjaan_wali' => 'nullable|string|max:100',
            'telepon_wali' => 'nullable|string|max:20',
            'alamat_wali' => 'nullable|string|max:500',

            // Data Akademik
            'jurusan_id' => 'required|exists:jurusans,id',
            'kelas_id' => 'required|exists:kelas,id',
            'tahun_ajar_id' => 'required|exists:tahun_ajars,id',
            'asal_sekolah' => 'nullable|string|max:191',

            // Status & Media
            'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048', // Cropped file (main)
            'foto_original' => 'nullable|image|mimes:jpg,jpeg,png|max:5120', // Original file (up to 5MB)
            'foto_crop_data' => 'nullable|string', // JSON string of crop metadata
            
            'status' => ['nullable', Rule::in(StatusSiswaEnums::values())],
            'keterangan' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'nisn.required' => 'NISN wajib diisi',
            'nisn.unique' => 'NISN sudah terdaftar',
            'nis.unique' => 'NIS sudah terdaftar',
            'nama_lengkap.required' => 'Nama lengkap wajib diisi',
            'jenis_kelamin.required' => 'Jenis kelamin wajib dipilih',
            'tempat_lahir.required' => 'Tempat lahir wajib diisi',
            'asal_negara.required' => 'Asal negara wajib diisi',
            'tanggal_lahir.required' => 'Tanggal lahir wajib diisi',
            'tanggal_lahir.before' => 'Tanggal lahir harus sebelum hari ini',
            'agama.required' => 'Agama wajib dipilih',
            'alamat.required' => 'Alamat wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah terdaftar',
            'nama_ayah.required' => 'Nama ayah wajib diisi',
            'nama_ibu.required' => 'Nama ibu wajib diisi',
            'foto.image' => 'File harus berupa gambar',
            'foto.mimes' => 'Format gambar harus JPG, JPEG, atau PNG',
            'foto.max' => 'Ukuran gambar maksimal 2MB',
            'foto_original.max' => 'Ukuran file original maksimal 5MB',
        ];
    }
}