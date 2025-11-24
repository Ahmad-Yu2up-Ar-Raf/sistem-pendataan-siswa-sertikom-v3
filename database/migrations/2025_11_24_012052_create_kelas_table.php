<?php

use App\Enums\StatusEnums;
use App\Enums\TingkatEnums;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('kelas', function (Blueprint $table) {
         $table->id();
            $table->string('nama_kelas', 100);
            $table->enum('tingkat', TingkatEnums::values());
            $table->foreignId('jurusan_id')->constrained('jurusans')->onDelete('restrict')->onUpdate('cascade'); // ON DELETE RESTRICT: tidak boleh hapus jurusan yang digunakan
            $table->foreignId('tahun_ajar_id')->constrained('tahun_ajars')->onDelete('restrict')->onUpdate('cascade'); // ON DELETE RESTRICT: tidak boleh hapus tahun ajar yang digunakan
            $table->integer('kapasitas_maksimal')->default(36)->nullable();
            $table->string('wali_kelas', 191)->nullable();
            $table->string('ruangan', 50)->nullable();
            $table->enum('status', StatusEnums::values())->default(StatusEnums::Aktif->value);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Foreign Keys - ON DELETE SET NULL untuk audit trail
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null')->onUpdate('cascade');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null')->onUpdate('cascade');

            // Indexes
            $table->index(['jurusan_id', 'tingkat', 'tahun_ajar_id'], 'idx_kelas_composite');
            $table->index('nama_kelas', 'idx_nama_kelas');
            $table->index('status', 'idx_kelas_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelas');
    }
};