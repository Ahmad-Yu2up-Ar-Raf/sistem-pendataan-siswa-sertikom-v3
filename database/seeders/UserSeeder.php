<?php

namespace Database\Seeders;

use App\Enums\RoleEnums;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\TahunAjar;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $USERS_COUNT = 6;
        $TAHUN_PER_USER = 2;
        $KELAS_PER_TAHUN = 4;
        $SISWA_PER_KELAS = 10;

        DB::transaction(function () use ($USERS_COUNT, $TAHUN_PER_USER, $KELAS_PER_TAHUN, $SISWA_PER_KELAS) {
            Schema::disableForeignKeyConstraints();

            User::factory()
                ->count($USERS_COUNT)
                ->has(
                    TahunAjar::factory()
                        ->count($TAHUN_PER_USER)
                        ->has(
                            Kelas::factory()
                                ->count($KELAS_PER_TAHUN)
                                ->has(
                                    Siswa::factory()->count($SISWA_PER_KELAS),
                                    'siswa'
                                ),
                            'kelases'
                        ),
                    'tahunAjars'
                )
                ->create()
                ->each(function ($user) {
                    try {
                        // PENTING: Cek dulu role-nya ada gak
                        $roleName = RoleEnums::SuperAdmin->value;
                        
                        // Verify role exists
                        $role = \Spatie\Permission\Models\Role::where('name', $roleName)
                            ->where('guard_name', 'web')
                            ->first();
                        
                        if (!$role) {
                            Log::error("Role not found: {$roleName}");
                            throw new \Exception("Role {$roleName} not found in database");
                        }
                        
                        // Assign role
                        $user->assignRole($roleName);
                        
                        Log::info("Role assigned to user", [
                            'user_id' => $user->id,
                            'role' => $roleName
                        ]);
                        
                    } catch (\Throwable $e) {
                        // JANGAN SKIP! Log error-nya
                        Log::error('Failed to assign role to user', [
                            'user_id' => $user->id,
                            'error' => $e->getMessage(),
                            'trace' => $e->getTraceAsString()
                        ]);
                        
                        // Rethrow biar seeder fail (lebih baik fail daripada silent)
                        throw $e;
                    }
                });

            Schema::enableForeignKeyConstraints();
        });
    }
}