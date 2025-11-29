<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Siswa extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'siswas';
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nisn',
        'nis',
        'nama_lengkap',
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'agama',
        'anak_ke',
        'asal_negara',
        'jumlah_saudara',
        'alamat',
        'rt',
        'rw',
        'kelurahan',
        'kecamatan',
        'kota',
        'provinsi',
        'kode_pos',
        'telepon',
        'email',
        'nama_ayah',
        'pekerjaan_ayah',
        'pendidikan_ayah',
        'telepon_ayah',
        'nama_ibu',
        'pekerjaan_ibu',
        'pendidikan_ibu',
        'telepon_ibu',
        'nama_wali',
        'hubungan_wali',
        'pekerjaan_wali',
        'telepon_wali',
        'alamat_wali',
        'crop_data',
        'jurusan_id',
        'kelas_id',
        'tahun_ajar_id',
        'asal_sekolah',
        'foto',
        'status',
        'keterangan',
        'created_by',
        'updated_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tanggal_lahir' => 'date',
    ];

    /**
     * Get the jurusan for this siswa
     */
    public function jurusan()
    {
        return $this->belongsTo(Jurusan::class, 'jurusan_id')->withDefault();
    }
    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'kelas_id')->withDefault();
    }

    /**
     * Get the tahun ajar when siswa entered
     */
    public function tahunMasuk()
    {
        return $this->belongsTo(TahunAjar::class, 'tahun_ajar_id')->withDefault();
    }

    /**
     * Get the user who created this siswa
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by')->withDefault();
    }

    /**
     * Get the user who last updated this siswa
     */
    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by')->withDefault();
    }

    /**
     * Get all kelas details (history) for this siswa
     */
    public function kelasDetails()
    {
        return $this->hasMany(KelasDetail::class, 'siswa_id');
    }

    /**
     * Get current active kelas detail for this siswa
     */
    public function kelasDetailAktif()
    {
        return $this->hasOne(KelasDetail::class, 'siswa_id')->where('status_kelas', 'aktif')->latestOfMany();
    }

    /**
     * Get current kelas through active kelas detail
     */
    public function kelasAktif()
    {
        return $this->hasOneThrough(
            Kelas::class,
            KelasDetail::class,
            'siswa_id', // Foreign key on kelas_details table
            'id', // Foreign key on kelases table
            'id', // Local key on siswas table
            'kelas_id' // Local key on kelas_details table
        )->where('kelas_details.status_kelas', 'aktif');
    }

    /**
     * Get all kelases through kelas_details
     */
    public function kelases()
    {
        return $this->belongsToMany(Kelas::class, 'kelas_details', 'siswa_id', 'kelas_id')
            ->withPivot(['tanggal_masuk', 'tanggal_keluar', 'status_kelas', 'semester', 'no_urut_absen', 'nilai_rata_rata', 'ranking', 'keterangan'])
            ->withTimestamps();
    }



       /* ---------- scopes ---------- */

  
  
}