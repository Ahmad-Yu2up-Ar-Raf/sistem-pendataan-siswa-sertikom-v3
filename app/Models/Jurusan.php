<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Jurusan extends Model
{
    use HasFactory, SoftDeletes;


     protected $table = 'jurusans';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'kode_jurusan',
        'nama_jurusan',
        'deskripsi',
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
     * Get the user who created this jurusan
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by')->withDefault();
    }

    /**
     * Get the user who last updated this jurusan
     */
    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by')->withDefault();
    }

    /**
     * Get kelases for this jurusan
     */
    public function kelases()
    {
        return $this->hasMany(Kelas::class, 'jurusan_id');
    }

    /**
     * Get siswas for this jurusan
     */
    public function siswas()
    {
        return $this->hasMany(Siswa::class, 'jurusan_id');
    }
}