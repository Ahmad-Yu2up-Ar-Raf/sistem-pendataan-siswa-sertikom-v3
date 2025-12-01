<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Siswa extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'siswas';

    protected $fillable = [
        'nisn', 'nis', 'nama_lengkap', 'jenis_kelamin',  
        'tanggal_lahir', 'agama', 'anak_ke', 'jumlah_saudara',
        'alamat', 'rt', 'rw', 'kelurahan', 'kecamatan', 'kota', 'provinsi', 'kode_pos',
        'telepon', 'email',
        'nama_ayah', 'pekerjaan_ayah', 'pendidikan_ayah', 'telepon_ayah',
        'nama_ibu', 'pekerjaan_ibu', 'pendidikan_ibu', 'telepon_ibu',
        'nama_wali', 'hubungan_wali', 'pekerjaan_wali', 'telepon_wali', 'alamat_wali',
        'jurusan_id', 'kelas_id', 'tahun_ajar_id', 'asal_sekolah',
        'foto', 'raw_foto', 'status', 'keterangan',
        'created_by', 'updated_by',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'raw_foto' => 'array',  // ← IMPORTANT: Cast JSON to array automatically
    ];

    // Relations
    public function jurusan()
    {
        return $this->belongsTo(Jurusan::class, 'jurusan_id')->withDefault();
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'kelas_id')->withDefault();
    }

    public function tahunMasuk()
    {
        return $this->belongsTo(TahunAjar::class, 'tahun_ajar_id')->withDefault();
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by')->withDefault();
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by')->withDefault();
    }

    public function kelasDetails()
    {
        return $this->hasMany(KelasDetail::class, 'siswa_id');
    }

    public function kelasDetailAktif()
    {
        return $this->hasOne(KelasDetail::class, 'siswa_id')
            ->where('status_kelas', 'aktif')
            ->latestOfMany();
    }

    public function kelasAktif()
    {
        return $this->hasOneThrough(
            Kelas::class,
            KelasDetail::class,
            'siswa_id',
            'id',
            'id',
            'kelas_id'
        )->where('kelas_details.status_kelas', 'aktif');
    }

    public function kelases()
    {
        return $this->belongsToMany(Kelas::class, 'kelas_details', 'siswa_id', 'kelas_id')
            ->withPivot([
                'tanggal_masuk', 'tanggal_keluar', 'status_kelas',
                'semester', 'no_urut_absen', 'nilai_rata_rata', 'ranking', 'keterangan'
            ])
            ->withTimestamps();
    }
}