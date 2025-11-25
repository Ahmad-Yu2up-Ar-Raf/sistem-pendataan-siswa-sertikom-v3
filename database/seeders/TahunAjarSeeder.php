<?php

namespace Database\Seeders;

use App\Models\TahunAjar;
use Illuminate\Database\Seeder;

class TahunAjarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TahunAjar::factory()
        ->count(5)
        ->create();
    }
}
