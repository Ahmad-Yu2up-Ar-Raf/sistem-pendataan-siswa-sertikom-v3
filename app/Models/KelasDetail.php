<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class KelasDetail extends Model
{
    use HasFactory, SoftDeletes;


    protected $table = 'kelas_details';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'siswa_id',
        'kelas_id',
        'tahun_ajar_id',
        'tanggal_masuk',
        'tanggal_keluar',
        'status_kelas',
        'semester',
        'no_urut_absen',
        'nilai_rata_rata',
        'ranking',
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
        'tanggal_masuk' => 'date',
        'tanggal_keluar' => 'date',
        'nilai_rata_rata' => 'decimal:2',
    ];

    /**
     * Get the siswa for this kelas detail
     */
    public function siswa()
    {
        return $this->belongsTo(Siswa::class, 'siswa_id');
    }

    /**
     * Get the kelas for this kelas detail
     */
    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'kelas_id');
    }

    /**
     * Get the tahun ajar for this kelas detail
     */
    public function tahunAjar()
    {
        return $this->belongsTo(TahunAjar::class, 'tahun_ajar_id');
    }

    /**
     * Get the user who created this kelas detail
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by')->withDefault();
    }

    /**
     * Get the user who last updated this kelas detail
     */
    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by')->withDefault();
    }

    /**
     * Scope to get only active kelas details
     */
    public function scopeAktif($query)
    {
        return $query->where('status_kelas', 'aktif');
    }

    /**
     * Scope to get kelas details by tahun ajar
     */
    public function scopeByTahunAjar($query, $tahunAjarId)
    {
        return $query->where('tahun_ajar_id', $tahunAjarId);
    }

    /**
     * Scope to get kelas details by kelas
     */
    public function scopeByKelas($query, $kelasId)
    {
        return $query->where('kelas_id', $kelasId);
    }
}