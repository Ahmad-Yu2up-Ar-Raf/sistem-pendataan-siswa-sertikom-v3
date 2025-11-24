<?php

use App\Enums\SemesterEnums;
use App\Enums\StatusKelasEnums;
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
        Schema::create('kelas_details', function (Blueprint $table) {
          $table->id();
            $table->foreignId('siswa_id')->constrained('siswas')->onDelete('cascade')->onUpdate('cascade'); // ON DELETE CASCADE: hapus riwayat jika siswa dihapus
            $table->foreignId('kelas_id')->constrained('kelas')->onDelete('restrict')->onUpdate('cascade'); // ON DELETE RESTRICT: tidak boleh hapus kelas yang punya riwayat
            $table->foreignId('tahun_ajar_id')->constrained('tahun_ajars')->onDelete('restrict')->onUpdate('cascade'); // ON DELETE RESTRICT: tidak boleh hapus tahun ajar yang punya riwayat
            $table->date('tanggal_masuk');
            $table->date('tanggal_keluar')->nullable();
            $table->enum('status_kelas', StatusKelasEnums::values())->default(StatusKelasEnums::Aktif->value);
            $table->enum('semester', SemesterEnums::cases())->nullable();
            $table->integer('no_urut_absen')->nullable();
            $table->decimal('nilai_rata_rata', 5, 2)->nullable();
            $table->integer('ranking')->nullable();
            $table->text('keterangan')->nullable();

            // Audit
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Foreign Keys - ON DELETE SET NULL untuk audit trail
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null')->onUpdate('cascade');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null')->onUpdate('cascade');

            // Indexes
            $table->index(['siswa_id', 'tahun_ajar_id', 'status_kelas'], 'idx_siswa_tahun_status');
            $table->index(['kelas_id', 'status_kelas'], 'idx_kelas_status');
            $table->index('status_kelas', 'idx_status_kelas');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelas_details');
    }
};