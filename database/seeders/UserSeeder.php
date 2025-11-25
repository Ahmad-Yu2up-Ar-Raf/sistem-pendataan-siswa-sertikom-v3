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

class UserSeeder extends Seeder
{
    /**
     * Assumptions / defaults:
     * - USERS_COUNT: number of users with nested tahun_ajars/kelas/siswa
     * - each user will own TAHUN_PER_USER tahun ajar, each tahun has KELAS_PER_TAHUN kelas, each kelas has SISWA_PER_KELAS siswa
     */
    public function run(): void
    {
        $USERS_COUNT = 6;
        $TAHUN_PER_USER = 2;
        $KELAS_PER_TAHUN = 4;
        $SISWA_PER_KELAS = 10;

        DB::transaction(function () use ($USERS_COUNT, $TAHUN_PER_USER, $KELAS_PER_TAHUN, $SISWA_PER_KELAS) {
            Schema::disableForeignKeyConstraints();

            // optional truncation for idempotency (be conservative)
            // DB::table('users')->truncate();

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
                    // assign a role if Spatie or similar exists; wrap if not
                    try {
                        $user->assignRole(RoleEnums::SuperAdmin->value);
                    } catch (\Throwable $e) {
                        // role package not available in this environment — skip
                    }
                });

            Schema::enableForeignKeyConstraints();
        });
    }
}