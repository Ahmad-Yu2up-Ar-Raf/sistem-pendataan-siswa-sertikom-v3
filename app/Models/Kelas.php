<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kelas extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */

    protected $table = 'kelas';
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama_kelas',
        'tingkat',
        'jurusan_id',
        'tahun_ajar_id',
        'kapasitas_maksimal',
        'wali_kelas',
        'ruangan',
        'status',
        'created_by',
        'updated_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        //
    ];

    /**
     * Get the jurusan for this kelas
     */
    public function jurusan()
    {
        return $this->belongsTo(Jurusan::class, 'jurusan_id');
    }

    /**
     * Get the tahun ajar for this kelas
     */
    public function tahunAjar()
    {
        return $this->belongsTo(TahunAjar::class, 'tahun_ajar_id');
    }

    /**
     * Get the user who created this kelas
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by')->withDefault();
    }

    /**
     * Get the user who last updated this kelas
     */
    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by')->withDefault();
    }

    /**
     * Get kelas details (history) for this kelas
     */
    public function kelasDetails()
    {
        return $this->hasMany(KelasDetail::class, 'kelas_id');
    }
    public function siswa()
    {
        return $this->hasMany(Siswa::class, 'kelas_id');
    }

    /**
     * Get active siswas in this kelas through kelas_details
     */
    public function siswasAktif()
    {
        return $this->belongsToMany(Siswa::class, 'kelas_details', 'kelas_id', 'siswa_id')
            ->wherePivot('status_kelas', 'aktif')
            ->withPivot(['tanggal_masuk', 'tanggal_keluar', 'status_kelas', 'semester', 'no_urut_absen', 'nilai_rata_rata', 'ranking', 'keterangan'])
            ->withTimestamps();
    }

    /**
     * Get all siswas ever in this kelas through kelas_details
     */
    // public function siswas()
    // {
    //     return $this->belongsToMany(Siswa::class, 'kelas_details', 'kelas_id', 'siswa_id')
    //         ->withPivot(['tanggal_masuk', 'tanggal_keluar', 'status_kelas', 'semester', 'no_urut_absen', 'nilai_rata_rata', 'ranking', 'keterangan'])
    //         ->withTimestamps();
    // }
}