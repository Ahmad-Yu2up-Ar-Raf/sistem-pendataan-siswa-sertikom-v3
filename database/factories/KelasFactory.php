<?php

namespace Database\Factories;

use App\Enums\StatusEnums;
use App\Enums\TingkatEnums;
use App\Models\Kelas;
use App\Models\TahunAjar;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;

/**
 * Fixes:
 * - closed broken string/parentheses
 * - jurusan factory NOT used per requirements: try existing jurusan id or insert minimal via DB (inferred)
 */
class KelasFactory extends Factory
{
    protected $model = Kelas::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tingkatList = TingkatEnums::cases();
        $tingkat = $this->faker->randomElement($tingkatList)->value;

        // Pick existing jurusan (JurusanSeeder should populate); do NOT insert here
        $jurusanId = DB::table('jurusans')->inRandomOrder()->value('id') ?? 1;

        return [
            'nama_kelas' => $tingkat . ' - ' . $this->faker->bothify('##?'),
            'tingkat' => $tingkat,
            'jurusan_id' => $jurusanId,
            'tahun_ajar_id' => TahunAjar::factory(),
            'kapasitas_maksimal' => $this->faker->numberBetween(30, 40),
            'wali_kelas' => $this->faker->name(),
            'ruangan' => $this->faker->bothify('R-##'),
            'status' => StatusEnums::Aktif->value,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
        ];
    }

    public function aktif(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => StatusEnums::Aktif->value,
        ]);
    }

    public function nonaktif(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => StatusEnums::NonAktif->value ?? 'nonaktif',
        ]);
    }
}
