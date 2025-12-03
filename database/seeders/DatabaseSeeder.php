<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Urutan penting: jurusan harus ada sebelum factories yang memilih jurusan
        $this->call([
            RolesAndPermissionsSeeder::class,   // role/permission setup
            JurusanSeeder::class,               // MUST run first
            UserSeeder::class,                  // creates nested tahun_ajars -> kelases -> siswas via has()
        ]);
    }
}