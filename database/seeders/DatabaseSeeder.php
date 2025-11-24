<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

       $this->call([
            // 1. Users first (no dependencies)
            RolesAndPermissionsSeeder::class,
            UserSeeder::class,

            // 2. Master data (depend on users for created_by)

        ]);

    }
}