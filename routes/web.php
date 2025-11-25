<?php

use App\Http\Controllers\JurusanController;
use App\Http\Controllers\KelasController;
use App\Http\Controllers\KelasDetailController;
use App\Http\Controllers\OverviewsController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\TahunAjarController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('auth/login', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('dashboard')->name('dashboard.')->group(function () {
        Route::get('/', [OverviewsController::class, 'index'])->name('index');


        Route::resource('/kelas_detail', KelasDetailController::class);
        
    
        Route::prefix('tahun_ajar')->name('tahun_ajar.')->group(function () {
            Route::get('/', [TahunAjarController::class, 'index'])->name('index');
            Route::get('/json_data', [TahunAjarController::class, 'json_data'])->name('json_data');
            Route::post('/', [TahunAjarController::class, 'store'])->name('store');
            Route::get('/{siswa}', [TahunAjarController::class, 'show'])->name('show');
        });




        Route::prefix('siswa')->name('siswa.')->group(function () {
            Route::get('/', [SiswaController::class, 'index'])->name('index');
            Route::post('/', [SiswaController::class, 'store'])->name('store');
            Route::get('/{siswa}', [SiswaController::class, 'show'])->name('show');
        });

        Route::prefix('kelas')->name('kelas.')->group(function () {
            Route::get('/', [KelasController::class, 'index'])->name('index');
            Route::post('/', [KelasController::class, 'store'])->name('store');
            Route::get('/{kelas}', [KelasController::class, 'show'])->name('show');
        });
        Route::prefix('jurusan')->name('jurusan.')->group(function () {
            Route::get('/', [JurusanController::class, 'index'])->name('index');
            Route::post('/', [JurusanController::class, 'store'])->name('store');
            Route::get('/{jurusan}', [JurusanController::class, 'show'])->name('show');
        });
    });
});

require __DIR__.'/settings.php';
