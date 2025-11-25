<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TahunAjar extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'tahun_ajars';
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'kode_tahun_ajar',
        'nama_tahun_ajar',
        'tanggal_mulai',
        'tanggal_selesai',
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
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
    ];

    /**
     * Get the user who created this tahun ajar
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by')->withDefault();
    }

    /**
     * Get the user who last updated this tahun ajar
     */
    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by')->withDefault();
    }

    /**
     * Get kelases for this tahun ajar
     */
    public function kelases()
    {
        return $this->hasMany(Kelas::class, 'tahun_ajar_id');
    }

    /**
     * Get siswas who entered in this tahun ajar
     */
    public function siswas()
    {
        return $this->hasMany(Siswa::class, 'tahun_ajar_id');
    }

    /**
     * Get kelas details for this tahun ajar
     */
    public function kelasDetails()
    {
        return $this->hasMany(KelasDetail::class, 'tahun_ajar_id');
    }
}