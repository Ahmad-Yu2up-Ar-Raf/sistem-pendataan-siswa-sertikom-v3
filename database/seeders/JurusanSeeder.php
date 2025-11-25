<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class JurusanSeeder extends Seeder
{
    /**
     * Populate jurusans table with expected column names (kode_jurusan, nama_jurusan, status).
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();

        // idempotent local truncate
        DB::table('jurusans')->truncate();

        $now = now();
        $names = ['Umum', 'IPA', 'IPS', 'Teknik', 'Akuntansi'];

        $entries = [];
        foreach ($names as $i => $name) {
            $entries[] = [
                'kode_jurusan' => 'JUR-' . str_pad($i + 1, 3, '0', STR_PAD_LEFT),
                'nama_jurusan' => $name,
                'status' => 'aktif', // inferred default
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('jurusans')->insert($entries);

        Schema::enableForeignKeyConstraints();
    }
}
