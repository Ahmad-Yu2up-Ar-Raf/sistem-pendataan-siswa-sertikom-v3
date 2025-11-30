<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Enums\RoleEnums; // kalau kamu sudah ada
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // refresh cache
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // resources & actions
        $resources = [
            'tahun_ajar' => ['view','create','edit','delete'],
            'jurusan' => ['view','create','edit','delete'],
            'kelas' => ['view','create','edit','delete'],
            'siswa' => ['view','create','edit','delete','import','export'],
            'kelas_detail' => ['view','create','edit','delete','approve'],
            'users' => ['view','create','edit','delete','reset-password'],
            'dashboard' => ['view'],
            'reports' => ['view','export'],
        ];

        // create permissions
        foreach ($resources as $resource => $actions) {
            foreach ($actions as $action) {
                Permission::firstOrCreate(['name' => "{$resource}.{$action}"]);
            }
        }

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // create roles
        $super = Role::firstOrCreate(['name' => RoleEnums::SuperAdmin->value, 'guard_name' => 'web']);
        $admin = Role::firstOrCreate(['name' => RoleEnums::Admin->value, 'guard_name' => 'web']);
        $kepala = Role::firstOrCreate(['name' => 'kepala_kurikulum', 'guard_name' => 'web']);
        $guru = Role::firstOrCreate(['name' => 'guru', 'guard_name' => 'web']);
        $operator = Role::firstOrCreate(['name' => 'operator', 'guard_name' => 'web']);
        $siswaRole = Role::firstOrCreate(['name' => 'siswa', 'guard_name' => 'web']);

        // assign permissions
        // SuperAdmin: all
        $super->syncPermissions(Permission::all());

        // Admin: almost all except maybe 'users.delete' on super accounts
        $adminPerms = Permission::where('name', 'NOT LIKE', 'users.delete')->get();
        $admin->syncPermissions($adminPerms);

        // Kepala Kurikulum: view kelas, siswa, kelas_detail, reports
        $kepala->syncPermissions(Permission::whereIn('name', [
            'kelas.view','siswa.view','kelas_detail.view','kelas_detail.approve','dashboard.view','reports.view'
        ])->get());

        // Guru: view kelas & siswa (scoped via policies), dashboard
        $guru->syncPermissions(Permission::whereIn('name', [
            'kelas.view','siswa.view','dashboard.view'
        ])->get());

        // Operator: import/export & view siswa
        $operator->syncPermissions(Permission::whereIn('name', [
            'siswa.import','siswa.export','siswa.view','kelas.view'
        ])->get());

        // Siswa: hanya lihat diri sendiri (use policies to enforce)
        $siswaRole->syncPermissions(Permission::whereIn('name', [
            'siswa.view','kelas_detail.view','dashboard.view'
        ])->get());

        // optional: create default super admin user
        $superUser = User::firstOrCreate(
            ['email' => 'superadmin@example.com'],
            ['name' => 'Super Admin', 'password' => Hash::make('password123')]
        );
        $superUser->assignRole($super);

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }
}
