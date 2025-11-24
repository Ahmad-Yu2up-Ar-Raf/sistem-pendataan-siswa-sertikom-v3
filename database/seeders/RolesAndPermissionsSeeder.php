<?php

namespace Database\Seeders;

use App\Enums\RoleEnums;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

       $permissions = [
            'users.view',
            'users.edit',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm]);
        }

        // update cache to know about the newly created permissions (required if using WithoutModelEvents in seeders)
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();


        // create roles and assign created permissions

        // this can be done as separate statements
        $SuperAdminRole = Role::firstOrCreate(['name' => RoleEnums::SuperAdmin->value, 'guard_name' => 'web']);
        $AdminRole = Role::firstOrCreate(['name' => RoleEnums::Admin->value, 'guard_name' => 'web']);

        $SuperAdminRole->syncPermissions([
            'users.view',  'users.edit',
        ]);

    }
}