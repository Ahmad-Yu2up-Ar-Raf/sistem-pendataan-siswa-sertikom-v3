<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Urutan penting: jurusan harus ada sebelum factories yang memilih jurusan
        $this->call([
            JurusanSeeder::class,               // MUST run first
            RolesAndPermissionsSeeder::class,   // role/permission setup
            UserSeeder::class,                  // creates nested tahun_ajars -> kelases -> siswas via has()
        ]);
    }
}