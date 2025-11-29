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
    return Inertia::render('welcome', [
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
            Route::delete('/{tahun_ajar}', [TahunAjarController::class, 'destroy'])->name('destroy');
            Route::put('/{tahun_ajar}', [TahunAjarController::class, 'update'])->name('update');
            Route::post('/{tahun_ajar}/status', [TahunAjarController::class, 'statusUpdate'])->name('status');
        });
        
        
        
        
        Route::prefix('siswa')->name('siswa.')->group(function () {
            Route::get('/', [SiswaController::class, 'index'])->name('index');
            Route::post('/', [SiswaController::class, 'store'])->name('store');
            Route::get('/{siswa}', [SiswaController::class, 'show'])->name('show');
                Route::delete('/{siswa}', [SiswaController::class, 'destroy'])->name('destroy');
            Route::put('/{siswa}', [SiswaController::class, 'update'])->name('update');
            Route::post('/{siswa}/status', [SiswaController::class, 'statusUpdate'])->name('status');
        });
        
        Route::prefix('kelas')->name('kelas.')->group(function () {
            Route::get('/', [KelasController::class, 'index'])->name('index');
            Route::get('/json_data', [KelasController::class, 'json_data'])->name('json_data');
            Route::post('/', [KelasController::class, 'store'])->name('store');
            Route::get('/{kelas}', [KelasController::class, 'show'])->name('show');
              Route::delete('/{kelas}', [KelasController::class, 'destroy'])->name('destroy');
            Route::put('/{kelas}', [KelasController::class, 'update'])->name('update');
            Route::post('/{kelas}/status', [KelasController::class, 'statusUpdate'])->name('status');
        });
        Route::prefix('jurusan')->name('jurusan.')->group(function () {
            Route::get('/', [JurusanController::class, 'index'])->name('index');
            Route::post('/', [JurusanController::class, 'store'])->name('store');
                Route::delete('/{jurusan}', [JurusanController::class, 'destroy'])->name('destroy');
            Route::post('/{jurusan}/status', [JurusanController::class, 'statusUpdate'])->name('status');
                Route::put('/{jurusan}', [JurusanController::class, 'update'])->name('update');
                        Route::get('/json_data', [JurusanController::class, 'json_data'])->name('json_data');
            Route::get('/{jurusan}', [JurusanController::class, 'show'])->name('show');
        });
    });
});

require __DIR__.'/settings.php';
