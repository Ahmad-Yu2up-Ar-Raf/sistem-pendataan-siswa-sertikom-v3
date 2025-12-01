<?php

use App\Enums\StatusEnums;
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
        Schema::create('tahun_ajars', function (Blueprint $table) {
             $table->id();
            $table->string('kode_tahun_ajar', 20)->unique();
            $table->string('nama_tahun_ajar', 100)->unique();
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->enum('status', StatusEnums::values())->default(StatusEnums::Aktif->value);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Foreign Keys - ON DELETE SET NULL untuk audit trail
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null')->onUpdate('cascade');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null')->onUpdate('cascade');

            // Indexes
            $table->unique('kode_tahun_ajar', 'idx_kode_tahun_ajar');
            $table->index('status', 'idx_tahun_ajar_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tahun_ajars');
    }
};