<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
// use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;
class User extends Authenticatable 
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles ;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }
      public function tahunAjars()
    {
        return $this->hasMany(TahunAjar::class, 'created_by');
    }

    /**
     * Get tahun ajars updated by this user
     */
    public function tahunAjarsUpdated()
    {
        return $this->hasMany(TahunAjar::class, 'updated_by');
    }

    /**
     * Get jurusans created by this user
     */
    public function jurusan()
    {
        return $this->hasMany(Jurusan::class, 'created_by');
    }

    /**
     * Get jurusans updated by this user
     */
    public function jurusansUpdated()
    {
        return $this->hasMany(Jurusan::class, 'updated_by');
    }

    /**
     * Get kelases created by this user
     */
    public function kelasesCreated()
    {
        return $this->hasMany(Kelas::class, 'created_by');
    }

    /**
     * Get kelases updated by this user
     */
    public function kelasesUpdated()
    {
        return $this->hasMany(Kelas::class, 'updated_by');
    }

    /**
     * Get siswas created by this user
     */
    public function siswasCreated()
    {
        return $this->hasMany(Siswa::class, 'created_by');
    }

    /**
     * Get siswas updated by this user
     */
    public function siswasUpdated()
    {
        return $this->hasMany(Siswa::class, 'updated_by');
    }

    /**
     * Get kelas details created by this user
     */
    public function kelasDetailsCreated()
    {
        return $this->hasMany(KelasDetail::class, 'created_by');
    }

    /**
     * Get kelas details updated by this user
     */
    public function kelasDetailsUpdated()
    {
        return $this->hasMany(KelasDetail::class, 'updated_by');
    }
}