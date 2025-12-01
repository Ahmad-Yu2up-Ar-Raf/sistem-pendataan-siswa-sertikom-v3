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
use Carbon\Carbon;

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

            // create nested data using factories
            $users = User::factory()
                ->count($USERS_COUNT)
                ->has(
                    TahunAjar::factory()
                        ->count($TAHUN_PER_USER)
                        ->has(
                            Kelas::factory()
                                ->count($KELAS_PER_TAHUN)
                                ->has(
                                    Siswa::factory()->count($SISWA_PER_KELAS),
                                    'siswa' // pastikan relasi nama di model Kelas sesuai
                                ),
                            'kelases' // pastikan relasi nama di TahunAjar sesuai
                        ),
                    'tahunAjars' // pastikan relasi nama di User sesuai
                )
                ->create();

            // --- NOW: assign roles & adjust timestamps in a deterministic cascading way ---
            // base date (6 months ago) - you can change base offset
            $base = Carbon::now()->subMonths(6);

            foreach ($users as $uIndex => $user) {
                // 1) set user created_at (e.g., each user separated by 7 days)
                $userCreated = $base->copy()->addDays($uIndex * 7);
                $user->update([
                    'created_at' => $userCreated,
                    'updated_at' => $userCreated->copy()->addHours(1),
                ]);

                // assign role safely (log and throw if role missing)
                try {
                    $roleName = RoleEnums::SuperAdmin->value;
                    $role = \Spatie\Permission\Models\Role::where('name', $roleName)
                        ->where('guard_name', 'web')
                        ->first();

                    if (!$role) {
                        Log::error("Role not found: {$roleName}");
                        throw new \Exception("Role {$roleName} not found in database");
                    }

                    $user->assignRole($roleName);
                } catch (\Throwable $e) {
                    Log::error('Failed to assign role to user', [
                        'user_id' => $user->id,
                        'error' => $e->getMessage(),
                    ]);
                    throw $e;
                }

                // eager load relations to avoid N+1 issues (refresh relations)
                $user->load('tahunAjars.kelases.siswa');

                // 2) tahun ajar for this user
                foreach ($user->tahunAjars as $taIndex => $tahunAjar) {
                    // each tahun ajar 30 days after user (or any offset)
                    $taCreated = $userCreated->copy()->addDays(($taIndex + 1) * 30);
                    $tahunAjar->update([
                        'created_at' => $taCreated,
                        'updated_at' => $taCreated->copy()->addHours(2),
                    ]);

                    // 3) kelas for this tahun ajar
                    foreach ($tahunAjar->kelases as $kIndex => $kelas) {
                        // each kelas 5 days after tahun ajar
                        $kelasCreated = $taCreated->copy()->addDays(($kIndex + 1) * 5);
                        $kelas->update([
                            'created_at' => $kelasCreated,
                            'updated_at' => $kelasCreated->copy()->addHours(3),
                        ]);

                        // 4) siswa for this kelas
                        foreach ($kelas->siswa as $sIndex => $siswa) {
                            // distribute siswa creation over days relative to kelas
                            $siswaCreated = $kelasCreated->copy()->addHours(($sIndex + 1) * 6); // every 6 hours
                            $siswa->update([
                                'created_at' => $siswaCreated,
                                'updated_at' => $siswaCreated->copy()->addMinutes(30),
                            ]);
                        }
                    }
                }
            }

            Schema::enableForeignKeyConstraints();
        });
    }
}
