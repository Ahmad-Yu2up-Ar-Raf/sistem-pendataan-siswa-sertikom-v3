<?php

namespace Database\Factories;

use App\Enums\AgamaEnums;
use App\Enums\JenisKelaminEnums;
use App\Enums\StatusSiswaEnums;
use App\Models\Siswa;
use App\Models\TahunAjar;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;

class SiswaFactory extends Factory
{
    protected $model = Siswa::class;

    public function definition(): array
    {
        $jenisKelamin = $this->faker->randomElement(array_map(fn($e) => $e->value, JenisKelaminEnums::cases()));
        $firstName = $jenisKelamin === 'L'
            ? $this->faker->firstNameMale()
            : $this->faker->firstNameFemale();

        // Pick existing jurusan (JurusanSeeder should populate)
        $jurusanId = DB::table('jurusans')->inRandomOrder()->value('id') ?? null;

        // Safely get kelas_id (can be null)
        $kelasId = DB::table('kelas')->inRandomOrder()->value('id') ?? null;

        // Safely get tahun_ajar_id
        $tahunAjarId = DB::table('tahun_ajars')->inRandomOrder()->value('id') ?: TahunAjar::factory()->create()->id;

        return [
            'nisn' => $this->faker->unique()->numerify('##########'),
            'nis' => $this->faker->unique()->numerify('##########'),
            'nama_lengkap' => $firstName . ' ' . $this->faker->lastName(),
            'jenis_kelamin' => $jenisKelamin,
             
          
            'tanggal_lahir' => $this->faker->date('Y-m-d', '-15 years'),
            'agama' => $this->faker->randomElement(array_map(fn($e) => $e->value, AgamaEnums::cases())),
            'anak_ke' => $this->faker->numberBetween(1, 5),
            'jumlah_saudara' => $this->faker->numberBetween(0, 4),
            'alamat' => $this->faker->address(),
            'rt' => $this->faker->numerify('##'),
            'rw' => $this->faker->numerify('##'),
            'kelurahan' => $this->faker->word(),
            'kecamatan' => $this->faker->word(),
            'kota' => $this->faker->city(),
            'provinsi' => $this->faker->state(),
            'kode_pos' => $this->faker->postcode(),
            'telepon' => $this->faker->numerify('08##########'),
            'email' => $this->faker->unique()->safeEmail(),
            'nama_ayah' => $this->faker->name(),
            'pekerjaan_ayah' => $this->faker->jobTitle(),
            'pendidikan_ayah' => $this->faker->randomElement(['SMA', 'D3', 'S1', 'S2']),
            'telepon_ayah' => $this->faker->numerify('08##########'),
            'nama_ibu' => $this->faker->name(),
            'pekerjaan_ibu' => $this->faker->jobTitle(),
            'pendidikan_ibu' => $this->faker->randomElement(['SMA', 'D3', 'S1', 'S2']),
            'telepon_ibu' => $this->faker->numerify('08##########'),
            'nama_wali' => null,
            'hubungan_wali' => null,
            'pekerjaan_wali' => null,
            'telepon_wali' => null,
            'alamat_wali' => null,
            'jurusan_id' => $jurusanId,
            'kelas_id' => $kelasId,
            'tahun_ajar_id' => $tahunAjarId,
            'asal_sekolah' => $this->faker->company(),
            'foto' => null,
            'status' => $this->faker->randomElement(array_map(fn($e) => $e->value, StatusSiswaEnums::cases())), // fixed column name
            'keterangan' => null,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
        ];
    }
}
