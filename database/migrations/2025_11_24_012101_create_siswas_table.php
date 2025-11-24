<?php

use App\Enums\AgamaEnums;
use App\Enums\JenisKelaminEnums;
use App\Enums\StatusSiswaEnums;
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
        Schema::create('siswas', function (Blueprint $table) {
            $table->id();
            $table->string('nisn', 20)->unique(); // WAJIB UNIQUE
            $table->string('nis', 20)->unique()->nullable();
            $table->string('nama_lengkap', 191);
            $table->enum('jenis_kelamin', JenisKelaminEnums::values()); // L = Laki-laki, P = Perempuan
            $table->string('tempat_lahir', 100);
            $table->date('tanggal_lahir');
            $table->enum('agama', AgamaEnums::values())->default(AgamaEnums::Islam->value) ;
            $table->integer('anak_ke')->nullable();
            $table->integer('jumlah_saudara')->nullable();

            // Alamat Siswa
            $table->text('alamat');
            $table->string('rt', 5)->nullable();
            $table->string('rw', 5)->nullable();
            $table->string('kelurahan', 100)->nullable();
            $table->string('kecamatan', 100)->nullable();
            $table->string('kota', 100)->nullable();
            $table->string('provinsi', 100)->nullable();
            $table->string('kode_pos', 10)->nullable();

            // Kontak Siswa
            $table->string('telepon', 20)->nullable();
            $table->string('email', 191)->unique()->nullable();

            // Data Orang Tua - Ayah
            $table->string('nama_ayah', 191);
            $table->string('pekerjaan_ayah', 100)->nullable();
            $table->string('pendidikan_ayah', 50)->nullable();
            $table->string('telepon_ayah', 20)->nullable();

            // Data Orang Tua - Ibu
            $table->string('nama_ibu', 191);
            $table->string('pekerjaan_ibu', 100)->nullable();
            $table->string('pendidikan_ibu', 50)->nullable();
            $table->string('telepon_ibu', 20)->nullable();

            // Data Wali
            $table->string('nama_wali', 191)->nullable();
            $table->string('hubungan_wali', 50)->nullable();
            $table->string('pekerjaan_wali', 100)->nullable();
            $table->string('telepon_wali', 20)->nullable();
            $table->text('alamat_wali')->nullable();

            // Data Akademik
            $table->foreignId('jurusan_id')->nullable()->constrained('jurusans')->onDelete('set null')->onUpdate('cascade'); // ON DELETE SET NULL: tetap simpan data siswa
            $table->foreignId('tahun_masuk_id')->nullable()->constrained('tahun_ajars')->onDelete('set null')->onUpdate('cascade'); // ON DELETE SET NULL: tetap simpan data siswa
            $table->string('asal_sekolah', 191)->nullable();

            // Status & Media
            $table->string('foto', 255)->nullable();
            $table->enum('status', StatusSiswaEnums::values())->default(StatusSiswaEnums::Aktif->value);
            $table->text('keterangan')->nullable();

            // Audit
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Foreign Keys - ON DELETE SET NULL untuk audit trail
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null')->onUpdate('cascade');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null')->onUpdate('cascade');

 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('siswas');
    }
};