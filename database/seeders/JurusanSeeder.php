<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class JurusanSeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();

        // idempotent local truncate
        DB::table('jurusans')->truncate();

        // gunakan base date (6 bulan lalu) - bisa diubah
        $base = Carbon::now()->subMonths(6);

        $names = ['Umum', 'IPA', 'IPS', 'Teknik', 'Akuntansi', 'RPL', 'TKJ', 'DKV'];

        $entries = [];
        foreach ($names as $i => $name) {
            // atur timestamp berbeda: setiap jurusan 7 hari selisih
            $createdAt = $base->copy()->addDays($i * 7);
            $updatedAt = $createdAt->copy()->addHours(2); // contoh updated sedikit berbeda

            $entries[] = [
                'kode_jurusan' => 'JUR-' . str_pad($i + 1, 3, '0', STR_PAD_LEFT),
                'nama_jurusan' => $name,
                'status' => 'aktif',
                'created_at' => $createdAt,
                'updated_at' => $updatedAt,
            ];
        }

        DB::table('jurusans')->insert($entries);

        Schema::enableForeignKeyConstraints();
    }
}
