<?php 


use App\Http\Controllers\AdminController;
use App\Http\Controllers\JurusanController;
use App\Http\Controllers\KelasController;
use App\Http\Controllers\KelasDetailController;
use App\Http\Controllers\OverviewsController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\TahunAjarController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
 
Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard.index'); // user sudah login
    }
    return redirect()->route('login'); // guest
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('dashboard')->name('dashboard.')->group(function () {
        Route::get('/', [OverviewsController::class, 'index'])
            ->name('index')
            ->middleware('permission:dashboard.view');

        // Kelas Detail (riwayat) - resource
        Route::resource('kelas-detail', KelasDetailController::class)
            ->names('kelas_detail')
            ->middleware([
                'permission:kelas_detail.view|kelas_detail.create|kelas_detail.edit|kelas_detail.delete'
            ]);

        // Tahun Ajar
        Route::prefix('tahun-ajar')->name('tahun_ajar.')->group(function () {
            Route::get('/', [TahunAjarController::class, 'index'])->name('index')->middleware('permission:tahun_ajar.view');
            Route::get('/json_data', [TahunAjarController::class, 'json_data'])->name('json_data')->middleware('permission:tahun_ajar.view');
            Route::post('/', [TahunAjarController::class, 'store'])->name('store')->middleware('permission:tahun_ajar.create');
            Route::get('/{tahun_ajar}', [TahunAjarController::class, 'show'])->name('show')->middleware('permission:tahun_ajar.view');
            Route::put('/{tahun_ajar}', [TahunAjarController::class, 'update'])->name('update')->middleware('permission:tahun_ajar.edit');
            Route::delete('/{tahun_ajar}', [TahunAjarController::class, 'destroy'])->name('destroy')->middleware('permission:tahun_ajar.delete');
            Route::post('/{tahun_ajar}/status', [TahunAjarController::class, 'statusUpdate'])->name('status')->middleware('permission:tahun_ajar.edit');
        });

        // Siswa
        Route::prefix('siswa')->name('siswa.')->group(function () {
            Route::get('/', [SiswaController::class, 'index'])->name('index')->middleware('permission:siswa.view');
            Route::post('/', [SiswaController::class, 'store'])->name('store')->middleware('permission:siswa.create');
            Route::get('/{siswa}', [SiswaController::class, 'show'])->name('show')->middleware('permission:siswa.view');
            Route::put('/{siswa}', [SiswaController::class, 'update'])->name('update')->middleware('permission:siswa.edit');
            Route::delete('/{siswa}', [SiswaController::class, 'destroy'])->name('destroy')->middleware('permission:siswa.delete');
            Route::post('/{siswa}/status', [SiswaController::class, 'statusUpdate'])->name('status')->middleware('permission:siswa.edit');
        });

        // User management (hanya super_admin) — lanjutkan pakai permission juga
     Route::middleware(['role:super_admin'])->prefix('admin')->name('admin.')->group(function () {
            Route::get('/json_data_role', [AdminController::class, 'json_data_role'])->name('json_data_role')->middleware('permission:users.view');
            Route::get('/', [AdminController::class, 'index'])->name('index')->middleware('permission:users.view');
            Route::post('/', [AdminController::class, 'store'])->name('store')->middleware('permission:users.create');
            Route::get('/{admin}', [AdminController::class, 'show'])->name('show')->middleware('permission:users.view');
            Route::put('/{admin}', [AdminController::class, 'update'])->name('update')->middleware('permission:users.edit');
            Route::delete('/{admin}', [AdminController::class, 'destroy'])->name('destroy')->middleware('permission:users.delete');
               Route::post('/bulk-roles', [AdminController::class, 'bulkUpdateRoles'])
         ->name('bulk_roles')->middleware('permission:users.edit');
        });

        // Kelas
        Route::prefix('kelas')->name('kelas.')->group(function () {
            Route::get('/', [KelasController::class, 'index'])->name('index')->middleware('permission:kelas.view');
            Route::get('/json_data', [KelasController::class, 'json_data'])->name('json_data')->middleware('permission:kelas.view');
            Route::post('/', [KelasController::class, 'store'])->name('store')->middleware('permission:kelas.create');
            Route::get('/{kelas}', [KelasController::class, 'show'])->name('show')->middleware('permission:kelas.view');
            Route::put('/{kelas}', [KelasController::class, 'update'])->name('update')->middleware('permission:kelas.edit');
            Route::delete('/{kelas}', [KelasController::class, 'destroy'])->name('destroy')->middleware('permission:kelas.delete');
            Route::post('/{kelas}/status', [KelasController::class, 'statusUpdate'])->name('status')->middleware('permission:kelas.edit');
        });

        // Jurusan
        Route::prefix('jurusan')->name('jurusan.')->group(function () {
            Route::get('/', [JurusanController::class, 'index'])->name('index')->middleware('permission:jurusan.view');
            Route::get('/json_data', [JurusanController::class, 'json_data'])->name('json_data')->middleware('permission:jurusan.view');
            Route::post('/', [JurusanController::class, 'store'])->name('store')->middleware('permission:jurusan.create');
            Route::get('/{jurusan}', [JurusanController::class, 'show'])->name('show')->middleware('permission:jurusan.view');
            Route::put('/{jurusan}', [JurusanController::class, 'update'])->name('update')->middleware('permission:jurusan.edit');
            Route::delete('/{jurusan}', [JurusanController::class, 'destroy'])->name('destroy')->middleware('permission:jurusan.delete');
            Route::post('/{jurusan}/status', [JurusanController::class, 'statusUpdate'])->name('status')->middleware('permission:jurusan.edit');
        });
    });
});

require __DIR__.'/settings.php';
