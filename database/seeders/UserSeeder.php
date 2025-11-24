<?php

namespace Database\Seeders;

use App\Enums\RoleEnums;
use App\Models\Jurusan;
use App\Models\TahunAjar;
use App\Models\User;
use Exception;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
    // Reduced number of records for development/testing
$userCount = 6; // Reduced to 10 users for testing
$productsPerVendor = 1; // Reduced to 5 products per vendor

// Clear tracked URLs before starting


// Create users in smaller batches with proper rate limiting
$users = collect();
for ($i = 0; $i < $userCount; $i += 2) {  // Process 2 users at a time
    $batchSize = min(2, $userCount - $i);  // Handle last batch correctly

    try {
        $batchUsers = User::factory()
            ->count($batchSize)
             ->has(
                        Jurusan::factory($productsPerVendor)
                            ->state(function () {
                                // Add longer delay between product creation
                                sleep(2); // 2 second delay between products
                                return [];
                            })
                    )

            ->create();
    } catch (Exception $e) {
        Log::error('Failed to create batch of users and products', [
            'error' => $e->getMessage(),
            'batch_size' => $batchSize,
            'products_per_vendor' => $productsPerVendor
        ]);
        throw $e;
    }

    // Assign roles to the batch
    $batchUsers->each(function ($superAdmin) {
        $superAdmin->assignRole(RoleEnums::SuperAdmin->value);
    });

    $users = $users->concat($batchUsers);

    if ($i + $batchSize < $userCount) {
        sleep(3); // 3 second delay between batches, but not after the last batch
    }
}
    }
}